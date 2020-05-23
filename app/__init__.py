from flask import Flask
from flask_login import LoginManager
from flask_wtf.csrf import CSRFProtect
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
UPLOAD_FOLDER = './app/static/uploads'
csrf = CSRFProtect(app)
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['UPLOAD_FOLDER']= UPLOAD_FOLDER
app = Flask(__name__)
app.config['SECRET_KEY'] = "Sup3r$3cretkey"
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://gcadkjlimwnywa:61ac040d19c9a82b52a7f518f85e44984bc39bf563e3da2520caa073de48f6f0@ec2-50-17-90-177.compute-1.amazonaws.com:5432/d3ik5smiq96pck"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
app.config.from_object(__name__)
db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views
