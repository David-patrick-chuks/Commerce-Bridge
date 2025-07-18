import torch
import clip
from PIL import Image

_clip_model = None
_clip_preprocess = None
_clip_device = "cuda" if torch.cuda.is_available() else "cpu"
EMBEDDING_DIM = 768  # dimension for ViT-L/14

def initialize_clip():
    """Initialize CLIP model and preprocess, loading only once."""
    global _clip_model, _clip_preprocess
    if _clip_model is None or _clip_preprocess is None:
        _clip_model, _clip_preprocess = clip.load("ViT-L/14", device=_clip_device)
    return _clip_model, _clip_preprocess

def image_to_embedding(pil_image):
    """Convert a PIL image to a 768-dimensional CLIP embedding."""
    if not isinstance(pil_image, Image.Image):
        raise ValueError("Input must be a PIL.Image.Image object")
    model, preprocess = initialize_clip()
    image_input = preprocess(pil_image).unsqueeze(0).to(_clip_device)
    with torch.no_grad():
        embedding = model.encode_image(image_input).cpu().numpy()[0]
    if embedding.shape[0] != EMBEDDING_DIM:
        raise ValueError(f"CLIP embedding must be {EMBEDDING_DIM} dimensions, got {embedding.shape[0]}")
    return embedding.tolist()

def batch_images_to_embeddings(pil_images, target_size=(224, 224), batch_size=8):
    """Convert a list of PIL images to a list of 768-dimensional CLIP embeddings using batching and resizing."""
    if not pil_images:
        return []
    model, preprocess = initialize_clip()
    # Resize images if needed
    resized_images = [img.resize(target_size) for img in pil_images]
    # Preprocess all images
    image_inputs = torch.stack([preprocess(img) for img in resized_images]).to(_clip_device)
    embeddings = []
    with torch.no_grad():
        for i in range(0, len(image_inputs), batch_size):
            batch = image_inputs[i:i+batch_size]
            batch_emb = model.encode_image(batch).cpu().numpy()
            embeddings.extend(batch_emb)
    # Ensure correct shape
    for emb in embeddings:
        if emb.shape[0] != EMBEDDING_DIM:
            raise ValueError(f"CLIP embedding must be {EMBEDDING_DIM} dimensions, got {emb.shape[0]}")
    return [emb.tolist() for emb in embeddings] 