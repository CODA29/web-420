/*
  Author: Dagmawi Megra
  Date: 07/20/2025
  File Name: app.js
  Description: This is the main entry point for the cookbook application.
*/

const express = require('express');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

// Importing the recipes module
const recipes = require('../database/recipes');

// Importing the users module
const users = require('../database/users');

// Importing the ajv npm package
const Ajv = require("ajv");

// Create an instance of Ajv
const ajv = new Ajv();

const app = express(); // Creates an express application

// Schema for validating security questions
const securityQuestionsSchema = {
  "type": "object",
  "properties": {
    "securityQuestions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "answer": { "type": "string" }
        },
        "required": ["answer"],
        "additionalProperties": false
      }
    },
    "newPassword": { "type": "string" }
  },
  "required": ["securityQuestions", "newPassword"],
  "additionalProperties": false
};



app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies


app.get("/", async(req,res,next) => {
  // HTML content for the landing page
  const html =`
    <html>
      <head>
        <title>Cookbook App</title>
        <style>
          body, h1, h2, h3 { margin: 0; padding: 0; border: 0;}
          body {
          background: #424242;
          color: #fff;
          margin: 1.25rem;
          font-size: 1.25rem;
          }
          h1, h2, h3 { color: #EF5350; font-family: 'Emblema One', cursive;}
          h1, h2 { text-align: center }
          h3 { color: #fff; }
          .container { width: 50%; margin: 0 auto; font-family: 'Lora', serif; }
          .recipe { border: 1px solid #EF5350; padding: 1rem; margin: 1rem 0; }
          .recipe h3 { margin-top: 0; }
          main a { color: #fff; text-decoration: none; }
          main a:hover { color: #EF5350; text-decoration: underline;}
        </style>
      </head>
      <body>
      <div class="container">
        <header>
          <h1>Cookbook App</h1>
          33
          <h2>Discover and Share Amazing Recipes</h2>
        </header>
        <br />
        <main>
          <div class="recipe">
            <h3>Classic Beef Tacos</h3>
            <p>1. Brown the ground beef in a skillet.<br>2. Warm the taco shells in the
            oven.<br>3. Fill the taco shells with beef, lettuce, and cheese.</p>
          </div>
          <div class="recipe">
            <h3>Vegetarian Lasagna</h3>
            <p>1. Layer lasagna noodles, marinara sauce, and cheese in a baking
            dish.<br>2. Bake at 375 degrees for 45 minutes.<br>3. Let cool before
            serving.</p>
          </div>
        </main>
      </div>
      </body>
    </html> `; // end HTML content for the landing page
  res.send(html); // Send the HTML content to the client
});

// Route to register a new user
app.post("/api/register", async(req,res,next) => {
  console.log("Request body: ", req.body);
  try{
    const user = req.body;

    const expectedKeys = ["email", "password"];
    const receivedKeys = Object.keys(user);

    // Check if the request body contains the expected keys
    if(!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length){
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request")); // If keys are missing or extra
    }

    let duplicateUser;
    // Check if the user already exists
    try{
      duplicateUser = await users.findOne({email: user.email});
    }catch(err){
      duplicateUser = null; // If an error occurs, set duplicateUser to null
    }

    if(duplicateUser){
      console.error("Conflict: User already exists");
      return next(createError(409, "Conflict")); // If user exists, return 409
    }

    const hashedPassword = bcrypt.hashSync(user.password, 10);


    const newUser = await users.insertOne({
      email: user.email,
      password: hashedPassword
    });

    res.status(200).send({ user: newUser, message: "Registration successful" });

  }catch(err){
    console.error("Error: ", err);
    console.error("Error: ", err.message);
    next(err); // Passes error to the next middleware
  }
});

// Route to reset a user's password
app.post("/api/users/:email/reset-password", async(req, res, next) => {
  try{
    const { email } = req.params;
    const{ newPassword, securityQuestions} = req.body;


    const validate = ajv.compile(securityQuestionsSchema);
    const valid = validate(req.body);


    if(!valid){
      console.error("Bad Request: Invalid request body", validate.errors);
      return next(createError(400, "Bad Request"));
    }

    const user = await users.findOne({email: email});

    if(securityQuestions[0].answer !== user.securityQuestions[0].answer ||
       securityQuestions[1].answer !== user.securityQuestions[1].answer ||
       securityQuestions[2].answer !== user.securityQuestions[2].answer){
      console.error("Unauthorized: Security questions do not match");
      return next(createError(401, "Unauthorized"));
    }


    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedPassword;

    const result = await users.updateOne({email: email}, {user});

    console.log("Result: ", result);
    res.status(200).send({message: "Password reset successful", user: user});

  }catch(err){

    console.error("Error: ", err.message);
    next(err); // Passes error to the next middleware

  }
});



// Route to add a new recipe
app.post("/api/recipes", async(req, res, next)=>{
  try{
    const newRecipe = req.body;

    const expectedKeys = ["id", "name", "ingredients"];
    const receivedKeys = Object.keys(newRecipe);

    if(!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length){
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await recipes.insertOne(newRecipe);
    console.log("Result: ", result);
    res.status(201).send({id: result.ops[0].id});

  }catch(err){
    console.error("Error: ", err.message);
    next(err);
  }
});


// Route to update a recipe by id
app.put("/api/recipes/:id", async(req, res, next) => {
  try{
    let {id} = req.params;
    let recipe = req.body;
    id = parseInt(id);


    if(isNaN(id)){
      return next(createError(400, "Input must be a number"));
    }


    const expectedKeys = ["name", "ingredients"];
    const receivedKeys = Object.keys(recipe);

    if(!receivedKeys.every(key => expectedKeys.includes(key)) || receivedKeys.length !== expectedKeys.length){
      console.error("Bad Request: Missing keys or extra keys", receivedKeys);
      return next(createError(400, "Bad Request"));
    }

    const result = await recipes.updateOne({ id: id }, recipe);
    console.log("Result: ", result);
    res.status(204).send(); // Sends a 204 if update is successful

  }catch(err){
    if(err.message === "No matching item found"){
      console.log("Recipe not found", err.message);
      return next(createError(404, "Recipe not found"));
    }

    console.error("Error: ", err.message);
    next(err);
  }
});

// Route to delete a recipe by id
app.delete("/api/recipes/:id", async(req, res, next) => {
  try{
    const { id } = req.params;
    const result = await recipes.deleteOne({id: parseInt(id)});
    console.log("Result: ", result);
    res.status(204).send(); // Sends a 204 if deletion is successful
  }catch(err){
    if(err.message === "No matching item found"){
      return next(createError(404, "Recipe not found"));
    }

    console.error("Error: ", err.message);
    next(err);
  }
});



// Route to get all recipes
app.get("/api/recipes", async(req, res, next) => {
  try{
    const allRecipes = await recipes.find();
    console.log("All Recipes: ", allRecipes);
    res.send(allRecipes); // Sends response with all recipes
  }catch(err){
    console.error("Error: ", err.message);// Logs error message
    next(err); // Passes error to the next middleware
  }
});

//Error handler to check if the id is not a number and throwing a 400 error if it is not with an error message
app.get("/api/recipes/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    id = parseInt(id);

    // Check if the id is not a number
    if (isNaN(id)) {
      return next(createError(400, "Input must be a number"));
    }

    // Find a single book with the matching id
    const recipe = await recipes.findOne({ id: id });
    console.log("Book: ", recipe);

    if (!recipe) {
      return next(createError(404, "Book not found"));
    }

    // Return the found book
    res.send(recipe);
  } catch (err) {
    console.error("Error:", err.message);
    next(err);
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
  type: 'error',
  status: err.status,
  message: err.message,
  stack: req.app.get('env') === 'development' ? err.stack : undefined
  });
});

// Export the app module for use in other files
module.exports = app;