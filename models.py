from . import db

from werkzeug.security import generate_password_hash

class Post(db.Model):
     __tablename__ = 'posts'
     id = db.Column(db.Integer,primary_key=True)
     user_id = db.Column(db.Integer)
     photo  = db.Column(db.String(100))
     caption = db.Column(db.String(100))
     created_on = db.Column(db.String(40))
     
     def __init__(self,user,pic,cap,created_on):
         self.user_id = user
         self.photo =pic
         self.caption = cap
         self.created_on = created_on
     
     def is_authenticated(self):
        return True

     def is_active(self):
        return True

     def is_anonymous(self):
        return False

     def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

     def __repr__(self):
        return '<User %r>' % (self.username)
        
class Likes(db.Model):
     id = db.Column(db.Integer,primary_key=True)
     user_id = db.Column(db.Integer)
     post_id = db.Column(db.Integer)
     def __init__(self,user,pID):
         self.user_id = user
         self.post_id = pID
     
     def is_authenticated(self):
        return True

     def is_active(self):
        return True

     def is_anonymous(self):
        return False

     def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

     def __repr__(self):
        return '<User %r>' % (self.pID)
     
class Follows(db.Model):
     id = db.Column(db.Integer,primary_key=True)
     user_id = db.Column(db.Integer)
     follower_id = db.Column(db.Integer)
     
     def __init__(self,user,FID):
         self.user_id = user
         self.follower_id = FID
     
     def is_authenticated(self):
        return True

     def is_active(self):
        return True

     def is_anonymous(self):
        return False

     def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

     def __repr__(self):
        return '<User %r>' % (self.pID)
class User(db.Model):
    # You can use this to change the table name. The default convention is to use
    # the class name. In this case a class name of UserProfile would create a
    # user_profile (singular) table, but if we specify __tablename__ we can change it
    # to `user_profiles` (plural) or some other name.
    __tablename__ = 'users'
    
    id = db.Column(db.Integer,primary_key=True)
    username = db.Column(db.String(80), unique=True)
    password = db.Column(db.String(255))
    first_name = db.Column(db.String(80))
    last_name = db.Column(db.String(80))
    location = db.Column(db.String(80))
    email = db.Column(db.String(30), unique=True)
    biography = db.Column(db.String(600))
   
    profile_photo =db.Column(db.String(100))
    joined_on = db.Column(db.String(40))
    
    
    def __init__(self,userN, first_name, last_name,password, location, email,biography,filen,date):
   # def __init__(self, first_name, last_name, location, email,bibliography,gender):
        self.username = userN
        self.first_name = first_name
        self.last_name = last_name
        self.password = generate_password_hash(password, method='pbkdf2:sha256')
        self.location = location
        self.email = email
        self.biography =biography
        
        self.profile_photo=filen
        self.joined_on = date

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2 support
        except NameError:
            return str(self.id)  # python 3 support

    def __repr__(self):
        return '<User %r>' % (self.username)
