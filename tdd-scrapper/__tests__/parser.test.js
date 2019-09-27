const parser = require("../parser");
const fs = require("fs");
const path = require("path");

let html;
let listings;

beforeAll(() => {
  html = fs.readFileSync("./test.html", "utf-8");
  listings = parser.listings(html);
});

it("should be correct listings", () => {
  expect(listings.length).toBe(120);
});

it("should be correct title", () => {
  expect(listings[0].title).toBe("Software Engineer");
});
