const puppeteer = require("puppeteer");
const { baseUrl } = require("./urls");
const { getHomes, sleep, getHtml } = require("./helpers");
const { pricePerNightSelector } = require("./selectors");

async function scrapHomeInIndexPage(url, browser) {
  const page = await browser.newPage();
  await sleep(page, url, 5000);
  const $ = await getHtml(page);
  return getHomes($);
}

const ololo = async (array, url, descriptionPage) => {
  for (let i = 0; i < array.length; i++) {
    if (!array[i]) {
      await sleep(descriptionPage, url[i], 15000);
      const $ = await getHtml(descriptionPage);
      const pricePerNight = $(pricePerNightSelector).text();
      array[i] = pricePerNight;
      console.log(pricePerNight);
      if (i === array.length - 1) {
        i = 0;
      }
    }
  }
  return array;
};

async function scrapDescriptionPage(url, browser) {
  const descriptionPage = await browser.newPage();
  let array = new Array(url.length);
  const result = await ololo(array, url, descriptionPage);
  console.log(result);
}

async function main() {
  try {
    let browser = await puppeteer.launch({ headless: false });
    const homes = await scrapHomeInIndexPage(baseUrl, browser);
    await scrapDescriptionPage(homes, browser);
  } catch (error) {
    console.log(error);
  }
}

main();
