/* Add your Application JavaScript */
//<router-link :to="{Login: '/login'}">
//<router-link to="/explore" tag="button">No</router-link>
//router.push({ name: 'user', params: { userId } }) // -> /user/123
//<router-link to="/foo" tag="button">foo</router-link>  try to use this for routing
/*import Vue from 'vue';
import Vuetify from 'vuetify';
import "isomorphic-fetch";*/
//Make sure to add click.prevent to all buttons

const proxyurl = "https://whispering-tor-87831.herokuapp.com";


Vue.prototype.$logStatus = "off";
const Explore = Vue.component('Explore-page',{//requires current user ID
    template:`
    <div class = "UsersPosts">
       
        <div class = "posts">
       
        <span v-for="post in Posts" class="post__item">
        <div class = "post">
            
            <span v-for="user in Users">
                <span v-if="user.id == post.user_id">
                
                    <img class = "profexplorepic" :src="'/static/uploads/' + user.photo" :alt="user.photo" /><button id = "codeName" class="btn btn-primary mb-2" @click="GoToUser(user.username)">{{user.username}}</button>
                    
                    
                </span>
              
            </span>
            <br>
          <img class = "postpic" :src="'/static/uploads/'+post.photo" alt = "Picture"/> 
          
          <br>
          <p class = "cap">{{post.caption}}</p>
            <div class = "postInfo">
             
                <div>
                <button id = "likeit" class="btn btn-primary mb-2" @click="AddLike(post.id),post.likes++"><img id = "likeicon" src="../static/likeicon.png"></button>{{post.likes}} <p id = "likeAmt">Likes!</p>
                </div>
                
             
             
             
             
             <div id = "postdate">
                {{post.created_on}}
             </div>
             </div>
             </div>
         
        
        </span>
        </div>
        
        
         <div class = "NewPostButton">
            <button id = "postit" class="btn btn-primary mb-2" @click="GoToPostForm">New Post</button>
        </div>
    </div>
   
    
    `
,
  created: function() {
    let self = this;
    fetch('/api/users',{
         'headers':{
             'Authorization': 'Bearer ' + localStorage.getItem('token')
         }
     })// use my My-Profile menu-item
         .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        
        self.LikeID = data.ID});
     fetch('/api/posts',{
         'headers':{
             'Authorization': 'Bearer ' + localStorage.getItem('token')
         }
     })
     
     .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        if(data.Posts){
        self.Users = data.Users;
        self.Posts = data.Posts;
        self.Likes = data.Likes;
        console.info("Authorization Successful!")
        }
        //let result = response.data;
                        // successful response
        else{
            
            console.info("Authorization Failed!")
            alert("You must be logged in to use this Function!")
            
            self.$router.push({ path: '/'});
            
        }              
        });
   
    
        /*fetch('/api/users/self.ID/posts')
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        //self.Users = data.userInfo;
        });*/
        
        
        },
    data: function() {
  return {
  Users: [],
  Posts : [],
  Likes : [],
  LikeID: null,
  PostID: null,
  ViewID: null
    }
  },
   methods:
      {
          GoToUser: function(uname){
              let self = this;
            console.log("Hello")
            /*console.log(uname)
            console.log(self.Users)
            console.log(self.Users.length)
            console.log(self.Users[0].username)*/
            for(user in self.Users){
                console.log("Hello")
                console.log(user)
                console.log(self.Users[user].username)
               // this.$router.push({ name: 'login' });
                if(self.Users[user].username == uname){
                    self.ViewID = self.Users[user].id
                   console.log("Found you")
                    
                    self.$router.push({ name: 'users', params: { user_id:self.ViewID } })
                }
            }
    
            
          },
          
          AddLike: function(PostID){
              fetch("/api/posts/"+PostID+"/like",{
                  method : 'GET',
                  credentials: 'same-origin'
                  ,
                  'headers':{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                  }
     
              })
                .then(function (response) {
                return response.json();
                })
                .then(function (data) {
                // display a success message
                console.log(data)          
                if(data.likestatus == 'done'){
                    alert("You have already liked this post!")
                }
                else{
                //self.PostID = data.ID
                //router.push({ name: 'posts/new', params: { Pid:self.PostID } })
                // remember to set up prop['Pid' in posts/new frontend
                //route.push({ path: '/posts/new'})
                for(post in self.Posts){
                    if(self.Posts[post].id == PostID){
                        self.Posts[post].likes +=1
                    }
                }
                }
                })
                .catch(function (error) {
                console.log(error);
                });
          },
          Liker: function () {
             alert("You have already liked this post!")
          },
          
          
          GoToPostForm: function(){
              self = this;
              this.$router.push({ name: "/posts/new" });
             /*
              fetch("/api/users",{
                  method : 'GET',
                  credentials: 'same-origin'
              })
                .then(function (response) {
                return response.json();
                })
                .then(function (data) {
                // display a success message
                console.log(jsonResponse)          
                //self.PostID = data.ID
                //router.push({ name: 'posts/new', params: { Pid:self.PostID } })
                // remember to set up prop['Pid' in posts/new frontend
                route.push({ path: '/posts/new'})
                })
                .catch(function (error) {
                console.log(error);
                });*/
          }
          
          
      }
})

const Home = Vue.component('Home-page',{
    template:`
    
    <div id = "container">
    <div class = "HomePicture">
    <img id = "homeicon" src="../static/Halo_master_chief.jpe">
    
    </div>
    <div class = "homebuttons">
    <div class = "title">
    <img id = "titleicon" src="../static/camera.png">
    <h4 id = "photogram">Photogram</h4>
    </div>
    <hr id = "line">
    <p id = "welcomehome">Share photos of your favourite moments with friends, family and the world.</p> 
    <button id = "regbutton"class="btn btn-primary mb-2"@click="GoToRegister">Register</button>
      <button id = "logbutton"class="btn btn-primary mb-2"@click="GoToLogin">Login Now</button>
    </div>
          </div>
      `,
      methods:
      {     
          GoToLogin: function(){
            let self =this
            this.$router.push({ name: 'login' });
            //this.route.go( '/login')
          },
          GoToRegister: function(){
              let self =this;
              this.$router.push({ name: 'register' });
            
          }
          
      }
})

const Logout = Vue.component('LogOff',{
    template:`
    <div>
    <p> Are you sure you want to logout?</p>
    
       <button id = logoff class="btn btn-primary mb-2" @click.prevent="loggingOut">YES</button>
       
       <button class="btn btn-primary mb-2" @click.prevent="logOutCancel">NO</button>
    </div>
    
    `,
    methods: {
        loggingOut: function(){
            self = this;
             
              fetch("/api/auth/logout",{
                  method : 'GET',
                  credentials: 'same-origin'
                  ,
                     'headers':{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
     
              })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse)    
                    if(jsonResponse.logout){
                    localStorage.removeItem('token');
                    console.info('Token removed from localStorage.');
                    alert('Logged out Successfully!');
                    }
                    else{
                        alert("You must be logged IN first!")
                    }
                    
                })
                .catch(function (error) {
                console.log(error);
                });
            
            this.$router.push({ path: '/'})
            //this.$router.push({name: 'products.index', params: { id: 1 }})
        },
        logOutCancel: function(){
            let self = this;
            this.$router.push({ path: '/explore'});
            //this.$router.push({ name: 'explore' });
        }
    },
})
const Register =Vue.component('Register-form',{
    template:`
    <div>
        <span v-if="Success == 'no'">
        <div class = "failure">
        <li v-for="error in state">{{ error }}</p>
        </li>
        </div>
        </span>
        <h3 id ="Rdiv">Register</h3>
        <div class = "RForm">
        <form @submit.prevent="Register" enctype="multipart/form-data" id="RegisterForm">
            <div class="form-group">
                <label for="username" class = "RegField" id = "RegUser">Username</label>
                <input type = "text" class="form-control" name="username" id="username" placeholder = "Your username">
            </div>
            <div class="form-group">
                <label for="First-Name" class = "RegField">First Name</label>
                <input type = "text" class="form-control" name="firstname" id="firstname" placeholder = "Your first name">
            </div>
             <div class="form-group">
                <label for="lastname" class = "RegField">Last Name</label>
                <input type = "text" class="form-control" name="lastname" id="lastname" placeholder = "Your last name">
            </div>
            <div class="form-group">
                <label for="password" class = "RegField">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder = "Your Password">
            </div>
            <div class="form-group">
                <label for="email" class = "RegField">Email</label>
                <input type = "email" class="form-control" name="email" id="email" placeholder = "Email Address">
            </div>
            <div class="form-group">
                <label for="location" class = "RegField">Location</label>
                <input type = "text" class="form-control" name="location" id="location" placeholder = "Location">
            </div>
            <div class="form-group">
            
                <label for="biography" class = "RegField">Biography</label>
                <textarea class="form-control" name="biography" id="biography"></textarea>
            </div>
            <div class="form-group">
                <label for="photo" class = "RegField">Photo</label><br>
                <input name="photo" id="photo" type="file">
            </div>
            
            
             <button id = "newregbutton" class="btn btn-primary mb-2" @click.prevent= "Register()">Register</button>
             
        </form>
        </div>
    </div>
    `,
    data: function() {
  return {
  Success : null,
  state: null
    }
  },
    methods: {
        Register: function(){
            self = this;
            let RegisterForm = document.getElementById('RegisterForm');
            let form_data = new FormData(RegisterForm); 
            //fetch(proxyurl + "/https://22f9d7774dd44c22ada17c36ee8623fb.vfs.cloud9.us-east-1.amazonaws.com/api/register"
              fetch("/api/users/register", {
                  
                method: 'POST',
                body: form_data,
               'headers': {
                'X-CSRFToken': token
                
                    
                },
                credentials: 'same-origin' 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                
                console.log(jsonResponse)       ;
               
                if(jsonResponse.access == 'true'){//if registration is successfull transport to explore page
                    //this.$router.push({ path: '/explore'});
                    self.Success = "Yes"
                    alert("Registration Successful")
                    self.$router.push({ name: 'home' });
                    
                }
                else{
                    self.Success = "no"
                    self.state = jsonResponse.error
                    alert("Registration Failed");
                }
                })
                .catch(function (error) {
                //console.log(error)
                });
                /*if(self.Success == "Yes"){
                    
                    this.$router.push({ name: 'explore' });
                   
                }
                else{
                    alert( "Registration Failed!")
                }*/
                
        }
    },
 
});

const Posts =Vue.component('Post-form',{
   // props: ['Pid'],
    template:`
    <div>
    
        <span v-if="postStatus == 'OK'" >
          <div class = "success">
          {{message}}
        
          </div>
        </span>
        <span v-if="postStatus == 'wrong'">
        <div class = "failure">
        <li v-for="error in message">{{ error}}</p>
        </li>
        </div>
        </span>
        <br>
        <form  enctype="multipart/form-data" id="PostForm">
            
            <h5 class = "postWelcome">New Post</h5>
            <div class = "PForm">
            <div class ="PN">
            <div class="form-group">
                <label for="photo" id = "photolabel">Photo</label><br>
                <input name="photo" id="photo" placeholder = "No File Selected" type="file">
            </div>
            
            <div class="form-group">
            
                <label for="caption" id = "caplabel">Caption</label>
                <textarea class="form-control" name="caption" id="caption" placeholder ="Write a caption..."></textarea>
            </div>
             <button id = "postentry" class="btn btn-primary mb-2" @click.prevent="NewPost">Submit</button>
             </div>
             </div>
        </form>
    </div>
    `,
    created: function() {
    let self = this;
    fetch('/api/users',{
         'headers':{
             'Authorization': 'Bearer ' + localStorage.getItem('token')
         }
     })// use my My-Profile menu-item
     .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.PID= data.ID;
        
        });
    },
    data: function() {
  return {
  Users: [],
  Posts: [],
  message:'',
  PID : null,
  postStatus:''
    }
  },
    methods: {
        NewPost: function(){
            self = this;
            let PostForm = document.getElementById('PostForm');
            let form_data = new FormData(PostForm); 
              fetch("/api/users/" + self.PID +"/posts", {
                  
                method: 'POST',
                body: form_data,
               'headers': {
                'X-CSRFToken': token,
                'Authorization': 'Bearer ' + localStorage.getItem('token')
                
                },
                credentials: 'same-origin' 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                if(jsonResponse.state){
                    
                
                if(jsonResponse.state == "success"){
                    self.postStatus = "OK"
                    self.message = "Post Added Successfully!"
                }
                else{
                     self.postStatus = "wrong"
                     self.message =jsonResponse.error
                }
                console.log(jsonResponse)              ;
                }
                else{
                    alert("You must be logged in to use this Function!");
                }
                    })
                .catch(function (error) {
                console.log(error);
                });
        }
    },
 
});

// For myProfile tab make it so that current user ID is stored in the prop!
// May have to just create another similar component in which you'd use the helper route you made to get the id of the current
const UserProfile = Vue.component('UserProfile',{// get user_id  and details from view file
    //props: ['user_id'],
    template : `
    <div class = "PersonalPosts" :key="componentKey">
            
            <div class = "user">
                
                    <div class = "UPic">
                    <img class = "profpic" :src="'/static/uploads/'+User[0].photo" alt = "Picture"/>
                    </div>
                    <div class = "UData">
                    <h4>{{User[0].FirstName}} {{User[0].LastName}}</h4>
                    <p class = "short">{{User[0].location}}</p>
                    
                    <p>Member since {{User[0].date_joined}}</p>
                    
                    <p>{{User[0].biography}}</p>
                    
                    </div>
                    <div class = "UserStats">
                        <div class ="Posts_Followers">
                            <div>
                            <h4>Posts</h4>{{PostNumber}}
                            </div>
                           <div> <h4>Followers</h4>{{follownumber}}</div><!--{{User[0].followAmt}}-->
                        </div>
                        <br>
                        <span v-if = "followstate == 'No'">
                        <button id = "followlink" class="btn btn-primary mb-2" @click.prevent="Follow(User[0].id),follownumber++,followstate ='yes'">Follow</button>
                        </span>
                        <span v-if = "followstate == 'same'">
                        <button id = "followlink" class="btn btn-primary mb-2" @click.prevent="SameFollow">Follow</button>
                        </span>
                        <span v-if =  "followstate == 'yes'">
                            <button id = "following" class="btn btn-primary mb-2" @click.prevent="Following">Following</button>
                        </span>
                    </div>
                    <div>
                    
                    
                        
                    </div>
            </div>
                    <div class = "UserPosts">
                    <span v-for="post in Posts" class = "postings">
                        
                        
                             <img class = "postpic" :src="'/static/uploads/'+post.photo" alt = "Picture"/> 
                         
                        
                      </span>
                      </div>
                
            </div>
        
            
    </div>    
    `,
  created: function() {
    let self = this;
    if(self.$route.params.user_id =="Your_Profile"){
        console.log("Fetching")
        fetch('/api/users',{
            'headers':{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
        })// use my My-Profile menu-item
         .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        if(data.ID){
        console.log(data)
        
        self.$route.params.user_id = data.ID;
        console.log(self.$route.params.user_id + "HERE")
        self.ID = self.$route.params.user_id
        console.log(self.ID)
        console.log(self.ID + "present")
        fetch('/api/users/'+self.ID+'/posts',
        {
            'headers':{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
        })
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
             if(data.follow == "yes"){
            self.followstate = "yes";
            console.log(data.follow)
            console.log(self.followstate)
            
             }
            if(data.follow == "same guy"){
                self.followstate = "same"
            } 
         //self.$route.params.user_id =null
        console.log(data);
        console.log(self.followstate)
        self.User = data.userInfo;
        self.Posts = data.userPosts;
        self.PostNumber = data.PAmt;
        self.follownumber = data.userInfo[0].followAmt
        });
        }
        else{
            alert("You must be logged in to use this Function!");
            self.$router.push({ path: '/'})
        }
        });
    }
    /*fetch('/api/posts')// use my My-Profile menu-item
     .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.Posts= data.AllPost;
        self.PostNumber = data.PAmt;
        self.Users=data.AllUsers;
        self.ID =user_id;
        });
    */
    else{
      
      self.ID= self.$route.params.user_id  ;
      console.log(self.$route.params.user_id);
      console.log(self.ID + "present")
        fetch('/api/users/'+self.ID+'/posts',{
            'headers':{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
        })
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
            if(data.follow){
         //self.$route.params.user_id =null
        console.log(data)
        if(data.follow == "yes"){
            self.followstate = "yes";
            console.log(data.follow)
            console.log(self.followstate)
        }
        if(data.follow == "same guy"){
                self.followstate = "same"
                console.log(data.follow)
            } 
        self.User = data.userInfo;
        self.Posts = data.userPosts;
        self.PostNumber = data.PAmt;
        self.follownumber = data.userInfo[0].followAmt
        }
        else{
            alert("You must be logged in to use this function!")
        }
        });
    }
        
        
        },
    data: function() {
  return {
  componentKey: 0,
  User: [],
  Posts: [],
  componentKey: 0,
  follownumber:0,
  followstate: "No",
  PostNumber:null,
  ID : null,
 // FollowerID:null,
  //TargetID:null
    }
  },
  methods:{
      Follow: function(UID){
          fetch('/api/users/'+UID+'/follow',
          {
              'headers':{
                      'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
          })
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(UID + "Following")
        console.log(data);
        self.followstate = 'yes'
        //self.follownumber += 1
        
        });
        
        
          
      },
      Following: function(){
          alert("You are already following this user!")
      },
      SameFollow: function(){
           alert("YOU CANNOT FOLLOW YOURSELF!")
      },
       
    
  
  },
  watch:{
      
      '$route' (to, from) {
           if (to.path === '/users/Your_Profile') {
               console.log("Kill Me");
               this.$router.go(this.$router.currentRoute) 
               
               
           }
      }
      
  }
  
});


const Login =Vue.component('Login-form',{
    template:`
    <div>
        <h3 id = "LogTitle">Login</h3>
        <div class = "LForm">
        <form  enctype="multipart/form-data" id="LoginForm">
            <div class="form-group">
                <label for="username" class = "logField">Username</label>
                <input type = "text" class="form-control" name="username" id="username" placeholder = "Your username">
            </div>
            
            <div class="form-group">
                <label for="password" class = "logField">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder = "Your Password">
            </div>
            
             <button id = "logentry" class="btn btn-primary mb-2" @click.prevent="LoggingIn">Login</button>
        </form>
        {{state}}
    </div>
    </div>
    
    `,
     data: function() {
  return {
    Result : null,
    state: null
    }
  },
    methods: {//If login is successful then transport to explore page
    // try to denote true or false value in view file and then send to js file with json
        LoggingIn: function(){
            self = this;
            let LoginForm = document.getElementById('LoginForm');
            let form_data = new FormData(LoginForm); 
              fetch("/api/auth/login", {
                
                method: 'POST',
                body: form_data,
               'headers': {
                'X-CSRFToken': token
                
                      
                    
                },
                credentials: 'same-origin' 
               })
               
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse)   
                
                if(jsonResponse.LoginState == 'Success'){
                    let jwt_token = jsonResponse.data.token;
                    localStorage.setItem('token', jwt_token);
                    console.info('Token generated and added to localStorage.');
                    self.token = jwt_token;
                    alert("Login Successful")
                    self.$router.push({ name: 'explore' });
                    console.log(self.Result)
                    //this.$logStatus = "on"
                    //console.log(this.$logStatus)
                    
                }
                else{
                    alert("Login Failed! Incorrect username or password!")
                }
                 
                }
                )
                .catch(function (error) {
                console.log(error);
                });
                
                
                
        }
    },
 
});

Vue.component('app-header', {
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Photogram</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/register">Register<span class="sr-only">(current)</span></router-link>
          </li>
          
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" :to="{ name: 'users', params: { user_id:'Your_Profile' }}">My own Profile <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
                    
                    <router-link class="nav-link" to="/logout">Logout <span class="sr-only">(current)</span></router-link>
                  </li>
          
          
        </ul>
      </div>
    </nav>
    `
});

Vue.component('app-footer', {
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; Flask Inc.</p>
        </div>
    </footer>
    `
});



const NotFound = Vue.component('not-found', {
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data: function () {
        return {}
    }
})


// Define Routes
const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: "/", name: "home", component: Home},
        // Put other routes here
        {path: "/register",name: "register", component: Register},
        {path: "/logout",name:"logout", component: Logout},
        {path: "/login",name: "login", component: Login},
        {path: "/users/:user_id",name: "users" , component: UserProfile},
        {path: "/explore",name: "explore", component: Explore},
        {path: "/posts/new",name:"/posts/new", component: Posts},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    data: {
        result: 'The result will appear here.',
        token: '',
        tasks: [],
        error: false
    },
    
    router
});
