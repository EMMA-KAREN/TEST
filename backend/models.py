from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from datetime import datetime

metadata = MetaData()

# Initialize the database
db = SQLAlchemy(metadata=metadata)

# User Table
class Users(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(512), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    phone = db.Column(db.Integer, unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  
    
    red_flags = db.relationship('Red_Flags', backref='users', lazy=True)
    intervensions = db.relationship('Interventions', backref='users', lazy=True)

# Red_Flags Table
class Red_Flags(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=True)
    video = db.Column(db.String(512), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    location = db.Column(db.String(255))
    status = db.Column(db.String(50), default='active')  # Ensure this line is present
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


# Interventions Table
class Interventions(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image = db.Column(db.String(512), nullable=True)  
    video = db.Column(db.String(512), nullable=True)  
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    location = db.Column(db.String(255))  

   
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)


# Admin Table
class Admins(db.Model):
 
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(255), nullable=False)
    last_name = db.Column(db.String(255), nullable=False)
    profile_picture = db.Column(db.String(512), nullable=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(512), nullable=False)
    phone = db.Column(db.Integer, unique=True, nullable=False)

# Comments Table
class Comments(db.Model):
 
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    comment = db.Column(db.String(512), nullable=False)
       
    

# TokenBlocklist Table
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)    
   