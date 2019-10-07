const { itemPropUrl } = require("./selectors");
const { startURL } = require("./urls");
const cheerio = require("cheerio");

exports.sleep = (page, url, time) => {
  return new Promise(res => {
    page.goto(url, { timeout: 0, waitUntil: "networkidle0" });
    setTimeout(res, time);
  });
};

exports.getHomes = $ => {
  return $(itemPropUrl)
    .map((_, element) => {
      const url = $(element).attr("content");
      const updateURL = url.split("/");
      updateURL[0] = startURL;
      return updateURL.join("/");
    })
    .get();
};

exports.getHtml = async page => {
  const html = await page.evaluate(() => document.body.innerHTML);
  return await cheerio.load(html);
};
