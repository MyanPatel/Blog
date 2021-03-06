//jshint esversion:6

// The modules needed for this project are being imported
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

// Some sample content to put on the Home, About and Contact pages
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Initialising an express object to access the methods such as GET and POST
const app = express();

// Telling the app to use the EJS module
app.set('view engine', 'ejs');

// Telling the app to use bodyParser so HTML elements can be accessed from here via the 'name' attribute
app.use(bodyParser.urlencoded({extended: true}));

// Making a folder called "public" to ensure files such as css and image files can be accessed
app.use(express.static("public"));

// Global variable to store each blog post
// var posts = [];

// Creating a connection to the mongoDB server - Locally hosted
mongoose.connect("mongodb://localhost:27017/BlogDB", {useNewUrlParser:true});

// Creating a schema to store posts
const postsSchema = new mongoose.Schema ({
  title: String,
  post: String
});

// Creating a new model from the above schema
const Post = new mongoose.model("Post", postsSchema);


// Home Page - GET
app.get('/', function(req, res){
  // res.render('name of .ejs page', {variable on .ejs page, variable in app.js});

  Post.find({}, function(err, posts){

    res.render("home", {
      homeInfo: homeStartingContent,
      posts: posts
 
    });
  })
});

// About page - GET
app.get('/about', function(req, res){
  res.render('about', {aboutInfo:aboutContent});
});

// Contact Page - GET
app.get('/contact', function(req, res){
  res.render('contact', {contactInfo:contactContent});
});

// Compose Page - GET
app.get('/compose', function(req, res){
  res.render('compose');
});

// Compose Page - POST
app.post("/compose", function(req, res){
  
  // Accessing the blog title and content HTML elements using bodyParser and storing them in variables
  let postContent = req.body.postContent;
  let titleContent  = req.body.titleContent;

  // A JavaScript object to store both the each blog posts title and content
  const post = new Post ({
    title: titleContent,
    post: postContent
  });

  post.save(function(err){
    if (!err){
      console.log("Post saved successfully!");
      res.redirect('/');
    }else{
      console.log(err);
    }
  });

  // Once published, the blog post is addded to the 'posts' global variable
  // posts.push(blogPost);
  // The user is redirected to the root route or Home screen
});

// Posts/'parameter' - Route Paramters = Feature of Express
app.get("/posts/:postId", function(req, res){
  // postTitle - in above URL is the parameter - specificied by the colon
  // req.params.parameterName = To access a specific parameter

  // Storing the requested title by the user and applying the lowerCase() method using lodadsh
  // let requestedTitle = _.lowerCase(req.params.postTitle);

  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){

    if (!err){
      res.render("post", {
        postTitle: post.title,
        postContents: post.post
      });
    }else{
      console.log(err);
    }
  });

  // a for each loop to iterate through each element in the posts array
  // posts.forEach(function(post){
  //   // Storing the title of each post and applying the lowerCase() method using lodadsh
  //   let storedTitle = _.lowerCase(post.title);
  //   // Performing a check to see if the requested title matches a title stored in the posts array
  //   if (storedTitle === requestedTitle){
  //     console.log("Match Found!");
  //     // True branch: Render the posts.ejs file and pass the post title and post content to the ejs page
  //     // This allows each blog post to be viewed on its own page
  //     res.render('post', {postTitle: post.title, postContents: post.content});
  //   }
  // })
});

// Function to run a local server on a specific port
app.listen(3000, function() {
  console.log("Server started on port 3000");
});

