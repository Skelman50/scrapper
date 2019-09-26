const cheerio = require("cheerio");
const request = require("request-promise");

const url = "https://sfbay.craigslist.org/search/sof";
const resultScrap = [];

const scrapper = async () => {
  try {
    const result = await request.get(url);
    const $ = await cheerio.load(result);
    $(".result-info").each((_, element) => {
      const resultTitle = $(element).children(".result-title");
      const title = resultTitle.text();
      const url = resultTitle.attr("href");
      const scrapperResult = { title, url };
      resultScrap.push(scrapperResult);
    });
  } catch (error) {
    console.log(error);
  }
};

scrapper();
