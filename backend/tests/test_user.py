import json
import pytest
from models import db, Users, Red_Flags, Interventions
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import create_access_token
from unittest.mock import patch
# from flask_sqlalchemy import SQLAlchemy

# db = SQLAlchemy()

def test_register_user(client, app):
    """Test user registration API."""
    with app.app_context():
        # Test successful registration
        new_user_data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "johndoe@example.com",
            "password": "securepassword",
            "phone": "987654321",
            "profile_picture": "https://example.com/profile.jpg"
        }

        response = client.post('/user',  # Directly use the route path
                       data=json.dumps(new_user_data),
                       content_type='application/json')

        
        assert response.status_code == 200
        assert response.json["msg"] == "User Registered Successfully"
        
        # Check if user exists in database
        user = Users.query.filter_by(email=new_user_data["email"]).first()
        assert user is not None
        assert user.first_name == "John"
        assert check_password_hash(user.password, "securepassword")

        # Test duplicate email registration
        response = client.post('/user',  # Use actual route path
                       data=json.dumps(new_user_data),
                       content_type='application/json')

        
        assert response.status_code == 404
        assert response.json["error"] == "Email exists"

        # Test duplicate phone registration
        new_user_data["email"] = "newemail@example.com"  # Change email to avoid email conflict
        response = client.post('/user',  # Use actual route path
                       data=json.dumps(new_user_data),
                       content_type='application/json')
        
        assert response.status_code == 404
        assert response.json["error"] == "Phone Number exists"




def test_fetch_users(client, app):
    """Test fetching all users."""
    with app.app_context():
        # Clear existing users to avoid conflicts
        db.session.query(Users).delete()

        # Create test users with a password field
        user1 = Users(
            first_name="Alice", 
            last_name="Doe", 
            email="alice@example.com", 
            phone="123456789", 
            profile_picture="https://example.com/alice.jpg",
            password="testpassword123"  # Added password
        )
        user2 = Users(
            first_name="Bob", 
            last_name="Smith", 
            email="bob@example.com", 
            phone="987654321", 
            profile_picture="https://example.com/bob.jpg",
            password="securepass456"  # Added password
        )

        db.session.add_all([user1, user2])
        db.session.commit()

        # Make GET request to fetch users
        response = client.get("/users")

        assert response.status_code == 200

        data = response.json
        assert isinstance(data, list)
        assert len(data) == 2

        # Validate user data
        assert data[0]["first_name"] == "Alice"
        assert data[0]["email"] == "alice@example.com"
        assert data[1]["first_name"] == "Bob"
        assert data[1]["email"] == "bob@example.com"


def test_delete_user_as_admin(client, app):
    """Test deleting a user as an admin."""
    with app.app_context():
        # Create admin user
        admin_user = Users(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            phone="123456789",
            profile_picture="https://example.com/admin.jpg",
            password="adminpass"
        )
        db.session.add(admin_user)
        db.session.commit()

        # Create test user to delete
        user_to_delete = Users(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            phone="987654321",
            profile_picture="https://example.com/john.jpg",
            password="testpassword"
        )
        db.session.add(user_to_delete)
        db.session.commit()


        # Create admin token
        admin_token = create_access_token(identity=str(admin_user.id), additional_claims={"is_admin": True})


        # Make DELETE request as admin
        response = client.delete(
            f"/user/{user_to_delete.id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )

        print(response.status_code)
        print(response.json)


        assert response.status_code == 200
        assert response.json == {"success": "User Deleted successfully"}

        # Verify user is deleted
        deleted_user = db.session.get(Users, user_to_delete.id)
        assert deleted_user is None


def test_delete_user_as_self(client, app):
    """Test user deleting their own account."""
    with app.app_context():
        # Create test user
        user = Users(
            first_name="Jane",
            last_name="Doe",
            email="jane@example.com",
            phone="555555555",
            profile_picture="https://example.com/jane.jpg",
            password="mypassword"
        )
        db.session.add(user)
        db.session.commit()

        # Create user token
        user_token = create_access_token(identity=str(user.id), additional_claims={"is_user": True})


        # Make DELETE request as the user
        response = client.delete(
            f"/user/{user.id}",
            headers={"Authorization": f"Bearer {user_token}"}
        )

        print(response.status_code)
        print(response.json)  # Check error message for more clues


        assert response.status_code == 200
        assert response.json == {"success": "Account Deleted successfully"}

        # Verify user is deleted
        deleted_user = db.session.get(Users, user.id)
        assert deleted_user is None


def test_delete_user_unauthorized(client, app):
    """Test deleting a user without authentication."""
    with app.app_context():
        # Create test user
        user = Users(
            first_name="Unauthorized",
            last_name="User",
            email="unauth@example.com",
            phone="111111111",
            profile_picture="https://example.com/unauth.jpg",
            password="nopassword"
        )
        db.session.add(user)
        db.session.commit()

        # Attempt DELETE request without a token
        response = client.delete(f"/user/{user.id}")

        assert response.status_code == 401
        assert response.json == {"msg": "Missing Authorization Header"}


        # Verify user still exists
        

        existing_user = db.session.get(Users, user.id)

        assert existing_user is not None
