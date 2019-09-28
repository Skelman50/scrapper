const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let listingsResult = [];

const scrap = async page => {
  for (let i = 0; i <= 147; i += 120) {
    const html = await getHtml(
      `https://sfbay.craigslist.org/search/sof?s=${i}`,
      page
    );
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
    await sleep();
    listingsResult = [...listingsResult, ...listings];
  }
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

const getHtml = async (url, page) => {
  await page.goto(url);
  return await page.content();
};

const scrapJobDescription = async (listings, page) => {
  for (let i = 0; i < listings.length; i++) {
    const html = await getHtml(listings[i].url, page);
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
  await scrap(page);
  await scrapJobDescription(listingsResult, page);
  console.log(listingsResult[listingsResult.length - 1]);
};

main();
