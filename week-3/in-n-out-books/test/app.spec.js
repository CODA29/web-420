//require statements for the app.js file and supertest
const app = require("../src/app");
const request = require("supertest");

// test suite using Jest’s describe method
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