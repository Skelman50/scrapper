const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");

async function main() {
  const html = await request(
    "https://reactnativetutorial.net/css-selectors/lesson5.html"
  );
  const $ = await cheerio.load(html);
  $(".red").each((i, element) => {
    console.log($(element).text().trim());
  });
}

main();
