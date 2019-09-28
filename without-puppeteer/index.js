const cheerio = require("cheerio");
const tunnel = require("tunnel");
const request = require("requestretry").defaults({
  fullResponse: false,
  proxy: "https://188.156.239.8:8118"
});

const url = "https://sfbay.craigslist.org/search/sof";
const resultScrap = [];

const scrapperJobHeader = async () => {
  try {
    const result = await request.get(url);
    console.log(result);
    const $ = await cheerio.load(result);
    $(".result-info").each((_, element) => {
      const resultTitle = $(element).children(".result-title");
      const jobPosted = new Date(
        $(element)
          .children("time")
          .attr("datetime")
      );

      const hood = $(element)
        .find(".result-hood")
        .text()
        .trim()
        .replace("(", "")
        .replace(")", "");
      const title = resultTitle.text();
      const url = resultTitle.attr("href");
      const scrapperResult = { title, url, jobPosted, hood };
      resultScrap.push(scrapperResult);
    });
    return resultScrap;
  } catch (error) {
    console.log(error);
  }
};

const scrapDescription = async jobHeaders => {
  const promisesJobHeaders = jobHeaders.map(async j => {
    const result = await request.get(j.url);
    const $ = await cheerio.load(result);
    $(".print-qrcode-container").remove();
    j.description = $("#postingbody").text();
    j.compensation = $(
      ".mapAndAttrs > .attrgroup > span:nth-child(1) > b"
    ).text();
    return j;
  });
  return await Promise.all(promisesJobHeaders);
};

const scrapBody = async () => {
  const jobHeaders = await scrapperJobHeader();
  console.log(jobHeaders);
  // const jobsFull = await scrapDescription(jobHeaders);
  // console.log(jobsFull);
};

scrapBody();
