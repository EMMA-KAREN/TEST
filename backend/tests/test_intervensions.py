import pytest
import json
from flask_jwt_extended import create_access_token
from models import Users, Interventions, db
from werkzeug.security import generate_password_hash

@pytest.fixture
def auth_headers(client, app):
    """Create a test user and return authentication headers."""
    with app.app_context():  # Ensure database operations run within the app context
        test_user = Users(
            first_name="John",
            last_name="Doe",
            email="john.doe@example.com",
            password=str(generate_password_hash("testpassword")),
            phone="1234567890"
        )
        db.session.add(test_user)
        db.session.commit()

        # Simulate login to get JWT token
        response = client.post("/login", json={"email": "john.doe@example.com", "password": "testpassword"})

        if response.status_code != 200:
            raise RuntimeError("Login failed during test setup!")
        token = response.json.get("access_token")
    
        return {"Authorization": f"Bearer {token}"}, test_user.id



from unittest.mock import patch, MagicMock
from flask_mail import Message

def test_add_intervention(client, auth_headers):
    headers, user_id = auth_headers
    payload = {
    "title": "Pothole Fix Request",
    "description": "Large pothole on Main Street",
    "image": "https://example.com/image.jpg",
    "video": "https://example.com/video.mp4",
    "location": "Downtown",
    "status": "pending",
    "user_id": user_id,  # 🔹 Add this if required by schema
    "created_at": "2024-02-20T12:00:00Z"  # 🔹 Add if required
    }


    with patch("flask_mail.Message", autospec=True) as mock_message, \
         patch("app.mail.send") as mock_mail_send:
        
        mock_message_instance = MagicMock()
        mock_message_instance.subject = "Intervention Created"  # Ensure subject is a string
        mock_message.return_value = mock_message_instance  

        response = client.post("/intervention", json=payload, headers=headers)

        # Debugging prints
        print("🔹 Sent Payload:", payload)
        print("🔹 Response Status:", response.status_code)
        print("🔹 Response Data:", response.json)

        # Assertions
        assert response.status_code == 201
        mock_mail_send.assert_called_once()  # Ensure the email send function was called




def test_add_intervention_without_auth(client):
    """Test creating an intervention without authentication."""
    payload = {
        "title": "Pothole Fix Request",
        "description": "Large pothole on Main Street",
        "image": "https://example.com/image.jpg",
        "video": "https://example.com/video.mp4",
        "location": "Downtown",
        "status": "active"
    }
    response = client.post("/intervention", json=payload)
    assert response.status_code == 401  # Unauthorized request
    assert "msg" in response.json
    assert response.json["msg"] == "Missing Authorization Header"


def test_add_intervention_invalid_data(client, auth_headers):
    """Test creating an intervention with invalid data."""
    headers, _ = auth_headers
    payload = {"title": "", "description": ""}  # Missing required fields
    response = client.post("/intervention", json=payload, headers=headers)
    
    assert response.status_code == 422 or response.status_code == 400  # Unprocessable Entity or Bad Request
    assert "error" in response.json or "msg" in response.json
