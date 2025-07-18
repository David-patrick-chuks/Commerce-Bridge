import { Request, Response } from 'express';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { MessageMedia } from 'whatsapp-web.js';
import { chatSession } from '../chatbot/session-manager';
import { STORE_CATEGORIES } from '../constants/categories';
import { UserModel } from '../models/user';
import { uploadImage } from '../services/cloudinary-service';
import { notificationService } from '../services/notification-service';
import { validateAddressWithShipbubble } from '../services/shipbubble-service';
import { unknownUserService } from '../services/unknown-user-service';
import { CreateUserRequest, StoreCategoriesResponse } from '../types';
import { generateWelcomeBanner } from '../utils/banner-generator';
import { project_name } from '../config';

// Assume whatsappClient is imported or passed in

export const createOrUpdateUser = async (req: Request, res: Response, whatsappClient: any) => {
  let { phoneNumber, name, email, userType, storeName, storeDescription, storeAddress, storeCategories }: CreateUserRequest = req.body;
  let profileImage = req.body.profileImage;
  if (!phoneNumber || !name || !email) {
    res.status(400).json({ error: 'phoneNumber, name, and email are required' });
    return;
  }
  // Normalize phone number (strip @c.us)
  phoneNumber = phoneNumber.replace(/@c\.us$/, '');
  userType = userType || 'customer';
  // Validate seller fields
  let storeAddressValidation = undefined;
  if (userType === 'seller') {
    if (!storeName) {
      return res.status(400).json({ error: 'storeName is required for sellers' });
    }
    if (!storeCategories || !Array.isArray(storeCategories) || storeCategories.length === 0) {
      return res.status(400).json({ error: 'At least one storeCategory is required for sellers' });
    }
    // --- Shipbubble address validation ---
    if (!storeAddress) {
      return res.status(400).json({ error: 'storeAddress is required for sellers' });
    }
    try {
      const validation = await validateAddressWithShipbubble({
        phone: phoneNumber,
        email,
        name,
        address: storeAddress,
      });
      if (validation.status !== 'success') {
        return res.status(400).json({ error: 'Invalid store address. Please check and try again.' });
      }
      storeAddressValidation = validation.data;
    } catch (err) {
      console.error('❌ Shipbubble address validation failed:', err);
      return res.status(500).json({ error: 'Failed to validate store address. Please try again.' });
    }
  }
  // Handle image upload
  if (req.file) {
    try {
      const result = await uploadImage(req.file.path);
      profileImage = result.secure_url;
      // Remove local file after upload
      fs.unlink(req.file.path, () => {});
    } catch (err) {
      console.error('❌ Cloudinary upload failed:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }
  }
  try {
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { name, email, userType, profileImage, storeName, storeDescription, storeAddress, storeCategories, storeAddressValidation },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Mark unknown user as converted if they existed
    try {
      await unknownUserService.markAsConverted(phoneNumber, userType);
      console.log(`✅ Marked unknown user ${phoneNumber} as converted to ${userType}`);
    } catch (err) {
      console.error('❌ Failed to mark unknown user as converted:', err);
    }

    // Send welcome notification based on user type
    try {
      const templates = notificationService.getNotificationTemplates();
      const template = userType === 'customer' ? templates.customer.welcome : templates.seller.welcome;
      
      await notificationService.createNotification({
        phoneNumber,
        userType,
        title: template.title,
        message: template.message,
        type: template.type,
        category: 'system'
      });
      console.log(`✅ Sent welcome notification to ${phoneNumber}`);
    } catch (err) {
      console.error('❌ Failed to send welcome notification:', err);
    }

    // If a session exists for this phoneNumber, clear needsAccount
    const session = await chatSession.getSession(phoneNumber);
    if (session && session.needsAccount) {
      session.needsAccount = false;
      await chatSession.updateSession(phoneNumber, session);
      console.log(`✅ needsAccount cleared for ${phoneNumber}`);
    }
    // Force session refresh after account creation/update
    await chatSession.refreshSessionFromDB(phoneNumber);
    // Send WhatsApp custom banner after account creation
    if (user && user.phoneNumber && user.name) {
      try {
        const waNumber = user.phoneNumber.endsWith('@c.us') ? user.phoneNumber : user.phoneNumber + '@c.us';
        const bannerPath = await generateWelcomeBanner(user.name);
        const caption = `Welcome to ${project_name}, ${user.name}! Your account is ready. Shop & sell on WhatsApp.`;
        console.log('Sending WhatsApp image with caption:', { waNumber, bannerPath, caption });
        await whatsappClient.sendMessage(waNumber, MessageMedia.fromFilePath(bannerPath), { caption });
        // Fallback: send caption as a separate message if it doesn't show with the image
        setTimeout(async () => {
          try {
            console.log('Sending fallback text caption:', caption);
            await whatsappClient.sendMessage(waNumber, caption);
          } catch (fallbackErr) {
            console.error('❌ Fallback text message failed:', fallbackErr);
          }
        }, 2000); // 2 seconds delay to avoid message collision
        await fsPromises.unlink(bannerPath);
        console.log(`✅ Welcome banner sent to ${user.name} (${user.phoneNumber})`);
      } catch (whatsappError) {
        console.error('❌ Failed to send WhatsApp welcome banner:', whatsappError);
        // Don't fail the user creation if WhatsApp message fails
      }
    }
    res.json(user);
    return;
  } catch (err) {
    console.error('❌ Failed to create/update user:', err);
    res.status(500).json({ error: 'Failed to create/update user' });
    return;
  }
};

export const getAllStoreCategories = async (req: Request, res: Response) => {
  try {
    const categories = await UserModel.distinct('storeCategories', { userType: 'seller', storeCategories: { $exists: true, $ne: [] } });
    // Flatten and dedupe in case of arrays
    const flat = Array.from(new Set(categories.flat().filter(Boolean)));
    const response: StoreCategoriesResponse = { categories: flat };
    res.json(response);
  } catch (err) {
    console.error('❌ Failed to fetch store categories:', err);
    res.status(500).json({ error: 'Failed to fetch store categories' });
  }
};

export const getAllPredefinedCategories = (req: Request, res: Response) => {
  const response: StoreCategoriesResponse = { categories: STORE_CATEGORIES };
  res.json(response);
}; 