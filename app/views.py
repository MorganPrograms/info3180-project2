"""
Flask Documentation:     http://flask.pocoo.org/docs/
Jinja2 Documentation:    http://jinja.pocoo.org/2/documentation/
Werkzeug Documentation:  http://werkzeug.pocoo.org/documentation/
This file creates your application.
"""
from werkzeug.utils import secure_filename
from flask import Flask, render_template, url_for, request, redirect,abort
from app import app, db, login_manager
from flask import jsonify
import os
from app.__init__ import UPLOAD_FOLDER
from flask_session import Session
from  datetime import date
import datetime
from werkzeug.datastructures import CombinedMultiDict
#from app.__init__ import UPLOAD_FOLDER
from flask import render_template, request, redirect, url_for, flash, session, abort, g
from flask_login import login_user, logout_user, current_user, login_required
from app.forms import Login, RegForm,PostForm
from app.models import User, Follows, Post, Likes 
#from is_safe_url import is_safe_url
from werkzeug.security import check_password_hash
import jwt
from flask import _request_ctx_stack
from functools import wraps
import base64



@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def index(path):
    """
    Because we use HTML5 history mode in vue-router we need to configure our
    web server to redirect all routes to index.html. Hence the additional route
    "/<path:path".
    Also we will render the initial webpage and then let VueJS take control.
    """
    return render_template('index.html')
Usergroup = []
###
# Routing for your application.
###
now = datetime.datetime.now()
def requires_auth(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    auth = request.headers.get('Authorization', None)
    if not auth:
      return jsonify({'code': 'authorization_header_missing', 'description': 'Authorization header is expected'}), 401

    parts = auth.split()

    if parts[0].lower() != 'bearer':
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must start with Bearer'}), 401
    elif len(parts) == 1:
      return jsonify({'code': 'invalid_header', 'description': 'Token not found'}), 401
    elif len(parts) > 2:
      return jsonify({'code': 'invalid_header', 'description': 'Authorization header must be Bearer + \s + token'}), 401

    token = parts[1]
    try:
         payload = jwt.decode(token, 'some-secret')

    except jwt.ExpiredSignature:
        return jsonify({'code': 'token_expired', 'description': 'token is expired'}), 401
    except jwt.DecodeError:
        return jsonify({'code': 'token_invalid_signature', 'description': 'Token signature is invalid'}), 401

    g.current_user = user = payload
    return f(*args, **kwargs)

  return decorated
# Here we define a function to collect form errors from Flask-WTF
# which we can later use
def form_errors(form):
    error_messages = []
    """Collects form errors"""
    for field, errors in form.errors.items():
        for error in errors:
            message = u"Error in the %s field - %s" % (
                    getattr(form, field).label.text,
                    error
                )
            error_messages.append(message)

    return error_messages

def get_uploaded_images():
    rootdir = os.getcwd()
    image_list=[]
    print (rootdir)
    for subdir, dirs, files in os.walk(rootdir + '/app/static/uploads'):
        for file in files:
            # print (os.path.join(subdir, file))
            #print(file)
            image_list.append( file)
    return image_list
    
# connect to v-onclick button in api fetch in js file
@app.route('/api/users/<user_id>/follow')
@requires_auth
def follow(user_id):
    followerID = current_user.id
    
    print(followerID==int(user_id))
    if followerID != int(user_id):    
        if Follows.query.filter_by(user_id=user_id,follower_id=followerID).first() is None:
            newFollow = Follows(user_id,followerID)
            db.session.add(newFollow)
            db.session.commit()
            return jsonify(follow = "New Follower of " + user_id)
        else:
            return jsonify(follow = "You are already a follower of this user!")
    else:
        return jsonify(follow = "You Cannot Follow Yourself!")
    
    
@app.route('/api/posts/<post_id>/like')
@requires_auth
def Like(post_id):
    LikerID = current_user.id
    LikeCheck=Likes.query.filter_by(user_id=LikerID,post_id=post_id).first()
    if LikeCheck is None:
        LikedPost = Likes(LikerID,post_id)
        db.session.add(LikedPost)
        db.session.commit()
        return jsonify(Like = "New Like!",likestatus = "free")
    else:
        return jsonify(greedy = "You have already liked this post!",likestatus = "done")
        # display message in webpage

    
@app.route('/api/auth/login', methods=['POST'])
def login():
    
    form = Login()
    if request.method == "POST":
        # change this to actually validate the entire form submission
        # and not just one field
        if form.validate_on_submit():
            # Get the username and password values from the form.
            username = form.username.data
            password = form.password.data
            
            user = User.query.filter_by(username=username).first()
            if user is not None and check_password_hash(user.password, password):
                
                
                
                
                login_user(user)
                payload = {'sub':'12345' , 'name':username }
                token = jwt.encode(payload, 'some-secret', algorithm='HS256').decode('utf-8')

                return jsonify(error=None, data={'token': token}, message="Token Generated", LoginState = "Success")
                
                
                
                
                #return jsonify(LoginState = "Success" )
                
                
                 
            else:
                
                return jsonify(LoginState = "Fail" )
        else:
            return jsonify(LoginState = "Failure")
            
    

@app.route("/api/posts", methods=['GET']) 
@requires_auth
def AllPosts():
    PostData = []
    UserData = []
    LikeData = []
    AllUsers = db.session.query(User).all()
    AllPost = db.session.query(Post).all()
    AllLikes = db.session.query(Likes).all()
    
    for post in AllPost:
        data = {
            'id': post.id,
            'user_id': post.user_id,
            'photo': post.photo,
            'caption': post.caption,
            'created_on':post.created_on,
            'likes' :  Likes.query.filter_by(post_id=post.id).count()
            
        }
        PostData.append(data)
    for like in AllLikes:
        data = {
            'id': like.id,
            'user_id': like.user_id,
            
            'post_id': like.post_id,
            
            
        }
        LikeData.append(data)
    for user in AllUsers:
        data = {
            'id':user.id,
            'username': user.username,
            'FirstName': user.first_name,
            'LastName': user.last_name,
            'date_joined':user.joined_on,
            'photo': user.profile_photo,
            'email': user.email,
            'location': user.location,
            'biography': user.biography,
            'password': user.password
        }
        UserData.append(data)
    
    
    return jsonify(Posts=PostData,Users = UserData, Likes = LikeData)

@app.route("/api/users", methods=['GET'])   
@requires_auth
def getUserID():
    ID = current_user.id
    return jsonify(ID=ID)

    
    
@app.route("/api/users/<user_id>/posts", methods=['GET','POST'])
@requires_auth
#@login_required
def posts(user_id):
    # how exactly will the user_id be obtained? - check corresponding vue frontend
    #form =PostForm(CombinedMultiDict((request.files, request.form)))
    form =PostForm()
    filefolder = UPLOAD_FOLDER
    
    if request.method == 'POST':
        if form.validate_on_submit():
            useID= user_id # use current ID
            file = request.files.get('file')
            file=form.photo.data
            if file:
                print("FILE EXISTS");
                print(form.photo.data.filename)
            filename = secure_filename(form.photo.data.filename)
            cap = form.caption.data
            form.photo.data.save(os.path.join(filefolder, filename))
            now = datetime.datetime.now()
            currentDate = now.strftime("%B-%d-%Y")
            post = Post(useID,file.filename,cap,currentDate)
            db.session.add(post)
            db.session.commit()
            status = "success"
            return jsonify(state=status)
        else:
            errors = form_errors(form)
            status = "wrong"
            return jsonify(error=errors,state=status)
    elif request.method == 'GET':
        posts = Post.query.filter_by(user_id=user_id).all() # Created as an array (I think)
        followYet=Follows.query.filter_by(user_id=user_id,follower_id=current_user.id).count()
        
        if int(user_id)==int(current_user.id):
                following = "same guy"
        else:
            if followYet ==0:
                following = "no"
            else:
                
                following ="yes"
        postList = [] 
        postAmt= db.session.query(Post).filter_by(user_id=user_id).count()
        Followers= db.session.query(Follows).filter_by(user_id=user_id).count()
        if postAmt!=0:
            
            for post in posts:
                data = {
                    'id': post.id,
                    'user_id': post.user_id,
                    'photo': post.photo,
                    'caption': post.caption,
                    'created_on':post.created_on,
                    
                }
                postList.append(data)
        userFacts = []
        user = User.query.filter_by(id=user_id).first()
        
        usedata = {
            'id':user.id,
            'username': user.username,
            'FirstName': user.first_name,
            'LastName': user.last_name,
            'date_joined':user.joined_on,
            'photo': user.profile_photo,
            'email': user.email,
            'location': user.location,
            'followAmt': Followers,
            'biography': user.biography,
            'password': user.password
        }
        userFacts.append(usedata)
        # (May have to) try to separate them from within view file
        #Also send current user info from here to be placed in template - Try self.request.user
        
        
        return jsonify(userPosts = postList,userInfo=userFacts,PAmt=postAmt,follow = following)
        

    
    
    
@app.route("/api/users/register", methods=['POST'])
def register():
    # get forms from group mate repository
    form=RegForm()
    #form =RegForm(CombinedMultiDict((request.files, request.form)))
    filefolder = UPLOAD_FOLDER
    
    
    if request.method == 'POST':
        pwordcheck = db.session.query(User).all()
        pexists = False
        for user in pwordcheck:
            if check_password_hash(user.password, form.password.data):
                pexists = True
                
        if form.validate_on_submit() and User.query.filter_by(username=form.username.data).first() is None and pexists==False and User.query.filter_by(email=form.email.data).first() is None:
            #try to figure how to hash password here so that you can check it as well
        
            # Get the username and password values from the form.
            uname = form.username.data
            fname = form.firstname.data
            
            lname = form.lastname.data
            password = form.password.data
            location = form.location.data
            now = datetime.datetime.now()
            currentDate = now.strftime("%B-%d-%Y")
            #currentDate = now.strftime("%d-%B-%Y %H:%M:%S")
            email = form.email.data
            
            biography = form.biography.data
            #file= form.photo.data
            file = request.files.get('file')
            file=form.photo.data
            if file:
                print("FILE EXISTS");
                print(form.photo.data.filename)
            filename = secure_filename(form.photo.data.filename)
            form.photo.data.save(os.path.join(filefolder, filename))
            #file = request.files['inputFile']
            """UNameTest = User.query.filter_by(username=uname).first()
            if UNameTest is  not None:"""
                
            user= User( uname,fname, lname,password, location, email,biography,file.filename,currentDate)
            db.session.add(user)
            db.session.commit()
            return jsonify(access = 'true',UINFO = uname)
            #flash('User Added successfully.', 'success')
            
        else:
            
            errors = form_errors(form)
            status = "wrong"
            if pexists ==True:
                errors.append("Password already exists!")
            if User.query.filter_by(username=form.username.data).first() is not None:
                uNameError = "User name already exists"
                errors.append(uNameError)
            if User.query.filter_by(email=form.email.data).first() is not None:
                MailError = "Email Address already exists"
                errors.append(MailError)
            """if User.query.filter_by(password=).first() is not None:
                MailError = "Passwor already in use"
                errors.append(MailError)"""
            return jsonify(error=errors,access = "fail")
            
            #flash("Try again")
            #print (form.errors.items())
            
    
    
@app.route('/')
def home():
    """Render website's home page."""
    return render_template('home.html')


@app.route('/about/')
def about():
    """Render the website's about page."""
    return render_template('about.html')








# user_loader callback. This callback is used to reload the user object from
# the user ID stored in the session
@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

###
# The functions below should be applicable to all Flask apps.
###

@app.route("/api/auth/logout", methods = ['GET'])
@requires_auth
#@login_required
def logout():
    # Logout the user and end the session
    logout_user()
    return jsonify(logout = "Logout successful")
    


@app.route('/<file_name>.txt')
def send_text_file(file_name):
    """Send your static text file."""
    file_dot_text = file_name + '.txt'
    return app.send_static_file(file_dot_text)

def flash_errors(form):
    for field, errors in form.errors.items():
        for error in errors:
            flash(u"Error in the %s field - %s" % (getattr(form, field).label.text,error), 'danger')

@app.after_request
def add_header(response):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    response.headers['X-UA-Compatible'] = 'IE=Edge,chrome=1'
    response.headers['Cache-Control'] = 'public, max-age=0'
    return response


@app.errorhandler(404)
def page_not_found(error):
    """Custom 404 page."""
    return render_template('404.html'), 404
    


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="8080")
