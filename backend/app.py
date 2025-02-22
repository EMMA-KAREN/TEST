import os
from flask import Flask
from flask_migrate import Migrate
from models import db, TokenBlocklist
from flask_jwt_extended import JWTManager
from datetime import timedelta
from flask_mail import Mail
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("SQLALCHEMY_DATABASE_URI")
migrate = Migrate(app, db)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "fallbackSecretKey")  
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(minutes=55)

jwt = JWTManager(app)
jwt.init_app(app)

from views import *

app.register_blueprint(user_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(red_flag_bp)
app.register_blueprint(intervention_bp)
# app.register_blueprint(contact_us_bp)

# Test route
@app.route("/")
def index():
    return """
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iRegister API Documentation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 0;
            background-color: #121212;
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .container {
            max-width: 900px;
            background: #1e1e1e;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.1);
            text-align: center;
        }
        h1, h2, h3 {
            color: #bb86fc;
        }
        p {
            color: #b0b0b0;
        }
        code {
            background: #333;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            color: #bb86fc;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #292929;
            border-radius: 5px;
            overflow: hidden;
        }
        th, td {
            border: 1px solid #444;
            padding: 10px;
            text-align: left;
        }
        th {
            background: #2a2a2a;
            color: #bb86fc;
        }
        .auth-required {
            background: #cf6679;
            color: white;
            padding: 4px;
            border-radius: 3px;
            font-size: 12px;
        }
        .footer {
            font-size: 14px;
            color: #b0b0b0;
        }
        a {
            color: #bb86fc;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>iRegister API Documentation</h1>
        <p>Welcome to the iRegister API! This API helps participate in the improvement of their society. Below is a list of available endpoints with their usage details.</p>

        <div class="section">
            <h2>Authentication</h2>
            <table>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Description</th>
                    <th>Auth</th>
                </tr>
                <tr>
                    <td><code>/register</code></td>
                    <td>POST</td>
                    <td>Registers a new user (Normal or Admin role).</td>
                    <td>&#10008;</td>
                </tr>
                <tr>
                    <td><code>/login</code></td>
                    <td>POST</td>
                    <td>Authenticates the current user & returns JWT token.</td>
                    <td>&#10008;</td>
                </tr>
                <tr>
                    <td><code>/current_user</code></td>
                    <td>GET</td>
                    <td>Fetches authenticated user details.</td>
                    <td><span class="auth-required">&#10004; JWT</span></td>
                </tr>
                <tr>
                    <td><code>/user/update</code></td>
                    <td>PUT</td>
                    <td>Updates user details.</td>
                    <td><span class="auth-required">&#10004; JWT</span></td>
                </tr>
                <tr>
                    <td><code>/logout</code></td>
                    <td>DELETE</td>
                    <td>Logs out the current user</td>
                    <td><span class="auth-required">&#10004; JWT</span></td>
                </tr>
                <tr>
                    <td><code>/user/user_id</code></td>
                    <td>DELETE</td>
                    <td>Deletes user account.</td>
                    <td><span class="auth-required">&#10004; JWT</span></td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Red Flags</h2>
            <table>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Description</th>
                    <th>Auth</th>
                </tr>
                <tr>
                    <td><code>/red_flag</code></td>
                    <td>POST</td>
                    <td>Creates a new Red Flag.</td>
                    <td><span class="auth-required">&#10004; Org</span></td>
                </tr>
                <tr>
                    <td><code>/red_flags</code></td>
                    <td>GET</td>
                    <td>Fetches all Red Flags. (As Admin)</td>
                    <td><span class="auth-required">&#10004; JWT</span></td>
                </tr>
                <tr>
                    <td><code>/red_flag/red_flag_id</code></td>
                    <td>GET</td>
                    <td>Fetch a single Red Flag</td>
                    <td><span class="auth-required">&#10004; Red Flags</span></td>
                </tr>
                <tr>
                    <td><code>/red_flag/red_flag_id</code></td>
                    <td>PATCH</td>
                    <td>Update a Red Flag</td>
                    <td><span class="auth-required">&#10004; Red Flags</span></td>
                </tr>
                <tr>
                    <td><code>/red_flag/red_flag_id</code></td>
                    <td>DELETE</td>
                    <td>Delete a Red Flag.</td>
                    <td><span class="auth-required">&#10004; Red Flags</span></td>
                </tr>
            </table>
        </div>

        <div class="section">
            <h2>Interventions</h2>
            <table>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Description</th>
                    <th>Auth</th>
                </tr>
                <tr>
                    <td><code>/intervention</code></td>
                    <td>POST</td>
                    <td>Creates a new Intervention.</td>
                    <td><span class="auth-required">&#10004; Org</span></td>
                </tr>
                <tr>
                    <td><code>/interventions</code></td>
                    <td>GET</td>
                    <td>Fetches all Interventions. (As Admin)</td>
                    <td><span class="auth-required">&#10004; JWT</span></td>
                </tr>
                <tr>
                    <td><code>/intervention/intervention_id</code></td>
                    <td>GET</td>
                    <td>Fetch a single Intervention</td>
                    <td><span class="auth-required">&#10004; Interventions</span></td>
                </tr>
                <tr>
                    <td><code>/intervention/intervention_id</code></td>
                    <td>PATCH</td>
                    <td>Update an Intervention</td>
                    <td><span class="auth-required">&#10004; Interventions</span></td>
                </tr>
                <tr>
                    <td><code>/intervention/intervention_id</code></td>
                    <td>DELETE</td>
                    <td>Delete an Intervention.</td>
                    <td><span class="auth-required">&#10004; Interventions</span></td>
                </tr>
            </table>
        </div>

        <div class="footer">
            <p>For any questions or support, contact us at <a href=''>iregisterweb@gmail.com</a></p>
            <p>&copy; 2025 iRegister API</p>
        </div>
    </div>
</body>
</html>

    """

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()
    return token is not None
