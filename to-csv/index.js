const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const ObjectsToCsv = require("objects-to-csv");

const createCsvFile = async data => {
  const csv = new ObjectsToCsv(data);
  await csv.toDisk("./test.csv");
};

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
  for (let i = 0; i < listings.length; i++) {
    await page.goto(listings[i].url);
    const html = await page.content();
    const $ = cheerio.load(html);
    const postDescription = $("#postingbody").text();
    const compensation = $("p.attrgroup > span:nth-child(1) > b").text();
    listings[i].jobDescription = postDescription;
    listings[i].compensation = compensation;
    await sleep(1000);
  }
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const listings = await scraperListings(page);
  await scrapJobDescription(listings, page);
  await createCsvFile(listings);
};

main();
