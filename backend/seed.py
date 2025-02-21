from app import app
from models import db, Users, Admins, Red_Flags, Interventions
from werkzeug.security import generate_password_hash
from datetime import datetime




with app.app_context():

    # Delete all rows in the Loan and User tables
    Red_Flags.query.delete()
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
    users.append(Users(first_name="Hamza", last_name="Ali", email="david.kakhayanga@student.moringaschool.com", phone=1234567890, password=generate_password_hash(password)))

   
    # # red flag seeds
    # red_flags.append(Loans(amount=5000000, interest_rate=1.2, start_date=datetime.strptime("20/01/2025", "%d/%m/%Y").date(), due_date=datetime.strptime("2026-01-20", "%Y-%m-%d").date(), loan_status="Active", user_id=1))
    
    # # interventions seeds
    # interventions.append(Loans(amount=5000000, interest_rate=1.2, start_date=datetime.strptime("20/01/2025", "%d/%m/%Y").date(), due_date=datetime.strptime("2026-01-20", "%Y-%m-%d").date(), loan_status="Active", user_id=1))

        
    # ADMIN SEEDS
    admins.append(Admins(first_name = "David", last_name = "Parsley", email = "davidparsley.kakhayanga@gmail.com", phone = 1111111 , password=generate_password_hash(password)))
    admins.append(Admins(first_name = "Emmaculate", last_name = "Mwikali", email = "mwikaliemmaculate6@gmail.com", phone = 2222222 , password=generate_password_hash(password)))
    admins.append(Admins(first_name = "Kevin", last_name = "Bett", email = "kevin.bett3@student.moringaschool.com", phone = 3333333 , password=generate_password_hash(password)))

    # Insert each Loan and User in the list into the database tables
    db.session.add_all(users)
    db.session.add_all(red_flags)
    db.session.add_all(interventions)
    db.session.add_all(admins)


    # Commit the transaction
    db.session.commit()