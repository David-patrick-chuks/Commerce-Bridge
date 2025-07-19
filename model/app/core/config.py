import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class Settings:
    """Application settings loaded from environment variables
    
    This configuration class manages all application settings for the CommerceBridge AI model service.
    Some variables are currently unused but reserved for future features to maintain
    a consistent configuration structure across the application.
    """
    
    # MongoDB Configuration
    MONGO_URI: str = os.getenv("MONGO_URI")
    MONGO_DB: str = os.getenv("MONGO_DB", "commercebridge")
    MONGO_COLLECTION: str = os.getenv("MONGO_COLLECTION", "products")
    
    # Redis Configuration
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: str = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str = os.getenv("CLOUDINARY_API_SECRET")
    
    # Application Configuration
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "0").lower() in ("1", "true", "yes")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "info").lower()
    
    # Security Configuration
    # TODO: These variables are reserved for future authentication/authorization features
    # Currently not used as the model app focuses on AI/ML functionality without user management
    # Will be used when implementing:
    # - JWT token generation and validation
    # - User authentication and session management
    # - API key management and rate limiting
    SECRET_KEY: str = os.getenv("SECRET_KEY", "taja-secret-key-change-in-production-2024")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # API Configuration
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "Taja")
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", "104857600"))  # 100MB default
    ALLOWED_IMAGE_TYPES: List[str] = os.getenv("ALLOWED_IMAGE_TYPES", "image/jpeg,image/png,image/webp").split(",")
    ALLOWED_VIDEO_TYPES: List[str] = os.getenv("ALLOWED_VIDEO_TYPES", "video/mp4,video/avi,video/mov,video/mkv").split(",")
    
    # AI Model Configuration
    CLIP_MODEL_NAME: str = os.getenv("CLIP_MODEL_NAME", "openai/clip-vit-base-patch32")
    EMBEDDING_DIMENSION: int = int(os.getenv("EMBEDDING_DIMENSION", "512"))
    SIMILARITY_THRESHOLD: float = float(os.getenv("SIMILARITY_THRESHOLD", "0.7"))
    
    # Monitoring
    ENABLE_METRICS: bool = os.getenv("ENABLE_METRICS", "true").lower() in ("1", "true", "yes")
    ENABLE_HEALTH_CHECKS: bool = os.getenv("ENABLE_HEALTH_CHECKS", "true").lower() in ("1", "true", "yes")
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.ENVIRONMENT.lower() == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return self.ENVIRONMENT.lower() == "production"
    
    def validate(self) -> None:
        """Validate required settings for current functionality
        
        Only validates variables that are actively used in the current implementation.
        Security variables (SECRET_KEY, ALGORITHM, etc.) are not validated as they
        are reserved for future authentication features.
        """
        required_vars = [
            "MONGO_URI",
            "CLOUDINARY_CLOUD_NAME", 
            "CLOUDINARY_API_KEY",
            "CLOUDINARY_API_SECRET"
        ]
        
        missing_vars = []
        for var in required_vars:
            if not getattr(self, var):
                missing_vars.append(var)
        
        if missing_vars:
            raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

# Global settings instance
settings = Settings()

# Validate settings on import
try:
    settings.validate()
except ValueError as e:
    print(f"Configuration Error: {e}")
    print("Please check your .env file and ensure all required variables are set.") 