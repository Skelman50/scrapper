const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

async function main() {
  const html = await request("https://reactnativetutorial.net/css-selectors/");
  const $ = await cheerio.load(html);
  const text = $("h1").text();
  console.log(text);
}

main();
