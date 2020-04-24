from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import TextAreaField
from wtforms.validators import DataRequired

class UploadForm(FlaskForm):
      description = TextAreaField('Description', validators=[DataRequired()])
      photo = FileField('Photo', validators=[FileRequired(),FileAllowed(['jpg', 'png', 'Images only!'])])
    
