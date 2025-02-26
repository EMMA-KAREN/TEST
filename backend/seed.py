from app import app
from models import db, Users, Admins, RedFlags, Interventions
from werkzeug.security import generate_password_hash
from datetime import datetime
import random

# List of diverse locations across Kenya and Uganda with fixed coordinates
locations = [
    ("Nairobi, CBD", "-1.286389, 36.817223"),
    ("Mombasa, Nyali", "-4.043477, 39.668206"),
    ("Kisumu, Milimani", "-0.102206, 34.761711"),
    ("Nakuru, Lanet", "-0.303099, 36.080025"),
    ("Eldoret, Pioneer", "0.514277, 35.269779"),
    ("Thika, Makongeni", "-1.03326, 37.06933"),
    ("Nyeri, Ruring'u", "-0.416469, 36.951067"),
    ("Meru, Makutano", "0.046307, 37.655894"),
    ("Garissa, Township", "-0.456944, 39.646667"),
    ("Kitale, Milimani", "1.01575, 35.00632"),
    ("Kampala, Kololo", "0.313611, 32.581111"),
    ("Entebbe, Kitoro", "0.0517, 32.4469"),
    ("Jinja, Nalufenya", "0.4244, 33.2042"),
    ("Gulu, Pece", "2.7746, 32.2989"),
    ("Mbale, Wanale", "1.0646, 34.1794"),
    ("Mbarara, Kakoba", "-0.6072, 30.6545"),
    ("Fort Portal, Kabarole", "0.671, 30.2756"),
    ("Masaka, Kimaanya", "-0.3291, 31.7341"),
    ("Lira, Adyel", "2.2491, 32.8998"),
    ("Soroti, Pamba", "1.7146, 33.6111")
]

with app.app_context():

    # Delete all rows in the tables
    RedFlags.query.delete()
    Interventions.query.delete()
    Users.query.delete()
    Admins.query.delete()

    # Create empty lists
    users = []
    red_flags = []
    interventions = []
    admins = []

    password = "1234"

    # Seed Users
    for i in range(5):
        users.append(Users(
            first_name=f"User{i+1}",
            last_name=f"Last{i+1}",
            email=f"user{i+1}@example.com",
            phone=random.randint(1000000000, 9999999999),
            password=generate_password_hash(password),
            profile_picture="https://img.freepik.com/premium-photo/memoji-happy-man-white-background-emoji_826801-6830.jpg?w=740"
        ))

    # Seed Admins
    for i in range(3):
        admins.append(Admins(
            first_name=f"Admin{i+1}",
            last_name=f"AdminLast{i+1}",
            email=f"admin{i+1}@example.com",
            phone=random.randint(1000000, 9999999),
            password=generate_password_hash(password),
            profile_picture="https://img.freepik.com/premium-photo/memoji-african-american-man-white-background-emoji_826801-6858.jpg?w=740"
        ))

    # Get unique locations for red flags and interventions
    unique_locations = random.sample(locations, 20)

    # Seed 10 RedFlags
    for i in range(10):
        location, coordinates = unique_locations.pop()
        red_flags.append(RedFlags(
            title=f"Red Flag Title {i+1}",
            description=f"Description for red flag {i+1}",
            image="red_flag_image.jpg",
            video="red_flag_video.mp4",
            created_at=datetime.utcnow(),
            location=location,
            coordinates=coordinates,
            status="active",
            user_id=random.randint(1, 5)
        ))

    # Seed 10 Interventions
    for i in range(10):
        location, coordinates = unique_locations.pop()
        interventions.append(Interventions(
            title=f"Intervention Title {i+1}",
            description=f"Description for intervention {i+1}",
            image="intervention_image.jpg",
            video="intervention_video.mp4",
            created_at=datetime.utcnow(),
            location=location,
            coordinates=coordinates,
            status="active",
            user_id=random.randint(1, 5)
        ))

    # Insert into database
    db.session.add_all(users)
    db.session.add_all(admins)
    db.session.add_all(red_flags)
    db.session.add_all(interventions)

    # Commit transaction
    db.session.commit()

    print("Database seeded successfully!")
