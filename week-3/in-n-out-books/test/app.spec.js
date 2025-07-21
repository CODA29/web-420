/*
  Author: Dagmawi Megra
  Date: 07/20/2025
  File Name: app.spec.js
  Description: This file contains tests for the In-N-Out Books API using Jest and Supertest.
*/

//require statements for the app.js file and supertest
const e = require("express");
const app = require("../src/app");
const request = require("supertest");

// test suite for chapter 3 using Jest’s describe method
describe("Chapter 3: API Tests", () => {
  it("it should return an array of books", async () => {
    const res = await request(app).get("/api/books");
    expect(res.statusCode).toEqual(200); // Check if the status code is 200
    expect(res.body).toBeInstanceOf(Array); // Check if the response body is an array

    res.body.forEach((book) => {
      expect(book).toHaveProperty("id"); // Check if each book has an id property
      expect(book).toHaveProperty("title"); // Check if each book has a title property
      expect(book).toHaveProperty("author"); // Check if each book has an author property
    })
  });

  it("should return a single book", async () => {
    const res = await request(app).get("/api/books/1");

    expect(res.statusCode).toEqual(200); // Check if the status code is 200
    expect(res.body).toHaveProperty("id", 1); // Check if the response body has an id property of 1
    expect(res.body).toHaveProperty("title", "The Fellowship of the Ring"); // Check if the response body has a title property of "The Fellowship of the Ring"
    expect(res.body).toHaveProperty("author", "J.R.R. Tolkien"); // Check if the response body has an author property of "J.R.R. Tolkien"
  });

  it("should return a 400 error if the id is not a number", async() => {
    const res = await request(app).get("/api/books/divergent");
    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Input must be a number");
  });
});

// test suite for chapter 4 using Jest’s describe method
describe("Chapter 4: API Tests", () => {
  it("should return a 201 status code when adding a new book", async () => {
    const res = await request(app).post("/api/books").send({
      id: 6,
      title: "The Hobbit",
      author: "J.R.R. Tolkien"
    });
    expect(res.statusCode).toEqual(201); // Check if the status code is 201
  });

  it("should return a 400 status code when adding a new book with missing title", async () => {
    const res = await request(app).post("/api/books").send({
      id: 7,
      author: "J.K. Rowling"
    });
    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Bad Request"); // Check if the error message is "Bad Request"
  });

  it("should return a 204 status code when deleting a book", async () => {
    const res = await request(app).delete("/api/books/6");
    expect(res.statusCode).toEqual(204); // Check if the status code is 204
  })
});

// test suite for chapter 5 using Jest’s describe method
describe("Chapter 5: API Tests", () => {
  it("should update a book and return a 204-status code", async () => {
    const res = await request(app).put("/api/books/1").send({
      title: "The Fellowship of the Ring - Updated",
      author: "J.R.R. Tolkien - Updated",
    });

    expect(res.statusCode).toEqual(204); // Check if the status code is 204
  });

  it("should return a 400 status code when using a non-numeric id", async () => {
    const res = await request(app).put("/api/books/foo").send({
      title: "Test Book",
      author: "Test Author"
    });
    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Input must be a number");

  });

  it("should return a 400-status code when updating a book with a missing title", async () => {
    const res = await request(app).put("/api/books/1").send({
      author: "J.R.R. Tolkien"
    });

    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Bad Request");
  });

});

// test suite for chapter 6 using Jest’s describe method
describe("Chapter 6: API Tests", () => {
  it("should log a user in and return a 200-status code with 'Authentication successful'", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "hermione@hogwarts.edu",
      password: "granger"
    });
    expect(res.statusCode).toEqual(200); // Check if the status code is 200
    expect(res.body.message).toEqual("Authentication successful");
  });

  it("should return a 401 status code with 'Unauthorized' message when logging in with incorrect credentials", async() => {
    const res = await request(app).post("/api/users/login").send({
      email: "hermione@hogwarts.edu",
      password: "wrongpassword"
    });

    expect(res.statusCode).toEqual(401); // Check if the status code is 401
    expect(res.body.message).toEqual("Unauthorized"); // Check if the error message is "Unauthorized"
  });

  it("should return a 400 status code with 'Bad Request' message when missing email or password", async() => {
    const res = await request(app).post("/api/users/login").send({
      email: "hermione@hogwarts.edu",
    });

    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Bad Request"); // Check if the error message is "Bad Request"
  });
});

// test suite for chapter 7 using Jest’s describe method
describe("Chapter 7: API Tests", () => {
  it("should return a 200 status code with 'Security questions successfully answered'", async() => {
    const res = await request(app).post('/api/users/hermione@hogwarts.edu/verify-security-question').send({
      securityQuestions: [
        {answer: "Crookshanks"},
        {answer: "Hogwarts: A History" },
        {answer: "Wilkins"}
      ]
    });

    expect(res.statusCode).toEqual(200); // Check if the status code is 200
    expect(res.body.message).toEqual("Security questions successfully answered");
  });

  it("should return a 400 status code with ‘Bad Request’ message when the request body fails ajv validation", async() => {
    const res = await request(app).post('/api/users/hermione@hogwarts.edu/verify-security-question').send({
      securityQuestions: [
        {answer: "Crookshanks", question: "What is your pet's name?"},
        {answer: "Hogwarts: A History", myName: "Jason Bourne"}
      ]
    });

    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Bad Request"); // Check if the error message is "Bad Request"
  });

  it("should return a 401 status code with 'Unauthorized' message when the security questions are incorrect", async() => {
    const res = await request(app).post('/api/users/hermione@hogwarts.edu/verify-security-question').send({
      securityQuestions: [
        {answer: "Wrong Answer"},
        {answer: "Hogwarts: A History" },
        {answer: "Wilkins"}
      ]
    });

    expect(res.statusCode).toEqual(401); // Check if the status code is 401
    expect(res.body.message).toEqual("Unauthorized"); // Check if the error message is "Unauthorized"
  });
});