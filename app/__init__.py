from flask import Flask, render_template, url_for, request, redirect
from flask_login import LoginManager
from flask_sqlalchemy import SQLAlchemy
from flask_session import Session
from flask_wtf.csrf import CSRFProtect
import jwt
app = Flask(__name__)
UPLOAD_FOLDER = './app/static/uploads'
csrf = CSRFProtect(app)
#app.config['SECRET_KEY'] = "b/[prlfmq=e-cmsrt"
app.config['SECRET_KEY'] = 'v\xf9\xf7\x11\x13\x18\xfaMYp\xed_\xe8\xc9w\x06\x8e\xf0f\xd2\xba\xfd\x8c\xda'
app.config['UPLOAD_FOLDER']= UPLOAD_FOLDER

#app.config['SECRET_KEY'] = "Sup3r$3cretkey"
                                        
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://yivfkwlqpmlxeb:7718be8ef4fd4e8086706152ba372839d48192899b150887349779d616706653@ec2-34-193-117-204.compute-1.amazonaws.com:5432/deeacomoee622b"
#app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://project2:1@localhost/project2"
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://wzpajfueqqtply:87ebc884a7a798ff648a032ac69f3a6679065c3ab8b90fe3ce6c33c805c862cb@ec2-54-81-37-115.compute-1.amazonaws.com:5432/de6j5eqq2uds8p'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True # added just to suppress a warning
app.config.from_object(__name__)
db = SQLAlchemy(app)

# Flask-Login login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

app.config.from_object(__name__)
from app import views
