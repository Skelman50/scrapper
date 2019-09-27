const cheerio = require("cheerio");

const hoodReplaceTrim = string =>
  string
    .text()
    .trim()
    .replace("(", "")
    .replace(")", "");

exports.listings = html => {
  const $ = cheerio.load(html);
  return $(".result-info")
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
};
