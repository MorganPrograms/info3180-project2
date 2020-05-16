from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import InputRequired

class Login(FlaskForm):
	username = StringField('Username', validators=[InputRequired()])
      password = PasswordField('Password', validators=[InputRequired()])

class PostForm(FlaskForm):
    photo =  FileField('Profile Picture', validators=[FileRequired(),FileAllowed(images, 'Images only!')])
    caption = StringField('Write a caption...', validators=[InputRequired()])
	
class RegForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired()])
    password = PasswordField('Password', validators=[InputRequired()])
    firstname = StringField('First Name', validators=[DataRequired()])
    lastname = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    location = StringField('Location', validators=[DataRequired()])
    biography = TextAreaField('Biography', render_kw={"rows": 5, "cols": 40}, validators=[DataRequired()])
    photo = FileField('Photo', validators=[FileRequired(),FileAllowed(images, 'Images only!')])
