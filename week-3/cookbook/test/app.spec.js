/*
  Author: Dagmawi Megra
  Date: 07/05/2025
  File Name: app.spec.js
  Description: This file contains tests for the cookbook API using Jest and Supertest.
*/

//require statements for the app.js file and supertest
const app = require("../src/app");
const request = require("supertest");


// test suite for chapter 3 using Jest’s describe method
describe("Chapter 3: API Tests", () => {
  it("it should return an array of recipes", async () => {
    const res = await request(app).get("/api/recipes");
    expect(res.statusCode).toEqual(200); // Check if the status code is 200
    expect(res.body).toBeInstanceOf(Array); // Check if the response body is an array

    res.body.forEach((recipe) => {
      expect(recipe).toHaveProperty("id"); // Check if each recipe has an id property
      expect(recipe).toHaveProperty("name"); // Check if each recipe has a name property
      expect(recipe).toHaveProperty("ingredients"); // Check if each recipe has an ingredients property
    })
  });

  it("should return a single recipe", async () => {
    const res = await request(app).get("/api/recipes/1");

    expect(res.statusCode).toEqual(200); // Check if the status code is 200
    expect(res.body).toHaveProperty("id", 1); // Check if the response body has an id property of 1
    expect(res.body).toHaveProperty("name", "Pancakes"); // Check if the response body has a name property of "Pancakes"
    expect(res.body).toHaveProperty("ingredients", ["flour", "milk", "eggs"]); // Check if the response body has an ingredients property
  });

  it("should return a 400 error if the id is not a number", async() => {
    const res = await request(app).get("/api/recipes/foo");
    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Input must be a number");
  });
});

// test suite for chapter 4 using Jest’s describe method
describe("Chapter 4: API Tests", () => {
  it("should return a 201 status code when adding a new recipe", async() => {
    const res = await request(app).post("/api/recipes").send({
      id: 99,
      name: "Grilled Cheese",
      ingredients: ["bread", "cheese", "butter"]
    });

    expect(res.statusCode).toEqual(201); // Check if the status code is 201
  });

  it("should return a 400 status code when adding a new recipe with missing name", async() =>{
    const res = await request(app).post("/api/recipes").send({
      id: 100,
      ingredients: ["bread", "cheese", "butter"]
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");
  });

  it("should return a 204 status code when deleting a recipe", async() => {
    const res = await request(app).delete("/api/recipes/99");
    expect(res.statusCode).toEqual(204); // Check if the status code is 204
  });
});

// test suite for chapter 5 using Jest’s describe method
describe("Chapter 5: API Tests", () => {
  it("should return a 204 status code when updating a recipe", async() => {
    const res = await request(app).put("/api/recipes/1").send({
      name: "Pancakes",
      ingredients: ["flour", "milk", "eggs", "sugar"]
    });

    expect(res.statusCode).toEqual(204); // Check if the status code is 204
  });

  it("should return a 400 status code when updating a recipe with a non-numeric id", async() => {
    const res = await request(app).put("/api/recipes/foo").send({
      name: "Test Recipe",
      ingredients: ["test", "test"]
    });

    expect(res.statusCode).toEqual(400); // Check if the status code is 400
    expect(res.body.message).toEqual("Input must be a number");
  });

  it("should return a 400 status code when updating a recipe with missing keys or extra keys", async () => {
    const res = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe"
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Bad Request");

    const res2 = await request(app).put("/api/recipes/1").send({
      name: "Test Recipe",
      ingredients: ["test", "test"],
      extraKey: "extra"
    });
    expect(res2.statusCode).toEqual(400);
    expect(res2.body.message).toEqual("Bad Request");
  });

});