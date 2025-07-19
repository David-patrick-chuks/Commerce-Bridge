from pydantic import BaseModel, Field
from typing import List, Optional

class MatchedImage(BaseModel):
    image_url: str
    image_hash: str
    similarity: float

class ProductBase(BaseModel):
    name: str
    price: float
    description: str
    category: str
    weight_kg: Optional[float] = Field(None, description="Product weight in kilograms")
    color: Optional[str] = Field(None, description="Product color (e.g., 'black', 'red')")
    sizes: Optional[List[str]] = Field(None, description="Available sizes (e.g., ['S', 'M', 'L'] or ['10', '11', '12'])")
    key_features: Optional[List[str]] = Field(None, description="Key product features and specifications (e.g., ['124 Liters', 'Environment Friendly Tech', 'Low Noise'])")
    image_urls: List[str]
    image_hashes: List[str]
    embeddings: List[List[float]]

class ProductCreate(ProductBase):
    pass

class ProductSearchResult(BaseModel):
    name: str
    price: float
    description: str
    category: str
    weight_kg: Optional[float] = None
    color: Optional[str] = None
    sizes: Optional[List[str]] = None
    key_features: Optional[List[str]] = None
    image_urls: List[str]
    matched_images: List[MatchedImage]

class SearchResponse(BaseModel):
    matches: List[ProductSearchResult]

class ErrorResponse(BaseModel):
    status: str
    message: str 