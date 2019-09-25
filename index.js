const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const scrapingTesult = [
  {
    title: "Senior Back-End Services Engineer - Remote ",
    datePost: new Date("2019-09-25 21:12:12"),
    neighborhood: "(palo alto)",
    url:
      "https://sfbay.craigslist.org/sfc/sof/d/san-francisco-senior-back-end-services/6985787324.html",
    jobDescription:
      "Mode is a powerful, collaborative analytics platform designed by, and for, analysts. Armed with tightly integrated SQL, Python, R, and...",
    compensation: "DOE"
  }
];

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://sfbay.craigslist.org/search/sof");
  const html = await page.content();
  const $ = cheerio.load(html);
  const results = $(".result-info")
    .map((_, element) => {
      const titleElement = $(element).find(".result-title");
      const dateElement = $(element).find(".result-date");
      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      const datePost = new Date($(dateElement).attr("datetime"));
      return { title, url, datePost };
    })
    .get();
  console.log(results);
};

main();
