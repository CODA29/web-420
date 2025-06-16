/*
  Author: Dagmawi Megra
  Date: 06/11/2025
  File Name: app.js
  Description: This is the main entry point for the in-n-out-books application.
*/

//set up an Express application
const express = require('express');
const app = express();
const createError = require('http-errors');

// Add a GET route for the root URL
app.get("/", async (req, res, next) => {
  // HTML content for the landing page
  const html = `
    <html>
      <head>
        <title>In-N-Out Books</title>
        <style>
          body {font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; color: #333;}
          .container {max-width: 900px; margin: 0 auto; padding: 20px;}
          h1 { text-align: center; color:rgb(255, 255, 255); }
          header {background-color: #b0530b; color: white; padding: 5em; border-radius: 8px; text-align: center;}
          header h1 {margin: 0; font-size: 2.5em;}
          header p { margin-top: 3em;}
          main {margin-top: 30px;}
          h2 {color: #b0530b; border-bottom: 2px solid #b0530b; padding-bottom: 5px; margin-top: 40px;}
          .books {display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 20px;}
          .book {background-color: #ffffff; border: 1px solid #ddd; padding: 15px; border-radius: 8px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);}
          .book h2 {font-size: 1.2em; margin-bottom: 10px; color: #555;}
          .book p {margin: 5px 0;}
          .hours, .contact {background-color:rgb(84, 83, 82); border: 1px solid #ffe082; padding: 15px; border-radius: 8px; margin-top: 30px; }
          .hours h2, .contact h2 {color : #e6853b; border-bottom: 2px solid #e6853b;)}
          .hours p, .contact p {color: #ffffff;}
          .contact a {color: #e6853b; text-decoration: none;}
          footer {text-align: center; margin-top: 40px; padding: 20px; font-size: 0.9em; color: #666; border-top: 1px solid #ccc;}
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <h1>In-N-Out Books</h1>
            <p>Welcome to In-N-Out Books — your neighborhood haven for book lovers of all kinds. Whether you're searching for the latest bestsellers, timeless classics, or hidden literary gems, our shelves are stocked with something for every reader. At In-N-Out Books, we believe in the magic of stories and the power of imagination. From gripping thrillers and heartwarming romances to thought-provoking nonfiction, our carefully curated collection is designed to inspire, educate, and entertain. Whether you're stopping by for a quick pick-up or planning to get lost among the pages for hours, we’re here to make your reading journey memorable. Come in, explore, and discover your next great read!</p>
          </header>
          <br/>
          <main>
            <h2>Top selling Books</h2>
            <div class= "books">
              <div class="book">
                <h2>Book Title: The Great Gatsby</h2>
                <p>Author: F. Scott Fitzgerald</p>
                p>Description: A novel set in the Roaring Twenties, exploring themes of decadence and excess.</p>
              </div>
              <div class="book">
                <h2>Book Title: To Kill a Mockingbird</h2>
                <p>Author: Harper Lee</p>
                <p>Description: A novel about the serious issues
              </div>
              <div class="book">
                <h2>Book Title: 1984</h2>
                <p>Author: George Orwell</p>
                <p>Description: A dystopian novel that delves into the dangers of totalitarianism and extreme political ideology.</p>
              </div>
              <div class="book">
                <h2>Book Title: Pride and Prejudice</h2>
                <p>Author: Jane Austen</p>
                <p>Description: A romantic novel that critiques the British landed gentry at the end of the 18th century.</p>
              </div>
            </div>
            <div class="hours">
              <h2>Store Hours</h2>
              <p>Monday - Friday: 9 AM - 8 PM</p>
              <p>Saturday: 10 AM - 6 PM</p>
              <p>Sunday: Closed</p>
            </div>
            <div class="contact">
              <h2>Contact Us</h2>
              <p>Phone: (123) 456-7890</p>
              <p>Email: <a href="#"> in-n-out-books@gmail.com </a> </p>
              <p>Address: 123 Book St, Booktown, BK 12345</p>

          </main>
          <footer>
            <p>&copy; 2025 In-N-Out Books. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>`;

  res.send(html);
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
