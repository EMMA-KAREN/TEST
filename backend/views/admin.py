# from flask import jsonify, request, Blueprint
# from models import  Admins, db, TokenBlocklist
# from werkzeug.security import  generate_password_hash
# # from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
# # from datetime import datetime, timedelta, timezone
# # from flask_mail import  Message

# admin_bp = Blueprint("admin", __name__)

# # Get all admins
# @admin_bp.route("/api/admins", methods=["GET"])
# def get_admins():
#     admins = Admin.query.all()
#     admin_list = [{"id": admin.id, "first_name": admin.first_name, "last_name": admin.last_name, "email": admin.email, "phone": admin.phone, "profile_picture": admin.profile_picture} for admin in admins]
#     return jsonify(admin_list)

# # Update admin profile
# @admin_bp.route("/api/admin/update", methods=["PUT"])
# def update_admin():
#     data = request.json
#     admin = Admin.query.get(data.get("id"))
    
#     if not admin:
#         return jsonify({"error": "Admin not found"}), 404

#     admin.phone = data.get("phone", admin.phone)
#     admin.email = data.get("email", admin.email)
#     admin.profile_picture = data.get("profile_picture", admin.profile_picture)

#     if data.get("password"):
#         admin.password = generate_password_hash(data["password"])

#     db.session.commit()
#     return jsonify({"message": "Admin updated successfully"}), 200
