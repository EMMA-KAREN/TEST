from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Interventions
from datetime import datetime

intervention_bp = Blueprint("intervention_bp", __name__)

# CREATE INTERVENTION
@intervention_bp.route("/interventions", methods=["POST"])
@jwt_required()
def create_intervention():
    data = request.get_json()
    user_id = get_jwt_identity()
    
    new_intervention = Interventions(
        title=data["title"],
        description=data["description"],
        image=data.get("image"),
        video=data.get("video"),
        location=data.get("location"),
        user_id=user_id
    )
    db.session.add(new_intervention)
    db.session.commit()
    return jsonify({"msg": "Intervention record created successfully"}), 201

# EDIT INTERVENTION
@intervention_bp.route("/interventions/<int:intervention_id>", methods=["PUT"])
@jwt_required()
def edit_intervention(intervention_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    intervention = Interventions.query.get(intervention_id)
    
    if not intervention or intervention.user_id != user_id:
        return jsonify({"error": "Record not found or unauthorized"}), 403
    
    intervention.title = data.get("title", intervention.title)
    intervention.description = data.get("description", intervention.description)
    intervention.image = data.get("image", intervention.image)
    intervention.video = data.get("video", intervention.video)
    intervention.location = data.get("location", intervention.location)
    db.session.commit()
    return jsonify({"msg": "Intervention record updated successfully"}), 200

# DELETE INTERVENTION
@intervention_bp.route("/interventions/<int:intervention_id>", methods=["DELETE"])
@jwt_required()
def delete_intervention(intervention_id):
    user_id = get_jwt_identity()
    intervention = Interventions.query.get(intervention_id)
    
    if not intervention or intervention.user_id != user_id:
        return jsonify({"error": "Record not found or unauthorized"}), 403
    
    db.session.delete(intervention)
    db.session.commit()
    return jsonify({"msg": "Intervention record deleted successfully"}), 200
