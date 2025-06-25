from fastapi import FastAPI, APIRouter, HTTPException, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
from enum import Enum

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Enums
class Continent(str, Enum):
    NORTH_AMERICA = "North America"
    SOUTH_AMERICA = "South America" 
    EUROPE = "Europe"
    AFRICA = "Africa"
    ASIA = "Asia"
    AUSTRALIA = "Australia"

class DangerLevel(str, Enum):
    HARMLESS = "Harmless"
    MILDLY_VENOMOUS = "Mildly Venomous"
    VENOMOUS = "Venomous"
    HIGHLY_VENOMOUS = "Highly Venomous"
    DEADLY = "Deadly"

# Models
class Snake(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    scientific_name: str
    continent: Continent
    countries: List[str]
    danger_level: DangerLevel
    is_venomous: bool
    image_url: str
    description: str
    habitat: List[str]
    size_range: str
    identification_features: List[str]
    behavior: str
    diet: str
    what_to_do: List[str]
    what_not_to_do: List[str]
    first_aid: List[str]
    interesting_facts: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class EmergencyInfo(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    icon: str
    priority: int
    quick_steps: List[str]
    emergency_numbers: List[str]
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Sample snake data
sample_snakes = [
    # North America
    {
        "name": "Eastern Diamondback Rattlesnake",
        "scientific_name": "Crotalus adamanteus",
        "continent": "North America",
        "countries": ["United States"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.pexels.com/photos/32715145/pexels-photo-32715145.jpeg",
        "description": "Largest venomous snake in North America, known for its distinctive diamond pattern and loud rattle.",
        "habitat": ["Pine forests", "Coastal plains", "Scrublands"],
        "size_range": "3-8 feet (0.9-2.4 meters)",
        "identification_features": ["Diamond-shaped patterns", "Heavy-bodied", "Prominent rattle", "Heat-sensing pits"],
        "behavior": "Generally shy but will defend itself vigorously when threatened. Active during day and night.",
        "diet": "Small mammals, birds, occasionally other reptiles",
        "what_to_do": ["Back away slowly", "Call emergency services immediately", "Keep victim calm and still", "Remove jewelry near bite site"],
        "what_not_to_do": ["Don't try to catch or kill the snake", "Don't apply ice to bite", "Don't cut the wound", "Don't use a tourniquet"],
        "first_aid": ["Call 911 immediately", "Keep bite below heart level", "Remove tight clothing", "Monitor breathing"],
        "interesting_facts": ["Can strike up to 2/3 of their body length", "Rattle is made of keratin segments", "Heat sensors can detect temperature differences of 0.5°F"]
    },
    {
        "name": "Copperhead",
        "scientific_name": "Agkistrodon contortrix",
        "continent": "North America",
        "countries": ["United States"],
        "danger_level": "Venomous",
        "is_venomous": True,
        "image_url": "https://images.pexels.com/photos/2062316/pexels-photo-2062316.jpeg",
        "description": "Common venomous snake with distinctive copper-colored head and hourglass patterns.",
        "habitat": ["Deciduous forests", "Mixed woodlands", "Rocky areas"],
        "size_range": "2-4 feet (0.6-1.2 meters)",
        "identification_features": ["Copper-colored head", "Hourglass crossbands", "Elliptical pupils", "Heat-sensing pits"],
        "behavior": "Tends to freeze when threatened rather than flee. Active at dusk and night.",
        "diet": "Rodents, frogs, insects, small birds",
        "what_to_do": ["Seek immediate medical attention", "Keep calm and still", "Note time of bite", "Remove constricting items"],
        "what_not_to_do": ["Don't panic", "Don't try to suck out venom", "Don't apply heat or cold", "Don't drink alcohol"],
        "first_aid": ["Get to hospital quickly", "Keep bitten area below heart", "Wash with soap and water", "Cover with clean bandage"],
        "interesting_facts": ["Babies are born with yellow-tipped tails", "Can remain motionless for hours", "Venom is hemotoxic"]
    },
    # South America
    {
        "name": "Fer-de-Lance",
        "scientific_name": "Bothrops asper",
        "continent": "South America",
        "countries": ["Colombia", "Venezuela", "Ecuador", "Peru", "Brazil"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.unsplash.com/photo-1670806507392-49c3d52d0266",
        "description": "Aggressive and deadly pit viper responsible for most snakebite fatalities in Central and South America.",
        "habitat": ["Tropical rainforests", "Agricultural areas", "Near human settlements"],
        "size_range": "4-8 feet (1.2-2.4 meters)",
        "identification_features": ["Triangular head", "Heat-sensing pits", "Varied brown/gray patterns", "Keeled scales"],
        "behavior": "Highly aggressive when threatened. Often found near human habitation.",
        "diet": "Small mammals, birds, frogs, other snakes",
        "what_to_do": ["Get antivenom immediately", "Call emergency services", "Keep victim calm", "Immobilize bitten limb"],
        "what_not_to_do": ["Don't delay medical treatment", "Don't apply tourniquet", "Don't cut wound", "Don't give alcohol"],
        "first_aid": ["Rush to nearest hospital", "Keep bite below heart", "Monitor vital signs", "Prepare for potential shock"],
        "interesting_facts": ["Accounts for 50% of snakebites in its range", "Can inject large amounts of venom", "Young are more venomous than adults"]
    },
    # Africa
    {
        "name": "Black Mamba",
        "scientific_name": "Dendroaspis polylepis",
        "continent": "Africa",
        "countries": ["South Africa", "Botswana", "Namibia", "Zimbabwe", "Kenya"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.unsplash.com/photo-1703636998491-4f0cffcc6fbd",
        "description": "Africa's deadliest snake, known for its speed, aggression, and highly potent neurotoxic venom.",
        "habitat": ["Savannas", "Rocky hills", "Dense forests", "Scrublands"],
        "size_range": "6-14 feet (1.8-4.3 meters)",
        "identification_features": ["Dark gray to black color", "Coffin-shaped head", "Black mouth interior", "Long and slender"],
        "behavior": "Extremely fast and aggressive. Can move up to 12 mph. Highly territorial.",
        "diet": "Small mammals, birds, eggs",
        "what_to_do": ["Get antivenom within 20 minutes if possible", "Call emergency immediately", "Keep victim completely still", "Prepare for respiratory support"],
        "what_not_to_do": ["Don't waste time", "Don't move victim", "Don't try traditional remedies", "Don't give food or water"],
        "first_aid": ["Race to hospital", "Support breathing if needed", "Keep airway clear", "Monitor consciousness"],
        "interesting_facts": ["Can kill a human in 15-20 minutes", "Fastest snake in the world", "Named for black mouth, not body color"]
    },
    {
        "name": "Puff Adder",
        "scientific_name": "Bitis arietans",
        "continent": "Africa",
        "countries": ["South Africa", "Kenya", "Tanzania", "Nigeria", "Ghana"],
        "danger_level": "Highly Venomous",
        "is_venomous": True,
        "image_url": "https://images.pexels.com/photos/1660997/pexels-photo-1660997.jpeg",
        "description": "Responsible for more snakebite fatalities in Africa than any other species due to its wide distribution and aggressive nature.",
        "habitat": ["Grasslands", "Bush country", "Desert edges", "Agricultural areas"],
        "size_range": "3-6 feet (0.9-1.8 meters)",
        "identification_features": ["Thick, heavy body", "Distinctive V-shaped markings", "Large triangular head", "Short tail"],
        "behavior": "Relies on camouflage and remains motionless. Very aggressive when disturbed.",
        "diet": "Small mammals, birds, amphibians",
        "what_to_do": ["Seek immediate medical care", "Keep victim calm and still", "Remove rings and tight clothing", "Monitor breathing"],
        "what_not_to_do": ["Don't apply ice", "Don't cut bite wound", "Don't give alcohol", "Don't use electric shock"],
        "first_aid": ["Get to hospital quickly", "Splint bitten limb", "Keep bite below heart level", "Watch for swelling"],
        "interesting_facts": ["Hisses loudly when threatened", "Can give birth to 60 young at once", "Excellent camouflage makes them hard to spot"]
    },
    # Asia
    {
        "name": "King Cobra",
        "scientific_name": "Ophiophagus hannah",
        "continent": "Asia",
        "countries": ["India", "China", "Thailand", "Malaysia", "Indonesia"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.unsplash.com/photo-1638855370496-1ec25682adbe",
        "description": "World's longest venomous snake, capable of delivering enough venom to kill an elephant.",
        "habitat": ["Dense forests", "Mangrove swamps", "Bamboo thickets", "Near water sources"],
        "size_range": "8-18 feet (2.4-5.5 meters)",
        "identification_features": ["Distinctive hood", "Olive-brown coloration", "Chevron patterns", "Large size"],
        "behavior": "Generally shy but extremely dangerous when threatened. Can rear up to 6 feet high.",
        "diet": "Primarily other snakes, including venomous species",
        "what_to_do": ["Get antivenom immediately", "Call emergency services", "Keep victim still", "Support breathing if needed"],
        "what_not_to_do": ["Don't delay treatment", "Don't panic", "Don't try to catch snake", "Don't use folk remedies"],
        "first_aid": ["Rush to hospital", "Assist breathing", "Keep bite below heart", "Monitor for paralysis"],
        "interesting_facts": ["Only snake that builds a nest", "Can inject 7ml of venom in one bite", "Immune to other snake venoms"]
    },
    {
        "name": "Russell's Viper",
        "scientific_name": "Daboia russelii",
        "continent": "Asia",
        "countries": ["India", "Sri Lanka", "Myanmar", "Thailand", "Pakistan"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.unsplash.com/photo-1662103563173-30e577e4e391",
        "description": "One of the 'Big Four' venomous snakes of India, responsible for thousands of deaths annually.",
        "habitat": ["Grasslands", "Scrub forests", "Agricultural areas", "Rocky terrain"],
        "size_range": "3-5 feet (0.9-1.5 meters)",
        "identification_features": ["Three rows of dark spots", "Flat triangular head", "Prominent supraocular scales", "Keeled scales"],
        "behavior": "Aggressive and quick to strike. Often found in agricultural areas.",
        "diet": "Rodents, birds, frogs, crabs",
        "what_to_do": ["Get polyvalent antivenom", "Reach hospital within hours", "Keep victim calm", "Monitor kidney function"],
        "what_not_to_do": ["Don't delay treatment", "Don't apply tight bands", "Don't give aspirin", "Don't ignore mild symptoms"],
        "first_aid": ["Immediate hospitalization", "Watch for bleeding", "Monitor urine output", "Support blood pressure"],
        "interesting_facts": ["Causes more snakebite deaths than any other species", "Venom affects blood clotting", "Very loud hiss when threatened"]
    },
    # Australia
    {
        "name": "Inland Taipan",
        "scientific_name": "Oxyuranus microlepidotus",
        "continent": "Australia",
        "countries": ["Australia"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.unsplash.com/photo-1651138666546-e1e276686b59",
        "description": "World's most venomous snake, with enough venom in one bite to kill 100 adult humans.",
        "habitat": ["Arid regions", "Channel country", "Cracking clay soils", "Remote areas"],
        "size_range": "6-8 feet (1.8-2.4 meters)",
        "identification_features": ["Olive to dark tan color", "Rectangular head scales", "Small eyes", "Seasonal color changes"],
        "behavior": "Generally shy and reclusive. Rarely encountered by humans.",
        "diet": "Small mammals, particularly rodents",
        "what_to_do": ["Get antivenom immediately", "Call flying doctor service", "Keep victim absolutely still", "Prepare for intensive care"],
        "what_not_to_do": ["Don't waste any time", "Don't move victim", "Don't apply pressure bandage incorrectly", "Don't give up hope"],
        "first_aid": ["Apply compression bandage", "Splint entire limb", "Mark swelling progression", "Get helicopter evacuation"],
        "interesting_facts": ["Venom is 50x more toxic than cobra venom", "Also called 'fierce snake'", "Can kill in 30-45 minutes"]
    },
    {
        "name": "Eastern Brown Snake",
        "scientific_name": "Pseudonaja textilis",
        "continent": "Australia",
        "countries": ["Australia"],
        "danger_level": "Deadly",
        "is_venomous": True,
        "image_url": "https://images.pexels.com/photos/16105771/pexels-photo-16105771.jpeg",
        "description": "Highly aggressive and fast-moving snake, second most venomous land snake in the world.",
        "habitat": ["Woodlands", "Scrublands", "Grasslands", "Urban areas"],
        "size_range": "4-7 feet (1.2-2.1 meters)",
        "identification_features": ["Variable brown coloration", "Round pupils", "Relatively small head", "Smooth scales"],
        "behavior": "Extremely aggressive and fast. Will pursue threats. Active during day.",
        "diet": "Small mammals, birds, eggs, other reptiles",
        "what_to_do": ["Apply pressure-immobilization bandage", "Call emergency 000", "Keep victim still", "Get antivenom quickly"],
        "what_not_to_do": ["Don't remove bandage", "Don't wash bite site", "Don't cut or suck wound", "Don't give alcohol"],
        "first_aid": ["Broad pressure bandage", "Splint limb", "Mark time and swelling", "Helicopter to hospital"],
        "interesting_facts": ["Can move at 12 mph", "Accounts for 60% of snakebite deaths in Australia", "Very territorial during breeding season"]
    },
    # Europe
    {
        "name": "European Adder",
        "scientific_name": "Vipera berus",
        "continent": "Europe",
        "countries": ["United Kingdom", "Norway", "Sweden", "Germany", "France"],
        "danger_level": "Venomous",
        "is_venomous": True,
        "image_url": "https://images.unsplash.com/photo-1529978515127-dba8c80bbf05",
        "description": "Only venomous snake native to Britain and most of northern Europe.",
        "habitat": ["Heathlands", "Moors", "Woodland edges", "Sunny slopes"],
        "size_range": "2-3 feet (0.6-0.9 meters)",
        "identification_features": ["Zigzag pattern down back", "V or X mark on head", "Vertical pupils", "Keeled scales"],
        "behavior": "Generally shy and non-aggressive. Bites are rare and usually defensive.",
        "diet": "Small mammals, lizards, frogs, birds",
        "what_to_do": ["Seek medical attention", "Clean wound gently", "Remove jewelry", "Monitor for allergic reaction"],
        "what_not_to_do": ["Don't panic - rarely fatal", "Don't apply ice", "Don't cut wound", "Don't use tourniquet"],
        "first_aid": ["Clean with antiseptic", "Take painkiller if needed", "Watch for swelling", "Get medical advice"],
        "interesting_facts": ["Hibernates for 4-5 months", "Can swim well", "Gives birth to live young"]
    },
    {
        "name": "Grass Snake",
        "scientific_name": "Natrix natrix",
        "continent": "Europe",
        "countries": ["United Kingdom", "Germany", "France", "Poland", "Netherlands"],
        "danger_level": "Harmless",
        "is_venomous": False,
        "image_url": "https://images.unsplash.com/photo-1672697823081-7bbae6d25c1c",
        "description": "Harmless snake commonly found near water sources across Europe.",
        "habitat": ["Near water", "Gardens", "Compost heaps", "Woodland edges"],
        "size_range": "3-6 feet (0.9-1.8 meters)",
        "identification_features": ["Yellow/orange collar behind head", "Olive-green color", "Round pupils", "Smooth scales"],
        "behavior": "Non-venomous and harmless. May play dead when threatened.",
        "diet": "Frogs, toads, fish, small mammals",
        "what_to_do": ["Leave it alone", "Enjoy observing from distance", "No medical treatment needed if bitten", "Clean minor wounds"],
        "what_not_to_do": ["Don't kill - they're beneficial", "Don't handle roughly", "Don't be afraid", "Don't confuse with adders"],
        "first_aid": ["Clean any bite wound", "Apply antiseptic", "No special treatment needed", "Watch for infection"],
        "interesting_facts": ["Excellent swimmer", "Can hold breath for 30 minutes", "Releases foul smell when threatened"]
    }
]

# Emergency information
emergency_info = [
    {
        "title": "Snake Bite Emergency",
        "icon": "🚨",
        "priority": 1,
        "quick_steps": [
            "Call emergency services immediately",
            "Keep victim calm and still",
            "Remove jewelry near bite site",
            "Do NOT cut, suck, or apply ice to wound",
            "Take photo of snake if safe to do so"
        ],
        "emergency_numbers": ["911 (US)", "000 (Australia)", "112 (Europe)", "102 (India)"]
    },
    {
        "title": "First Aid Basics",
        "icon": "🏥",
        "priority": 2,
        "quick_steps": [
            "Keep bite below heart level",
            "Remove tight clothing/jewelry",
            "Clean wound gently with water",
            "Cover with clean, dry bandage",
            "Monitor breathing and consciousness"
        ],
        "emergency_numbers": ["Contact local poison control center"]
    },
    {
        "title": "Snake Encounter Safety",
        "icon": "⚠️",
        "priority": 3,
        "quick_steps": [
            "Back away slowly - don't run",
            "Give snake space to escape",
            "Don't try to catch or kill snake",
            "Wear protective footwear in snake areas",
            "Use flashlight when walking at night"
        ],
        "emergency_numbers": ["Local wildlife control services"]
    }
]

@api_router.get("/")
async def root():
    return {"message": "Welcome to SerpentAware API"}

@api_router.get("/snakes", response_model=List[Snake])
async def get_snakes(continent: Optional[str] = None, danger_level: Optional[str] = None, search: Optional[str] = None):
    """Get all snakes, optionally filtered by continent, danger level, or search term"""
    query = {}
    
    if continent:
        query["continent"] = continent
    if danger_level:
        query["danger_level"] = danger_level
    
    snakes = await db.snakes.find(query).to_list(1000)
    
    if search:
        search_term = search.lower()
        snakes = [snake for snake in snakes if 
                 search_term in snake.get("name", "").lower() or 
                 search_term in snake.get("scientific_name", "").lower() or
                 any(search_term in country.lower() for country in snake.get("countries", []))]
    
    return [Snake(**snake) for snake in snakes]

@api_router.get("/snakes/{snake_id}", response_model=Snake)
async def get_snake(snake_id: str):
    """Get a specific snake by ID"""
    snake = await db.snakes.find_one({"id": snake_id})
    if not snake:
        raise HTTPException(status_code=404, detail="Snake not found")
    return Snake(**snake)

@api_router.get("/continents")
async def get_continents():
    """Get all continents with snake counts"""
    pipeline = [
        {"$group": {"_id": "$continent", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}}
    ]
    result = await db.snakes.aggregate(pipeline).to_list(100)
    return [{"continent": item["_id"], "count": item["count"]} for item in result]

@api_router.get("/emergency", response_model=List[EmergencyInfo])
async def get_emergency_info():
    """Get emergency information and first aid steps"""
    emergency_data = await db.emergency_info.find().sort("priority", 1).to_list(100)
    return [EmergencyInfo(**info) for info in emergency_data]

@api_router.get("/stats")
async def get_stats():
    """Get statistics about the snake database"""
    total_snakes = await db.snakes.count_documents({})
    venomous_count = await db.snakes.count_documents({"is_venomous": True})
    deadly_count = await db.snakes.count_documents({"danger_level": "Deadly"})
    
    continent_stats = await db.snakes.aggregate([
        {"$group": {"_id": "$continent", "count": {"$sum": 1}}}
    ]).to_list(100)
    
    return {
        "total_snakes": total_snakes,
        "venomous_snakes": venomous_count,
        "deadly_snakes": deadly_count,
        "continents": {item["_id"]: item["count"] for item in continent_stats}
    }

# Initialize database with sample data
@api_router.post("/init-data")
async def initialize_data():
    """Initialize database with sample snake and emergency data"""
    # Clear existing data
    await db.snakes.delete_many({})
    await db.emergency_info.delete_many({})
    
    # Insert sample snakes
    snake_objects = [Snake(**snake_data) for snake_data in sample_snakes]
    await db.snakes.insert_many([snake.dict() for snake in snake_objects])
    
    # Insert emergency info
    emergency_objects = [EmergencyInfo(**info) for info in emergency_info]
    await db.emergency_info.insert_many([info.dict() for info in emergency_objects])
    
    return {"message": f"Initialized {len(sample_snakes)} snakes and {len(emergency_info)} emergency info items"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()