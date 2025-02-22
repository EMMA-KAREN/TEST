from flask import jsonify, request, Blueprint
from models import Interventions, Users, db, Admins
from flask_jwt_extended import  jwt_required, get_jwt_identity, get_jwt
from datetime import datetime
from flask_mail import  Message


def get_mail():
    from app import mail  # Import `mail` only when needed
    return mail

intervention_bp = Blueprint("intervention_bp", __name__)

# ADD A RedFlag
@intervention_bp.route("/intervention", methods=["POST"])
@jwt_required()
def add_intervention():
    current_user_id = get_jwt_identity()
    # user = Users.query.get(current_user_id)
    user = db.session.get(Users, current_user_id)
    print("User:", user)
    print("User email:", user.email if user else "No user")

  
    data = request.get_json()
    
    # Debugging print
    print("📩 Received Payload:", data)

    if not data:
        return jsonify({"error": "Invalid JSON payload"}), 400

    required_fields = ["title", "description", "image", "video", "location"]
    
    # Check for missing fields
    for field in required_fields:
        if field not in data:
            print(f"🚨 Missing field: {field}")
            return jsonify({"error": f"Missing field: {field}"}), 422

    title = data['title']
    description = data['description']
    image = data['image']
    video = data['video']
    location = data['location']
    
    
    status = data.get('status', 'active')  
    
    user_id = current_user_id  

    
    # check_user = Users.query.get(user_id)
    check_user = db.session.get(Users, user_id)

    if not check_user:
        return jsonify({"error": "User doesn't exist"}), 406
    
    new_intervention = Interventions( title=title, description=description, image=image, video=video, user_id=user_id, location=location, status=status)
    
    db.session.add(new_intervention)
    db.session.commit()
    current_date = datetime.now().strftime("%d-%m-%Y")
    msg = Message('Intervention Created', sender='iregisterweb@gmail.com', recipients=[user.email])

    msg.html = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Intervention Created - iReporter</title>
        <style>
            body {{
                font-family: 'Helvetica Neue', Arial, sans-serif;
                color: #333;
                background-color: #f4f7fc;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }}
            .container {{
                width: 100%;
                max-width: 650px;
                margin: 0 auto;
                padding: 30px;
                background-color: #ffffff;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                font-size: 16px;
            }}
            .header {{
                text-align: center;
                padding-bottom: 30px;
                border-bottom: 2px solid #e5e5e5;
                margin-bottom: 20px;
            }}
            .header h1 {{
                color: #1a202c;
                font-size: 28px;
                margin: 0;
            }}
            .body-content {{
                font-size: 16px;
                color: #555;
                margin-bottom: 20px;
            }}
            .body-content p {{
                margin: 0 0 15px;
            }}
            .body-content ul {{
                list-style-type: none;
                padding: 0;
            }}
            .body-content li {{
                margin-bottom: 8px;
            }}
            .footer {{
                text-align: center;
                font-size: 14px;
                color: #888;
                margin-top: 30px;
                padding-top: 15px;
                border-top: 1px solid #e5e5e5;
            }}
            .cta-button {{
                display: inline-block;
                padding: 12px 30px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: 600;
                margin-top: 15px;
            }}
            .cta-button:hover {{
                background-color: #0056b3;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Intervention Created Successfully!</h1>
            </div>
            <div class="body-content">
                <p>Dear {user.first_name} {user.last_name},</p>
                <p>We are pleased to inform you that your intervention titled "<strong>{title}</strong>" has been successfully created and is now part of the iReporter system.</p>
                <p><strong>Details:</strong></p>
                <ul>
                    <li><strong>Title:</strong> {title}</li>
                    <li><strong>Description:</strong> {description}</li>
                    <li><strong>Location:</strong> {location}</li>
                    <li><strong>Status:</strong> {status}</li>
                </ul>
                <p>Your intervention will be reviewed and addressed by the relevant authorities. Thank you for your valuable contribution to creating positive change in your community!</p>
                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
               
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
    
    return jsonify({"success": "Intervention added successfully"}), 201

    

# ADMIN FETCHING ALL INTERVENSIONS IN THE DB  and USER FETCHING ALL INTERVENSIONS RELATED TO THEM PLUS ALL INTERVENTIONS IN THE DB  WHILE LOGED IN
@intervention_bp.route("/intervention", methods=["GET"])
@jwt_required()
def fetch_interventions():
    current_user_id = get_jwt_identity()
    claims = get_jwt()

    # If the user is an admin, return all Interventions
    if claims.get('is_admin'):  
        interventions = Interventions.query.all()
        intervention_list = []
        for intervention in interventions:
            intervention_list.append({
                "id": intervention.id,
                "title": intervention.title,
                "description": intervention.description,
                "image": intervention.image,
                "video": intervention.video,
                "location": intervention.location,
                "status": intervention.status,
                "created_at": intervention.created_at,
                "user_id": {
                    "id": intervention.users.id,
                    "First Name": intervention.users.first_name,
                    "Last Name": intervention.users.last_name,
                    "Email": intervention.users.email,
                    "Phone": intervention.users.phone,
                    "Profile Picture": intervention.users.profile_picture
                }
            })
        return jsonify(intervention_list), 200

    else:
        # user = Users.query.get(current_user_id)
        user = db.session.get(Users, current_user_id)
        if user:
            
            interventions = Interventions.query.all()
            user_interventions = Interventions.query.filter_by(user_id=current_user_id).all()
            
           
            all_interventions = interventions + user_interventions
            intervention_list = []

            seen_ids = set()
            for intervention in all_interventions:
                if intervention.id not in seen_ids:
                    intervention_list.append({
                        "id": intervention.id,
                        "title": intervention.title,
                        "description": intervention.description,
                        "image": intervention.image,
                        "video": intervention.video,
                        "location": intervention.location,
                        "status": intervention.status,
                        "created_at": intervention.created_at,
                        "user_id": {
                            "id": intervention.users.id,
                            "First Name": intervention.users.first_name,
                            "Last Name": intervention.users.last_name,
                            "Email": intervention.users.email,
                            "Phone": intervention.users.phone,
                            "Profile Picture": intervention.users.profile_picture
                        }
                    })
                    seen_ids.add(intervention.id)

            return jsonify(intervention_list), 200
        else:
            return jsonify({"error": "User not found"}), 404


# FETCH A SINGLE INTERVENTION RELATED TO THE CURRENT USER LOGED IN
@intervention_bp.route("/intervention/<int:intervention_id>", methods=["GET"])
@jwt_required()
def fetch_intervention(intervention_id):
    current_user_id = get_jwt_identity()
    intervention = Interventions.query.filter_by(id=intervention_id, user_id=current_user_id).first()

    if intervention:
        intervention_data = {
            "id": intervention.id,
            "title": intervention.title,
            "description": intervention.description,
            "image": intervention.image,
            "video": intervention.video,
            "location": intervention.location,
            "status": intervention.status,
            "created_at": intervention.created_at,
            "user_id": {
                "id": intervention.users.id,
                "First Name": intervention.users.first_name,
                "Last Name": intervention.users.last_name,
                "Email": intervention.users.email,
                "Phone": intervention.users.phone
            }
          
        }

        return jsonify(intervention_data)
    
    return jsonify({"error": f'intervention selected is not assigned to You'}), 406 


# UPDATE A INTERVENTION
@intervention_bp.route("/intervention/<int:intervention_id>", methods=["PATCH"])
@jwt_required()
def update_intervention(intervention_id):
    # current_user_id = get_jwt_identity()

    claims = get_jwt()
    if claims.get('is_admin'):
        # intervention = Interventions.query.get(intervention_id)
        intervention = db.session.get(Interventions, intervention_id)
        if intervention:
            data = request.get_json()
            status = data.get('status', intervention.status)
            
            # Getting the admin's details
            # admin = Admins.query.get(claims.get('sub'))
            admin = db.session.get(Admins, claims.get('sub'))
            
            # Querying the users data soi can fetch the email of the user that the INTERVENTION belongs to 
            # user = Users.query.get(intervention.user_id)
            user = db.session.get(Users, intervention.user_id)

            if user:
                user_email = user.email 

                intervention.status = status
                db.session.commit()
                
                current_date = datetime.now().strftime("%d-%m-%Y")
                
                
                msg = Message('Intervention Status Updated', sender='iregisterweb@gmail.com', recipients=[user_email])

                msg.html = f"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Intervention Status Updated</title>
                    <style>
                        body {{
                            font-family: 'Helvetica Neue', Arial, sans-serif;
                            background-color: #f7f7f7;
                            margin: 0;
                            padding: 0;
                        }}
                        .container {{
                            width: 100%;
                            max-width: 650px;
                            margin: 0 auto;
                            padding: 30px;
                            background-color: #ffffff;
                            border-radius: 10px;
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                            font-size: 16px;
                        }}
                        .header {{
                            text-align: center;
                            padding-bottom: 25px;
                            border-bottom: 2px solid #e5e5e5;
                            margin-bottom: 25px;
                        }}
                        .header h1 {{
                            color: #2c3e50;
                            font-size: 28px;
                            margin: 0;
                        }}
                        .body-content {{
                            font-size: 16px;
                            line-height: 1.6;
                            color: #555;
                            margin-bottom: 30px;
                        }}
                        .body-content p {{
                            margin: 0 0 15px;
                        }}
                        .status {{
                            font-weight: bold;
                            color: #1E90FF;
                            font-size: 18px;
                        }}
                        .footer {{
                            text-align: center;
                            font-size: 14px;
                            color: #777;
                            margin-top: 20px;
                            padding-top: 15px;
                            border-top: 1px solid #e5e5e5;
                        }}
                        .cta-button {{
                            display: inline-block;
                            padding: 12px 30px;
                            background-color: #1E90FF;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-weight: 600;
                            margin-top: 20px;
                            text-align: center;
                        }}
                        .cta-button:hover {{
                            background-color: #0056b3;
                        }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Your Intervention's Status Has Been Updated</h1>
                        </div>
                        <div class="body-content">
                            <p>Dear {user.first_name} {user.last_name},</p>
                            <p>We are writing to inform you that the status of your intervention has been updated. Please see the details below:</p>
                            <p><strong>New Status:</strong> <span class="status">{status}</span></p>
                            <p><strong>Updated By:</strong> {admin.first_name} {admin.last_name} (Admin)</p>
                            <p>If you have any questions or need further assistance, feel free to contact us at any time.</p>
                            <p>We appreciate your ongoing engagement with iReporter, and thank you for helping create positive change in your community!</p>
                            <a href="#" class="cta-button">View Your Intervention</a>
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
                
                return jsonify({"success": "Intervention status updated successfully"}), 200

            return jsonify({"error": ""}), 404
    
    elif claims.get('is_user'):

        # user = Users.query.get(claims.get('sub'))
        user = db.session.get(Users, claims.get('sub'))
        
        # intervention = Interventions.query.get(intervention_id)
        intervention = db.session.get(Interventions, intervention_id)
        if intervention:
            data = request.get_json()
            title = data.get('title', intervention.title)
            description = data.get('description', intervention.description)
            image = data.get('image', intervention.image)
            video = data.get('video', intervention.video)

            if title != intervention.title:
                old_title = intervention.title 
                intervention.title = title
            else:
                old_title = intervention.title  

            intervention.description = description
            intervention.image = image
            intervention.video = video
            db.session.commit()

            current_date = datetime.now().strftime("%d-%m-%Y")
            
            msg = Message('Intervention Status Updated', sender='iregisterweb@gmail.com', recipients=[user.email])
            msg.html = f"""
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Intervention Status Updated</title>
                <style>
                    body {{
                        font-family: 'Helvetica Neue', Arial, sans-serif;
                        background-color: #f7f7f7;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        width: 100%;
                        max-width: 650px;
                        margin: 0 auto;
                        padding: 30px;
                        background-color: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        font-size: 16px;
                    }}
                    .header {{
                        text-align: center;
                        padding-bottom: 25px;
                        border-bottom: 2px solid #e5e5e5;
                        margin-bottom: 20px;
                    }}
                    .header h1 {{
                        color: #2c3e50;
                        font-size: 28px;
                        margin: 0;
                    }}
                    .body-content {{
                        font-size: 16px;
                        line-height: 1.6;
                        color: #555;
                        margin-bottom: 30px;
                    }}
                    .body-content p {{
                        margin: 0 0 15px;
                    }}
                    .details-list {{
                        list-style-type: none;
                        padding: 0;
                    }}
                    .details-list li {{
                        margin-bottom: 10px;
                    }}
                    .footer {{
                        text-align: center;
                        font-size: 14px;
                        color: #777;
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #e5e5e5;
                    }}
                    .status {{
                        font-weight: bold;
                        color: #28a745;
                        font-size: 18px;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Your Intervention Has Been Successfully Updated</h1>
                    </div>
                    <div class="body-content">
                        <p>Hello {user.first_name} {user.last_name},</p>
                        <p>We are pleased to inform you that your intervention titled "<strong>{old_title}</strong>" has been updated successfully and is now part of the iReporter system.</p>
                        <p><strong>Updated Details:</strong></p>
                        <ul class="details-list">
                            <li><strong>New Title:</strong> {intervention.title}</li>
                            <li><strong>New Description:</strong> {intervention.description}</li>
                            <li><strong>Image:</strong> {intervention.image if image is not None else 'No image uploaded'}</li>
                            <li><strong>Video:</strong> {intervention.video if video is not None else 'No video uploaded'}</li>
                        </ul>
                        <p>Your intervention will now be reviewed and addressed by the appropriate authorities. We appreciate your contribution to making a positive change!</p>
                        <p>If you need assistance or have any questions, please don’t hesitate to contact our support team.</p>
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
            return jsonify({"success": "Intervention details updated successfully"}), 200

    return jsonify({"error": "Must be an admin to update a loan!"}), 404  


# DELETE A INTERVENTION
@intervention_bp.route("/intervention/<int:intervention_id>", methods=["DELETE"])
@jwt_required()
def delete_intervention(intervention_id):
    current_user_id = get_jwt_identity()

    # user = Users.query.get(current_user_id)
    user = db.session.get(Users, current_user_id )

    if user:
        # intervention = Interventions.query.get(intervention_id)
        intervention = db.session.get(Interventions, intervention_id)
        
        if not intervention:
            return jsonify({"error": "Intervention not found"}), 404
        
        
        if intervention.user_id != current_user_id:
            return jsonify({"error": "You can only delete your own Interventions!"}), 403
        
        
        if intervention.status == "resolved":
            db.session.delete(intervention)
            db.session.commit()
            return jsonify({"success": "Intervention deleted successfully"}), 200
        else:
            return jsonify({"error": "Intervention must be 'resolved' to be deleted"}), 400
    else:
        return jsonify({"error": "User not found or not authorized"}), 406


   


