/* Add your Application JavaScript */
//<router-link :to="{Login: '/login'}">
//<router-link to="/explore" tag="button">No</router-link>
//router.push({ name: 'user', params: { userId } }) // -> /user/123
//<router-link to="/foo" tag="button">foo</router-link>  try to use this for routing

const Explore = Vue.component('Explore-page',{
    template:`
    <div class = "UsersPosts>
        <li v-for="post in Posts" class="post__item">
        <div class = "post">
            <span v-for="user in Users">
                <span v-if="user.id == post.user_id">
                    <img class = "profexplorepic" :src="user.profile_photo" alt = "Picture"/><p @click="GoToUser(user.username)">{{user.username}}</p>
                </span>
              
            </span>
          <img class = "postpic" :src="post.photo" alt = "Picture"/> 
          
          <br>
          {{post.caption}}
          
        </div>
        </li>
    
    </div>
    
    `
,
  created: function() {
    let self = this;
    fetch('/api/posts')
     .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.Users = data.AllUsers;
        self.Posts = data.AllPost;
        });
    
        fetch('/api/users/self.ID/posts')
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.Users = data.userInfo;
        });
        
        },
    data: function() {
  return {
  Users: [],
  Posts : [],
  ViewID: null
    }
  },
   methods:
      {
          GoToUser: function(uname){
            for(user in Users){
                if(user.username == uname){
                    self.ViewID = user.id
                    router.push({ name: 'user', params: { id:ViewId } })
                }
            }
    
            
          },
          
          
      }
})

const Home = Vue.component('Home-page',{
    template:`
    
    <div id = "container">
    <button class="btn btn-primary mb-2"
    @click="GoToRegister">Register</button>
      <button class="btn btn-primary mb-2"
      @click="GoToLogin">Login</button>

          </div>
      `,
      methods:
      {
          GoToLogin: function(){
            router.push({path:'login'})
          },
          GoToRegister: function(){
            router.push({path:'register'})
          }
          
      }
})

const Logout = Vue.component('LogOff',{
    template:`
    <p> Are you sure you want to logout?</p>
    
       <button id = logoff class="btn btn-primary mb-2"
      @click="loggingOut">YES</button>
      <button class="btn btn-primary mb-2"
      @click="logOutCancel">NO</button>
    
    
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
                })
                .catch(function (error) {
                console.log(error);
                });
            router.push({ path: '/'})
            //this.$router.push({name: 'products.index', params: { id: 1 }})
        },
        logOutCancel: function(){
            route.push({ path: '/explore'})
        }
    },
})
const Register =Vue.component('Register-form',{
    template:`
    <div>
        <form @submit.prevent="uploadPhoto" enctype="multipart/form-data" id="RegisterForm">
            <div class="form-group">
                <label for="username">Username</label>
                <input type = "text" class="form-control" name="username" id="username" placeholder = "Your username">
            </div>
            <div class="form-group">
                <label for="firstname">First Name</label>
                <input type = "text" class="form-control" name="fname" id="fname" placeholder = "Your first name">
            </div>
             <div class="form-group">
                <label for="lastname">Last Name</label>
                <input type = "text" class="form-control" name="lname" id="lname" placeholder = "Your last name">
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
                <input type = "text" class="form-control" name="locatione" id="location" placeholder = "Location">
            </div>
            <div class="form-group">
            
                <label for="biography">Biography</label>
                <textarea class="form-control" name="biography" id="biography"></textarea>
            </div>
            <div class="form-group">
                <label for="photo">Photo</label>
                <input name="photo" id="photo" type="file">
            </div>
            
            
             <button class="btn btn-primary mb-2" @click="Register">Register</button>
        </form>
    </div>
    `,
    methods: {
        Register: function(){
            self = this;
            let RegisterForm = document.getElementById('RegisterForm');
            let form_data = new FormData(RegisterForm); 
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
                console.log(jsonResponse)       
                if(jsonResponse == 'true'){
                    route.push({ path: '/explore'})
                }
                })
                .catch(function (error) {
                console.log(error);
                });
        }
    },
 
});

const Posts =Vue.component('Post-form',{
    template:`
    <div>
        <form  enctype="multipart/form-data" id="PostForm">
            
            
            <div class="form-group">
                <label for="photo">Photo</label>
                <input name="photo" id="photo" type="file">
            </div>
            
            <div class="form-group">
            
                <label for="caption">Caption</label>
                <textarea class="form-control" name="caption" id="caption"></textarea>
            </div>
             <button class="btn btn-primary mb-2" @click="NewPost">Login</button>
        </form>
    </div>
    `,
    methods: {
        NewPost: function(){
            self = this;
            let PostForm = document.getElementById('PostForm');
            let form_data = new FormData(PostForm); 
              fetch("/api/users/{Auth::id()}/posts", {
                  
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

const UserProfile = Vue.component('UserProfile',{// get user_id  and details from view file
    props: ['user_id'],
    template : `
    <div class = "UsersPosts>
        <span v-for="user in Users" class="user__item">
            <div class = "user">
                <span v-if="{{user_id}} == user.id">
                    <div class = "UInfo">
                    <img class = "profpic" :src="user.profile_photo" alt = "Picture"/><p>{{user.username}}</p>
                    </div>
                    <ul class = "UserItem">
                        <li v-for="post in Posts">
                        <span v-if="{{user.id}} == post.user_id">
                             <img class = "postpic" :src="post.photo" alt = "Picture"/> 
                         </span>
                        </li>
                      </ul>
                </span>
            </div>
        </span>
            
    </div>    
    `,
  created: function(user_id) {
    let self = this;
    fetch('/api/posts')// use my My-Profile menu-item
     .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        self.Posts= data.AllPost;
        self.Users=data.AllUsers;
        });
    
        fetch('/api/users/self.ID/posts')
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        console.log(data);
        //self.Users = data.userInfo;
        });
        
        },
    data: function() {
  return {
  Users: [],
  Posts: [],
  ID : null
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
            
             <button class="btn btn-primary mb-2" @click="LoggingIn">Login</button>
        </form>
    </div>
    `,
    methods: {//If login is successful then transport to explore page
    // try to denote true or false value in view file and then send to js file with json
        Loggingin: function(){
            self = this;
            let LoginForm = document.getElementById('LoginForm');
            let form_data = new FormData(LoginForm); 
              fetch("/api/users/login", {
                
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
                if(jsonResponse == 'true'){
                    route.push({ path: '/explore'})
                }
                })
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
            <router-link class="nav-link" to="/login">Login <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/explore">Explore <span class="sr-only">(current)</span></router-link>
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
        {path: "/", component: Home},
        // Put other routes here
        {path: "/register", component: Register},
        {path: "/logout", component: Logout},
        {path: "/login", component: Login},
        {path: "/users/:user_id",  component: UserProfile,  props: true},
        {path: "/explore", component: Explore},
        {path: "/posts/new", component: Posts},
        // This is a catch all route in case none of the above matches
        {path: "*", component: NotFound}
    ]
});

// Instantiate our main Vue Instance
let app = new Vue({
    el: "#app",
    router
});
