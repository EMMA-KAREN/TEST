from app import app
from models import db, Users, Admins, RedFlags, Interventions
from werkzeug.security import generate_password_hash
from datetime import datetime
from geopy.geocoders import Nominatim

# Initialize geocoder
geolocator = Nominatim(user_agent="seed.py")

# Function to get coordinates from a location name
def get_coordinates(location):
    location_obj = geolocator.geocode(location)
    if location_obj:
        return (location_obj.latitude, location_obj.longitude)
    return None

with app.app_context():


    # Delete all rows in the Loan and User tables
    RedFlags.query.delete()
    Interventions.query.delete()
    Users.query.delete()
    Admins.query.delete()

    # Create an empty list
    users = []
    red_flags = []
    interventions = []
    admins = []

    # data = request.get_json()
    password = "1234"
    
    
    # Users seeds
    users.append(Users(first_name="Hamza", last_name="Ali", email="david.kakhayanga@student.moringaschool.com", phone=1234567890, password=generate_password_hash(password), profile_picture="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6830.jpg?w=740"))
    users.append(Users(first_name="John", last_name="Doe", email="bokeje4980@btcours.com", phone=123456, password=generate_password_hash(password), profile_picture="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6830.jpg?w=740"))
   
    # # Red flag seeds
    location_1 = "Nairobi, Buruburu"
    location_2 = " Kitengela"
    coordinates_1 = get_coordinates(location_1)
    coordinates_2 = get_coordinates(location_2)
    
    red_flags.append(RedFlags(title="Corruption in Government Contracts", description="This red flag indicates the involvement of bribery and corruption in securing government contracts, leading to unfair advantages and misappropriation of funds.", image="corruption_in_government_contracts.jpg", video="corruption_in_government_contracts_video.mp4", created_at=datetime.utcnow(), location=location_1, coordinates=f"{coordinates_1[0]}, {coordinates_1[1]}", status="active", user_id=1))
    red_flags.append(RedFlags(title="Corruption in Government Contracts 2", description="This red flag indicates the involvement of bribery and corruption in securing government contracts, leading to unfair advantages and misappropriation of funds.", image="corruption_in_government_contracts.jpg", video="corruption_in_government_contracts_video.mp4", created_at=datetime.utcnow(), location=location_2, coordinates=f"{coordinates_2[0]}, {coordinates_2[1]}", status="active", user_id=2))
    
    # # Interventions seeds
     # # Red flag seeds
    location_3 = "Nairobi, Umoja"
    location_4 = " Rongai"
    coordinates_3 = get_coordinates(location_3)
    coordinates_4 = get_coordinates(location_4)
    
    interventions.append(Interventions(title="Unsafe Workplace Conditions", description="This red flag indicates hazardous working environments, including exposed electrical wires and poorly maintained equipment.", image="unsafe_workplace.jpg", video="unsafe_workplace_video.mp4", created_at=datetime.utcnow(), location=location_3,coordinates=f"{coordinates_3[0]}, {coordinates_3[1]}", status="active", user_id=1))
    interventions.append(Interventions(title="Unsafe Workplace Conditions 2", description="This red flag indicates hazardous working environments, including exposed electrical wires and poorly maintained equipment.", image="unsafe_workplace.jpg", video="unsafe_workplace_video.mp4", created_at=datetime.utcnow(), location=location_4,coordinates=f"{coordinates_4[0]}, {coordinates_4[1]}", status="active", user_id=2))

        
    # ADMIN SEEDS
    admins.append(Admins(first_name = "David", last_name = "Parsley", email = "davidparsley.kakhayanga@gmail.com", phone = 1111111 , password=generate_password_hash(password), profile_picture="https://img.freepik.com/premium-photo/memoji-african-american-man-white-background-emoji_826801-6856.jpg?w=740"))
    admins.append(Admins(first_name = "Emmaculate", last_name = "Mwikali", email = "mwikaliemmaculate6@gmail.com", phone = 2222222 , password=generate_password_hash(password), profile_picture="https://img.freepik.com/premium-photo/occupational-therapist-digital-avatar-generative-ai_934475-9352.jpg?w=740"))
    admins.append(Admins(first_name = "Kevin", last_name = "Bett", email = "kevin.bett3@student.moringaschool.com", phone = 3333333 , password=generate_password_hash(password), profile_picture="https://img.freepik.com/premium-photo/memoji-african-american-man-white-background-emoji_826801-6858.jpg?w=740"))

    # Insert each Loan and User in the list into the database tables
    db.session.add_all(users)
    db.session.add_all(red_flags)
    db.session.add_all(interventions)
    db.session.add_all(admins)

    # Commit the transaction
    db.session.commit()