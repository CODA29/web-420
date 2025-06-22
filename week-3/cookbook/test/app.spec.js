//require statements for the app.js file and supertest
const app = require("../src/app");
const request = require("supertest");


// test suite using Jest’s describe method
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

