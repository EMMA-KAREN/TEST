from flask import jsonify, request, Blueprint
from models import RedFlags, Users, db, Admins
from flask_jwt_extended import  jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from flask_mail import  Message


def get_mail():
    from app import mail  # Import `mail` only when needed
    return mail

red_flag_bp = Blueprint("red_flag_bp", __name__)

# ADD A RedFlag
@red_flag_bp.route("/red_flag", methods=["POST"])
@jwt_required()
def add_red_flag():
    current_user_id = get_jwt_identity()
    # user = Users.query.get(current_user_id)
    user = db.session.get(Users, current_user_id)
  
    data = request.get_json()
    print(data)

    from geopy.geocoders import Nominatim
    def get_coordinates(location):
        geolocator = Nominatim(user_agent="interventions.py")
        location_info = geolocator.geocode(location)
        if location_info:
            return location_info.latitude, location_info.longitude
        else:
            return "Location not found"

    # location = "Nairobi Buruburu"
    # coordinates = get_coordinates(location)
    # print(f" {coordinates[0]} {coordinates[1]}")
        

    title = data['title']
    description = data['description']
    image = data['image']
    video = data['video']
    location = data['location']
    coordinates = get_coordinates(location)

    status = data.get('status', 'active')  
    
    user_id = current_user_id  

    
    # check_user = Users.query.get(user_id)
    check_user = db.session.get(Users, user_id)

    if not check_user:
        return jsonify({"error": "User doesn't exist"}), 406
    
    new_red_flag = RedFlags( title=title, description=description, image=image, video=video, user_id=user_id, location=location, coordinates=f"{coordinates[0]}, {coordinates[1]}" ,status=status)
    
    db.session.add(new_red_flag)
    db.session.commit()
    current_date = datetime.now().strftime("%d-%m-%Y")
    msg = Message('Red Flag Created', sender='iregisterweb@gmail.com', recipients=[user.email])

    msg.html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Red Flag Created - iReporter</title>
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
                <h1>Red Flag Created Successfully!</h1>
            </div>
            <div class="body-content">
                <p>Hello {user.first_name} {user.last_name},</p>
                <p>Your red flag titled "<strong>{title}</strong>" has been created successfully and is now part of the iReporter system.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li><strong>Title:</strong> {title}</li>
                    <li><strong>Description:</strong> {description}</li>
                    <li><strong>Location:</strong> {location}</li>
                    <li><strong>Status:</strong> {status}</li>
                </ul>
                <p>Your red flag will be reviewed and addressed by the appropriate authorities. Thank you for your contribution to making a positive change!</p>
                <p>If you need any assistance or have questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
                <p>Best regards,<br>The iReporter Team</p>
                <p><i>Sent on: {current_date}</i></p>
            </div>
        </div>
    </body>
    </html>
    """

    # Send the email
    mail = get_mail()  
    
    mail.send(msg)
    
    return jsonify({"success": "Red Flag added successfully"}), 201

    

# ADMIN FETCHING ALL RED FLAGS IN THE DB  and USER FETCHING ALL RED FLAGS RELATED TO THEM PLUS ALL RED FLAGS IN THE DB  WHILE LOGED IN
@red_flag_bp.route("/red_flag", methods=["GET"])
@jwt_required()
def fetch_red_flags():
    current_user_id = get_jwt_identity()
    claims = get_jwt()

    # If the user is an admin, return all red flags
    if claims.get('is_admin'):  
        red_flags = RedFlags.query.all()
        red_flag_list = []
        for red_flag in red_flags:
            red_flag_list.append({
                "id": red_flag.id,
                "title": red_flag.title,
                "description": red_flag.description,
                "image": red_flag.image,
                "video": red_flag.video,
                "location": red_flag.location,
                "status": red_flag.status,
                "created_at": red_flag.created_at,
                "user_id": {
                    "id": red_flag.users.id,
                    "First Name": red_flag.users.first_name,
                    "Last Name": red_flag.users.last_name,
                    "Email": red_flag.users.email,
                    "Phone": red_flag.users.phone,
                    "Profile Picture": red_flag.users.profile_picture
                }
            })
        return jsonify(red_flag_list), 200

    else:
        # user = Users.query.get(current_user_id)
        user = db.session.get(Users, current_user_id)
        if user:
            
            red_flags = RedFlags.query.all()
            user_red_flags = RedFlags.query.filter_by(user_id=current_user_id).all()
            
           
            all_red_flags = red_flags + user_red_flags
            red_flag_list = []

            seen_ids = set()
            for red_flag in all_red_flags:
                if red_flag.id not in seen_ids:
                    red_flag_list.append({
                        "id": red_flag.id,
                        "title": red_flag.title,
                        "description": red_flag.description,
                        "image": red_flag.image,
                        "video": red_flag.video,
                        "location": red_flag.location,
                        "status": red_flag.status,
                        "created_at": red_flag.created_at,
                        "user_id": {
                            "id": red_flag.users.id,
                            "First Name": red_flag.users.first_name,
                            "Last Name": red_flag.users.last_name,
                            "Email": red_flag.users.email,
                            "Phone": red_flag.users.phone,
                            "Profile Picture": red_flag.users.profile_picture
                        }
                    })
                    seen_ids.add(red_flag.id)

            return jsonify(red_flag_list), 200
        else:
            return jsonify({"error": "User not found"}), 404


# FETCH A SINGLE Red FLAG RELATED TO THE CURRENT USER LOGED IN
@red_flag_bp.route("/red_flag/<int:red_flag_id>", methods=["GET"])
@jwt_required()
def fetch_red_flag(red_flag_id):
    current_user_id = get_jwt_identity()
    red_flag = RedFlags.query.filter_by(id=red_flag_id, user_id=current_user_id).first()

    if red_flag:
        red_flag_data = {
            "id": red_flag.id,
            "title": red_flag.title,
            "description": red_flag.description,
            "image": red_flag.image,
            "video": red_flag.video,
            "location": red_flag.location,
            "status": red_flag.status,
            "created_at": red_flag.created_at,
            "user_id": {
                "id": red_flag.users.id,
                "First Name": red_flag.users.first_name,
                "Last Name": red_flag.users.last_name,
                "Email": red_flag.users.email,
                "Phone": red_flag.users.phone
            }
          
        }

        return jsonify(red_flag_data)
    
    return jsonify({"error": f'red_flag selected is not assigned to You'}), 406 


# UPDATE A RED FLAG
@red_flag_bp.route("/red_flag/<int:red_flag_id>", methods=["PATCH"])
@jwt_required()
def update_red_flag(red_flag_id):
    # current_user_id = get_jwt_identity()

    claims = get_jwt()
    if claims.get('is_admin'):
        # red_flag = RedFlags.query.get(red_flag_id)
        red_flag = db.session.get(RedFlags, red_flag_id)
        if red_flag:
            data = request.get_json()
            status = data.get('status', red_flag.status)
            
            # Getting the admin's details
            # admin = Admins.query.get(claims.get('sub'))
            admin = db.session.get(Admins, claims.get('sub'))
            
            # Querying the users data soi can fetch the email of the user that the red flag belongs to 
            # user = Users.query.get(red_flag.user_id)
            user = db.session.get(Users, red_flag.user_id)

            if user:
                user_email = user.email 

                red_flag.status = status
                db.session.commit()
                
                current_date = datetime.now().strftime("%d-%m-%Y")
                
                
                msg = Message('Red Flag Status Updated', sender='iregisterweb@gmail.com', recipients=[user_email])

                msg.html = f"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Red Flag Status Updated</title>
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
                        <h1>Your Red Flag Status has been Updated</h1>
                    </div>
                    <div class="body-content">
                        <p>Hello {user.first_name} {user.last_name},</p>
                        <p><strong>New Status:</strong> {status}</p>
                        <p><strong>Updated By:</strong> {admin.first_name} {admin.last_name} (Admin)</p>
                        <p>If you have any questions regarding this update, feel free to contact us.</p>
                        <p>Thank you for your continued engagement with iReporter!</p>
                    </div>
                    <div class="footer">
                        <p><i>Sent on: {current_date}</i></p>
                    </div>
                </div>
                </body>
                </html>
                """

                # Send the email to the user
                mail = get_mail()  
                mail.send(msg)
                
                return jsonify({"success": "Red Flag status updated successfully"}), 200

            return jsonify({"error": ""}), 404
    
    elif claims.get('is_user'):

        # user = Users.query.get(claims.get('sub'))
        user = db.session.get(Users, claims.get('sub'))
        
        # red_flag = RedFlags.query.get(red_flag_id)
        red_flag = db.session.get(RedFlags, red_flag_id)
        if red_flag:
            data = request.get_json()
            title = data.get('title', red_flag.title)
            description = data.get('description', red_flag.description)
            image = data.get('image', red_flag.image)
            video = data.get('video', red_flag.video)

            if title != red_flag.title:
                old_title = red_flag.title 
                red_flag.title = title
            else:
                old_title = red_flag.title  

            red_flag.description = description
            red_flag.image = image
            red_flag.video = video
            db.session.commit()

            current_date = datetime.now().strftime("%d-%m-%Y")
            
            msg = Message('Red Flag Status Updated', sender='iregisterweb@gmail.com', recipients=[user.email])

            msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Red Flag Status Updated</title>
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
            <div class="body-content">
                <p>Hello {user.first_name} {user.last_name},</p>
                <p>Your red flag titled "<strong>{old_title}</strong>" has been UPDATED successfully and is now part of the iReporter system.</p>
                <p><strong>Details:</strong></p>
               <ul>
                    <li><strong>New Title:</strong> {red_flag.title}</li>
                    <li><strong>New Description:</strong> {red_flag.description}</li>
                    <li><strong>Image:</strong> {red_flag.image if image is not None else 'No image uploaded'}</li>
                    <li><strong>Video:</strong> {red_flag.video if video is not None else 'No video uploaded'}</li>
                </ul>
                <p>Your red flag will be reviewed and addressed by the appropriate authorities. Thank you for your contribution to making a positive change!</p>
                <p>If you need any assistance or have questions, feel free to reach out to our support team.</p>
            </div>
                <div class="footer">
                    <p><i>Sent on: {current_date}</i></p>
                </div>
            </div>
            </body>
            </html>
            """

            # Send the email to the user
            mail = get_mail()  
            mail.send(msg)
            return jsonify({"success": "Red Flag details updated successfully"}), 200


    return jsonify({"error": "Must be an admin to update a loan!"}), 404  


# DELETE A RED FLAG
@red_flag_bp.route("/red_flag/<int:red_flag_id>", methods=["DELETE"])
@jwt_required()
def delete_red_flag(red_flag_id):
    current_user_id = get_jwt_identity()

    # user = Users.query.get(current_user_id)
    user = db.session.get(Users, current_user_id )

    if user:
        # red_flag = RedFlags.query.get(red_flag_id)
        red_flag = db.session.get(RedFlags, red_flag_id)
        
        if not red_flag:
            return jsonify({"error": "Red Flag not found"}), 404
        
        
        if red_flag.user_id != current_user_id:
            return jsonify({"error": "You can only delete your own red flags!"}), 403
        
        
        if red_flag.status == "resolved":
            db.session.delete(red_flag)
            db.session.commit()
            return jsonify({"success": "Red Flag deleted successfully"}), 200
        else:
            return jsonify({"error": "Red Flag must be Resolved to be deleted"}), 400
    else:
        return jsonify({"error": "User not found or not authorized"}), 406
    
# Fetch all red flags
@red_flag_bp.route("/red_flags/all", methods=["GET"])
def fetch_all_red_flags():
    try:
        red_flags = RedFlags.query.all()
        red_flag_list = []

        for red_flag in red_flags:
            red_flag_list.append({
                "id": red_flag.id,
                "title": red_flag.title,
                "description": red_flag.description,
                "image": red_flag.image,
                "video": red_flag.video,
                "location": red_flag.location,
                "coordinates": red_flag.coordinates,
                "status": red_flag.status,
                "created_at": red_flag.created_at,
                "user_id": {
                    "id": red_flag.users.id if red_flag.users else None,
                    "First Name": red_flag.users.first_name if red_flag.users else None,
                    "Last Name": red_flag.users.last_name if red_flag.users else None,
                    "Email": red_flag.users.email if red_flag.users else None,
                    "Phone": red_flag.users.phone if red_flag.users else None,
                    "Profile Picture": red_flag.users.profile_picture if red_flag.users else None
                } if red_flag.users else None
            })

        return jsonify(red_flag_list), 200

    except Exception as error:
        return jsonify({"error": str(error)}), 500