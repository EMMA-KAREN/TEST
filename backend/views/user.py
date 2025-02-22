from flask import jsonify, request, Blueprint
from models import Users, db, RedFlags, Interventions, Admins
from flask_jwt_extended import  jwt_required, get_jwt_identity, get_jwt
from werkzeug.security import generate_password_hash
from flask_mail import  Message
from datetime import datetime

def get_mail():
    from app import mail  # Import `mail` only when needed
    return mail



user_bp = Blueprint("user_bp", __name__)

# REGISTERED A USER
@user_bp.route("/user", methods=["POST"])
def register_user():
    data = request.get_json()
    first_name = data["first_name"]
    last_name = data["last_name"]
    email = data["email"]
    password = data["password"]
    phone = data["phone"]
    profile_picture = data["profile_picture"]

    check_email = Users.query.filter_by(email=email).first()
    print("email", check_email)
    if check_email:
        return jsonify({"error": "Email exists"}), 404
    
    check_phone = Users.query.filter_by(phone=phone).first()
    print("phone", check_phone)
    if check_phone:
        return jsonify({"error": "Phone Number exists"}), 404
     
    else:
        new_user = Users(first_name=first_name, last_name=last_name, email=email, password=generate_password_hash(password), phone=phone, profile_picture=profile_picture)
        db.session.add(new_user)
        db.session.commit()

        current_date = datetime.now().strftime("%d-%m-%Y")
        msg = Message('Welcome to iRegister', sender='iregisterweb@gmail.com', recipients=[email])

        msg.html = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Delta Bank</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    color: #333;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                }}
                .container {{
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    padding-bottom: 20px;
                }}
                .header h1 {{
                    color: #11172b;
                }}
                .body-content {{
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }}
                .footer {{
                    text-align: center;
                    font-size: 14px;
                    color: #777;
                }}
                .cta-button {{
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #1E90FF;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                }}
            </style>
        </head>
        <body>
           <div class="container">
                <div class="header">
                    <h1>Welcome to iReporter !</h1>
                </div>
                <div class="body-content">
                    <p>Hello {first_name} {last_name},</p>
                    <p>Welcome aboard! 🎉 We're excited to have you join the iReporter community.</p>
                    <p>At iReporter, we empower citizens like you to take action against corruption and advocate for positive change. You're now part of a movement to report issues and push for government intervention on critical matters.</p>
                    <p>If you need any help, our support team is here for you. Reach out anytime!</p>
                    <p>We look forward to making an impact together.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>The iReporter Team</p>
                    <p><i>Sent on: {current_date}</i></p>
                </div>
            </div>
        </body>
        </html>
        """

        # Before sending the email, get the `mail` instance
        mail = get_mail()
        mail.send(msg)

        
        return jsonify({"msg": "User Registered Successfully"}), 200
    
# FETCH ALL USERS
@user_bp.route("/users")
def fetch_users():
    users = Users.query.all() 
    user_list = []

   
    for user in users:
        user_list.append({
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone": user.phone,
            "email": user.email,
            "profile_picture": user.profile_picture
        })

    
    return jsonify(user_list)

# FETCH ALL Admins
@user_bp.route("/admins")
def fetch_admins():
    admins = Admins.query.all() 
    admin_list = []

   
    for admin in admins:
        admin_list.append({
            "id": admin.id,
            "first_name": admin.first_name,
            "last_name": admin.last_name,
            "phone": admin.phone,
            "email": admin.email,
            "profile_picture": admin.profile_picture
        })

    
    return jsonify(admin_list)
# done



# DELETE A USER
@user_bp.route("/user/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    # current_user_id = get_jwt_identity()
    claims = get_jwt()

    if claims.get('is_admin'):
        user_to_delete = db.session.get(Users, user_id)


        if not user_to_delete:
            return jsonify({"error": "User not found"}), 404
        
        red_flags_to_delete = RedFlags.query.filter_by(user_id=user_id).all()
        interventions_to_delete = Interventions.query.filter_by(user_id=user_id).all()
    
        for red_flag in red_flags_to_delete:
            db.session.delete(red_flag)

        for intervension in interventions_to_delete:
            db.session.delete(intervension)    

        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({"success": "User Deleted successfully"}), 200
    
    elif claims.get('is_user'):
        user_to_delete = db.session.get(Users, user_id)


        if not user_to_delete:
            return jsonify({"error": "User not found"}), 404
        
        red_flags_to_delete = RedFlags.query.filter_by(user_id=user_id).all()
        interventions_to_delete = Interventions.query.filter_by(user_id=user_id).all()
    
        for red_flag in red_flags_to_delete:
            db.session.delete(red_flag)

        for intervension in interventions_to_delete:
            db.session.delete(intervension)    

        db.session.delete(user_to_delete)
        db.session.commit()

        return jsonify({"success": "Account Deleted successfully"}), 200
    
    else:
        return jsonify({"error": "You must be logged in as a User or Admin to delete an account"}), 403

