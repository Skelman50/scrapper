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

const hoodReplaceTrim = string =>
  string
    .text()
    .trim()
    .replace("(", "")
    .replace(")", "");

const sleep = milliseconds => {
  return new Promise(res => setTimeout(res, milliseconds));
};

const scraperListings = async page => {
  await page.goto("https://sfbay.craigslist.org/search/sof");
  const html = await page.content();
  const $ = cheerio.load(html);
  const listings = $(".result-info")
    .map((_, element) => {
      const titleElement = $(element).find(".result-title");
      const dateElement = $(element).find(".result-date");
      const hood = $(element).find(".result-hood");
      const neighborhood = hoodReplaceTrim($(hood));
      const title = $(titleElement).text();
      const url = $(titleElement).attr("href");
      const datePost = new Date($(dateElement).attr("datetime"));
      return { title, url, datePost, neighborhood };
    })
    .get();
  return listings;
};

const scrapJobDescription = async (listings, page) => {
  console.log(listings);
  for (let i = 0; i < listings.length; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    const $ = cheerio.load(html);
    const postDescription = $("#postingbody").text();
    listings[i].jobDescription = postDescription;
    console.log(listings[i].jobDescription);
    await sleep(1000);
  }
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const listings = await scraperListings(page);
  const listingsWithJobDescription = await scrapJobDescription(listings, page);
};

main();
