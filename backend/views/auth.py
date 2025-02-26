from flask import jsonify, request, Blueprint
from models import Users, Admins, db, TokenBlocklist
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta, timezone
from flask_mail import  Message

def get_mail():
    from app import mail 
    return mail




auth_bp = Blueprint("auth_bp", __name__)

# LOGIN USER
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]

    user = Users.query.filter_by(email=email).first()
    admin = Admins.query.filter_by(email=email).first()

    if user:
        if check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.id, additional_claims={'is_user': True}) 

            current_date = datetime.now().strftime("%d-%m-%Y")
            msg = Message('Successful Login', sender='iregisterweb@gmail.com', recipients=[email])

            msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Successful Login</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
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
                        font-size: 24px;
                    }}
                    .body-content {{
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }}
                    .footer {{
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Successful Login</h1>
                    </div>
                    <div class="body-content">
                        <p>Hello {user.first_name} {user.last_name},</p>
                        <p>You have successfully logged in to your iRegister account.</p>
                        <p>If you did not initiate this login, please contact us immediately.</p>
                        <p>Thank you for using iRegister!</p>
                    </div>
                    <div class="footer">
                        <p><i>Sent on: {current_date}</i></p>
                    </div>
                </div>
            </body>
            </html>
            """

            mail = get_mail()
            mail.send(msg)
            return jsonify({"access_token": access_token}), 200
        else:
            return jsonify({"error": "Incorrect Password "}), 404

    elif admin:
        if check_password_hash(admin.password, password):
            access_token = create_access_token(identity=admin.id, additional_claims={'is_admin': True})
            current_date = datetime.now().strftime("%d-%m-%Y")
            msg = Message('Successful Login', sender='iregisterweb@gmail.com', recipients=[email])

            msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Successful Login</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
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
                        font-size: 24px;
                    }}
                    .body-content {{
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }}
                    .footer {{
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Successful Login</h1>
                    </div>
                    <div class="body-content">
                        <p>Hello {admin.first_name} {admin.last_name},</p>
                        <p>You have successfully logged in to your iRegister Admin account.</p>
                        <p>If you did not initiate this login, please contact us immediately.</p>
                        <p>Thank you for using iRegister!</p>
                    </div>
                    <div class="footer">
                        <p><i>Sent on: {current_date}</i></p>
                    </div>
                </div>
            </body>
            </html>
            """
            
            mail = get_mail()
            mail.send(msg)
            return jsonify({"access_token": access_token}), 200
        else:
            return jsonify({"error": "Incorrect Password "}), 404
    else:
        return jsonify({"error": "Email not found for both User or Admin"}), 404


# CURRENT USER
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def current_user():
    current_user_id = get_jwt_identity()
    claims = get_jwt()  

    if claims.get('is_admin'):
        admin = db.session.get(Admins, current_user_id)

        if admin:
            admin_data = {
                'id': admin.id,
                'first_name': admin.first_name,
                'last_name': admin.last_name,
                'profile_picture': admin.profile_picture,
                'email': admin.email,
                'phone': admin.phone,
                'is_admin': True 
            }
            return jsonify(admin_data), 200
        else:
            return jsonify({"message": "Admin not found"}), 404

    elif claims.get("is_user"):
        user = db.session.get(Users, current_user_id)
        if user:
            user_data = {
                'id': user.id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'profile_picture': user.profile_picture,
                'email': user.email,
                'phone': user.phone,
                'is_user': True 
            }
            return jsonify(user_data), 200
    else:
        return jsonify({"message": "User not found"}), 404

# UPDATE CURRENT USERS INFORMATION
@auth_bp.route("/user/update", methods=["PATCH"])
@jwt_required()
def update_info():
    current_user_id = get_jwt_identity()
    claims = get_jwt()

    mail = get_mail() 

    if claims.get('is_admin'):
        admin = db.session.get(Admins, current_user_id)


        if admin:
            data = request.get_json()
            phone = data.get("phone", admin.phone)
            email = data.get("email", admin.email)
            profile_picture = data.get('profile_picture', admin.profile_picture) 
            new_password = data.get("password")  

            check_admin_phone = Admins.query.filter_by(phone=phone and  id!=admin.id).first()
            check_admin_email = Admins.query.filter_by(email=email and id!=admin.id).first()

            if check_admin_phone:
                return jsonify({"error": "Phone already in use"}), 400

            if check_admin_email:
                return jsonify({"error": "Email already in use"}), 400

            if new_password:
               
                if not check_password_hash(admin.password, new_password):
                    new_password_hash = generate_password_hash(new_password)
                    admin.password = new_password_hash
                else:
                    new_password = None  

            admin.phone = phone
            admin.email = email
            if profile_picture != admin.profile_picture: 
                admin.profile_picture = profile_picture

            db.session.commit()
            current_date = datetime.now().strftime("%d-%m-%Y")
            msg = Message('Account Details Updated', sender='iregisterweb@gmail.com', recipients=[email])

            msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Details Updated</title>
            <style>
                body {{
                    font-family: Arial, sans-serif;
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
                    font-size: 24px;
                }}
                .body-content {{
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }}
                .footer {{
                    font-size: 14px;
                    color: #777;
                    text-align: center;
                }}
            </style>
            </head>
            <body>
            <div class="container">
                <div class="header">
                    <h1>Account Details Updated</h1>
                </div>
                <div class="body-content">
                    <p>Hello {admin.first_name} {admin.last_name},</p>
                    <p>Your account details have been successfully updated:</p>
                    <ul>
                        {f"<li><strong>Phone:</strong> {admin.phone}</li>" if phone != admin.phone else ""}
                        {f"<li><strong>Email:</strong> {admin.email}</li>" if email != admin.email else ""}
                        {f"<li><strong>Profile Picture:</strong> {admin.profile_picture}</li>" if profile_picture != admin.profile_picture else ""}
                        {f"<li><strong>Password:</strong> Your password has been updated.</li>" if new_password else ""}
                    </ul>
                    <p>If you did not initiate these changes, please contact us immediately.</p>
                    <p>Thank you for using iRegister!</p>
                </div>
                <div class="footer">
                    <p><i>Sent on: {current_date}</i></p>
                </div>
            </div>
        </body>
        </html>
          """ 
        
        mail.send(msg)
        return jsonify({"success": "Updated successfully"}), 200

        
    elif claims.get("is_user"):
        user = db.session.get(Users, current_user_id)


        if user:
            data = request.get_json()
            phone = data.get("phone", user.phone)
            email = data.get("email", user.email)
            profile_picture = data.get("profile_picture", user.profile_picture)
            new_password = data.get("password")  # only update if provided

            check_user_phone = Users.query.filter_by(phone=phone and id!=user.id).first()
            check_user_email = Users.query.filter_by(phone=phone and id!=user.id).first()

            if check_user_phone:
                return jsonify({"error": "Phone already in use"}), 400

            if check_user_email:
                return jsonify({"error": "Email already in use"}), 400

            if new_password:
               
                if not check_password_hash(user.password, new_password):
                    new_password_hash = generate_password_hash(new_password)
                    user.password = new_password_hash
                else:
                    new_password = None  

            user.phone = phone
            user.email = email

            if profile_picture != user.profile_picture: 
                user.profile_picture = profile_picture

            db.session.commit()
            current_date = datetime.now().strftime("%d-%m-%Y")
            msg = Message('Account Details Updated', sender='iregisterweb@gmail.com', recipients=[email])

            msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Account Details Updated</title>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
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
                        font-size: 24px;
                    }}
                    .body-content {{
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 20px;
                    }}
                    .footer {{
                        font-size: 14px;
                        color: #777;
                        text-align: center;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Account Details Updated</h1>
                    </div>
                    <div class="body-content">
                        <p>Hello {user.first_name} {user.last_name},</p>
                        <p>Your account details have been successfully updated:</p>
                        <ul>
                            {f"<li><strong>Phone:</strong> {user.phone}</li>" if phone != user.phone else ""}
                            {f"<li><strong>Email:</strong> {user.email}</li>" if email != user.email else ""}
                            {f"<li><strong>Profile Picture:</strong> {user.profile_picture}</li>" if profile_picture != user.profile_picture else ""}
                            {f"<li><strong>Password:</strong> Your password has been updated.</li>" if new_password else ""}
                        </ul>
                        <p>If you did not initiate these changes, please contact us immediately.</p>
                        <p>Thank you for using iRegister!</p>
                    </div>
                    <div class="footer">
                        <p><i>Sent on: {current_date}</i></p>
                    </div>
                </div>
            </body>
            </html>
            """

            mail.send(msg)
            return jsonify({"success": "Updated successfully"}), 200

    else:
        return jsonify({"error": "Details Not Updated"}), 406

# google login
@auth_bp.route("/google_login", methods=["POST"])    
def google_login():
    """Handles Google Login for users only"""
    data = request.get_json()
    email = data.get("email")

    user = Users.query.filter_by(email=email).first()
    
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Generate JWT token with 'is_user' claim
    access_token = create_access_token(identity=user.id, additional_claims={'is_user': True})

    return jsonify({"access_token": access_token, "message": "Google login successful"})

# done 
# LOG OUT CURRENT USER
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify({"success": "Logged Out successfully"}), 200