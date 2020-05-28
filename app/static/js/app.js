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
        <div class = "NewPostButton">
            <button class="btn btn-primary mb-2" @click="GoToPostForm">New Post</button>
        </div>
        <ul>
        <li v-for="post in Posts" class="post__item">
        <div class = "post">
            <span v-for="user in Users">
                <span v-if="user.id == post.user_id">
                
                    <img class = "profexplorepic" :src="'/static/uploads/' + user.photo" :alt="user.photo" /><button class="btn btn-primary mb-2" @click="GoToUser(user.username)">{{user.username}}</button>
                    <!--img src="../static/Halo_master_chief.jpe"-->
                    
                </span>
              
            </span>
          <img class = "postpic" :src="'/static/uploads/'+post.photo" alt = "Picture"/> 
          {{post.photo}}
          <br>
          {{post.caption}}
          <button class="btn btn-primary mb-2" @click="AddLike(post.id)">Like</button>
        </div>
        </li>
        </ul>
    </div>
   
    
    `
,// Problem with images : Name in upload folder and name returned by photo field of User/Post not Matching!!!
  created: function() {
    let self = this;
    fetch('/api/posts')
     .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.Users = data.Users;
        self.Posts = data.Posts;
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
              })
                .then(function (response) {
                return response.json();
                })
                .then(function (data) {
                // display a success message
                console.log(data)          
                //self.PostID = data.ID
                //router.push({ name: 'posts/new', params: { Pid:self.PostID } })
                // remember to set up prop['Pid' in posts/new frontend
                //route.push({ path: '/posts/new'})
                })
                .catch(function (error) {
                console.log(error);
                });
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
    <img src="../static/Halo_master_chief.jpe">
    
    </div>
    <button class="btn btn-primary mb-2"
    @click="GoToRegister">Register</button>
      <button class="btn btn-primary mb-2"
      @click="GoToLogin">Login Now</button>

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
              })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                // display a success message
                console.log(jsonResponse)    
                    this.$logStatus = "off"
                    console.log(this.$logStatus)
                    alert(this.$logStatus)
                    
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
        <span v-if="Success != 'Yes'">
        <div class = "failure">
        <li v-for="error in state">{{ error }}</p>
        </li>
        </div>
        </span>
        <form @submit.prevent="Register" enctype="multipart/form-data" id="RegisterForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type = "text" class="form-control" name="username" id="username" placeholder = "Your username">
            </div>
            <div class="form-group">
                <label for="First-Name">FirstName</label>
                <input type = "text" class="form-control" name="firstname" id="firstname" placeholder = "Your first name">
            </div>
             <div class="form-group">
                <label for="lastname">Last Name</label>
                <input type = "text" class="form-control" name="lastname" id="lastname" placeholder = "Your last name">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder = "Your Password">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type = "email" class="form-control" name="email" id="email" placeholder = "Email Address">
            </div>
            <div class="form-group">
                <label for="location">Location</label>
                <input type = "text" class="form-control" name="location" id="location" placeholder = "Location">
            </div>
            <div class="form-group">
            
                <label for="biography">Biography</label>
                <textarea class="form-control" name="biography" id="biography"></textarea>
            </div>
            <div class="form-group">
                <label for="photo">Photo</label>
                <input name="photo" id="photo" type="file">
            </div>
            
            
             <button class="btn btn-primary mb-2" @click.prevent= "Register()">Register</button>
             
        </form>
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
               headers: {
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
                    self.state = jsonResponse.error
                    alert("Registration Failed")
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
        <form  enctype="multipart/form-data" id="PostForm">
            
            
            <div class="form-group">
                <label for="photo">Photo</label>
                <input name="photo" id="photo" placeholder = "No File Selected" type="file">
            </div>
            
            <div class="form-group">
            
                <label for="caption">Caption</label>
                <textarea class="form-control" name="caption" id="caption" placeholder ="Write a caption"></textarea>
            </div>
             <button class="btn btn-primary mb-2" @click.prevent="NewPost">Submit</button>
        </form>
    </div>
    `,
    created: function() {
    let self = this;
    fetch('/api/users')// use my My-Profile menu-item
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
  PID : null
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
               headers: {
                'X-CSRFToken': token
                },
                credentials: 'same-origin' 
               })
                .then(function (response) {
                return response.json();
                })
                .then(function (jsonResponse) {
                
                console.log(jsonResponse)              
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
    <div class = "UsersPosts">
            <!--p>{{$route.params.user_id }}</p-->
            <div class = "user">
                
                    <div class = "UInfo">
                    <img class = "profpic" :src="'/static/uploads/'+User[0].photo" alt = "Picture"/><p>{{User[0].username}} is HERE!</p>
                    {{User[0].biography}}
                    </div>
                    <div class = "UserStats">
                        <h4>Posts</h4>{{PostNumber}}
                        <h4>Follows</h4>
                    </div>
                    <div>
                    
                    <button class="btn btn-primary mb-2" @click.prevent="Follow(User[0].id)">Follow</button>
                        
                    </div>
                    <div>
                    <ul class = "UserItem">
                        <li v-for="post in Posts">
                        
                             <img class = "postpic" :src="'/static/uploads/'+post.photo" alt = "Picture"/> 
                         
                        </li>
                      </ul>
                      </div>
                
            </div>
        
            
    </div>    
    `,
  created: function() {
    let self = this;
    if(self.$route.params.user_id =="find"){
        console.log("Fetching")
        fetch('/api/users')// use my My-Profile menu-item
         .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.$route.params.user_id = data.ID;
        console.log(self.$route.params.user_id + "HERE")
        self.ID = self.$route.params.user_id
        console.log(self.ID)
        console.log(self.ID + "present")
        fetch('/api/users/'+self.ID+'/posts')
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
         //self.$route.params.user_id =null
        console.log(data);
        self.User = data.userInfo;
        self.Posts = data.userPosts;
        self.PostNumber = data.PAmt;
        });
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
        fetch('/api/users/'+self.ID+'/posts')
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
         //self.$route.params.user_id =null
        console.log(data);
        self.User = data.userInfo;
        self.Posts = data.userPosts;
        self.PostNumber = data.PAmt;
        });
    }
        
        
        },
    data: function() {
  return {
  User: null,
  Posts: [],
  PostNumber:null,
  ID : null,
 // FollowerID:null,
  //TargetID:null
    }
  },
  methods:{
      Follow: function(UID){
          fetch('/api/users/'+UID+'/follow')
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        
        console.log(data);
        
        
        });
        
        
          
      }
  }
})


const Login =Vue.component('Login-form',{
    template:`
    <div>
        <form  enctype="multipart/form-data" id="LoginForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type = "text" class="form-control" name="username" id="username" placeholder = "Your username">
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password" id="password" placeholder = "Your Password">
            </div>
            
             <button class="btn btn-primary mb-2" @click.prevent="LoggingIn">Login</button>
        </form>
        {{state}}
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
               headers: {
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
            <router-link class="nav-link" to="/users/find">My own Profile <span class="sr-only">(current)</span></router-link>
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
        loggedin: null
    },
    methods: { 
        
    updateLoginData: function(state) {
      //console.log('updateComponentData', this.$refs)
      this.loggedin = state
      console.log(this.loggedin)
    }} ,
    router
});
