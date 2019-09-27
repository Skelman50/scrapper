const puppeteer = require("puppeteer");
const fs = require("fs");

const getHTML = async url => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);
  return await page.content();
};

const saveHTML = html => {
  fs.writeFileSync("./test.html", html);
};

async function main() {
  const html = await getHTML(
    "https://sfbay.craigslist.org/search/sof"
  );
  saveHTML(html);
}

main();
