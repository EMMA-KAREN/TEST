import pytest
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mail import Mail
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../')))

from models import db, Users, Admins, TokenBlocklist
from views.auth import auth_bp  

@pytest.fixture
def app():
    """Create and configure a new app instance for testing."""
    app = Flask(__name__)

    # Set up a test database (SQLite in-memory for testing)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["TESTING"] = True
    app.config["JWT_SECRET_KEY"] = "test-secret-key"
    app.config["MAIL_SUPPRESS_SEND"] = True  # Disable sending emails in tests

    # Initialize extensions
    db.init_app(app)
    jwt = JWTManager(app)
    mail = Mail(app)

    with app.app_context():
        db.create_all()

        # Move `user_bp` import inside the app context to prevent circular import
        from views.user import user_bp  
        app.register_blueprint(user_bp)

    app.register_blueprint(auth_bp)

    yield app

    # Clean up database
    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    """Provides a test client for the Flask app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """Provides a CLI runner for the Flask app."""
    return app.test_cli_runner()
