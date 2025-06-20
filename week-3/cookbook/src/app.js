/*
  Author: Dagmawi Megra
  Date: 06/15/2025
  File Name: app.js
  Description: This is the main entry point for the cookbook application.
*/

const express = require('express');
const bcrypt = require('bcryptjs');
const createError = require('http-errors');

const app = express(); // Creates an express application

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