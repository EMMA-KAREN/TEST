import pytest
from app import app, db
from models import Users, RedFlags, Interventions, Admins, Comments, TokenBlocklist
from datetime import datetime

def setup_module(module):
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    with app.app_context():
        db.create_all()

def teardown_module(module):
    with app.app_context():
        db.drop_all()

@pytest.fixture
def test_client():
    with app.test_client() as client:
        with app.app_context():
            db.session.begin()
        yield client
        with app.app_context():
            db.session.rollback()

# User Model Tests

def test_create_user():
    with app.app_context():
        user = Users(
            first_name="John",
            last_name="Doe",
            email="john@example.com",
            password="securepassword",
            phone=1234567890
        )
        db.session.add(user)
        db.session.commit()

        assert user.id is not None
        assert user.first_name == "John"
        assert user.email == "john@example.com"

# RedFlags Model Tests

def test_create_red_flag():
    with app.app_context():
        user = Users.query.first()
        red_flag = RedFlags(
            title="Test Red Flag",
            description="This is a test red flag",
            status="Pending",
            user_id=user.id
        )
        db.session.add(red_flag)
        db.session.commit()

        assert red_flag.id is not None
        assert red_flag.title == "Test Red Flag"
        assert red_flag.user_id == user.id

# Interventions Model Tests

def test_create_intervention():
    with app.app_context():
        user = Users.query.first()
        intervention = Interventions(
            title="Test Intervention",
            description="This is a test intervention",
            status="Ongoing",
            user_id=user.id
        )
        db.session.add(intervention)
        db.session.commit()

        assert intervention.id is not None
        assert intervention.title == "Test Intervention"
        assert intervention.user_id == user.id

# Admin Model Tests

def test_create_admin():
    with app.app_context():
        admin = Admins(
            first_name="Admin",
            last_name="User",
            email="admin@example.com",
            password="adminpassword",
            phone=9876543210
        )
        db.session.add(admin)
        db.session.commit()

        assert admin.id is not None
        assert admin.email == "admin@example.com"

# Comments Model Tests

def test_create_comment():
    with app.app_context():
        comment = Comments(
            name="Test User",
            email="testuser@example.com",
            comment="This is a test comment."
        )
        db.session.add(comment)
        db.session.commit()

        assert comment.id is not None
        assert comment.email == "testuser@example.com"

# TokenBlocklist Model Tests

def test_create_token_blocklist():
    with app.app_context():
        token = TokenBlocklist(
            jti="testjti",
            created_at=datetime.utcnow()
        )
        db.session.add(token)
        db.session.commit()

        assert token.id is not None
        assert token.jti == "testjti"
