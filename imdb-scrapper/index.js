const request = require("request-promise");
const reqularRequest = require("request");
const fs = require("fs");
const path = require("path");
const cheerio = require("cheerio");
const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: true, electronPath: require("electron") });

const scrapTitleAndRatings = async () => {
  const html = await request.get(
    "https://www.imdb.com/chart/moviemeter?ref_=nv_mv_mpm"
  );
  const $ = await cheerio.load(html);

  const movies = $("tr")
    .map((i, element) => {
      const title = $(element)
        .find("td.titleColumn > a")
        .text();
      const urlDescription = `https://www.imdb.com${$(element)
        .find("td.titleColumn > a")
        .attr("href")}`;
      const rating = $(element)
        .find("td.ratingColumn.imdbRating > strong")
        .text();
      return { title, rating, rank: i, urlDescription };
    })
    .get();
  return movies.filter(m => m.title);
};

const getPosterImageUrl = async movies => {
  for (let i = 0; i < movies.length; i++) {
    try {
      const posterImageUrel = await nightmare
        .goto(movies[i].posterUrl)
        .evaluate(() =>
          $(
            "#photo-container > div > div:nth-child(3) > div > div.pswp__scroll-wrap > div.pswp__container > div:nth-child(2) > div > img:nth-child(2)"
          ).attr("src")
        );
      movies[i].posterImageUrel = posterImageUrel;
      savePostersToDisk(movies[i]);
    } catch (error) {
      console.log(error);
    }
  }
  return movies;
};

const getPostUrl = async movie => {
  const html = await request.get(movie.urlDescription);
  const $ = await cheerio.load(html);
  movie.posterUrl = "https://www.imdb.com" + $("div.poster > a").attr("href");
  return movie;
};

const scrapPosterUrl = async movies => {
  const promisemovies = movies.map(async movie => getPostUrl(movie));
  const moviesPostersUrl = await Promise.all(promisemovies);
  return moviesPostersUrl;
};

async function main() {
  try {
    let movies = await scrapTitleAndRatings();
    movies = await scrapPosterUrl(movies);
    movies = await getPosterImageUrl(movies);
    console.log(movies);
  } catch (error) {
    console.log(error);
  }
}

function savePostersToDisk(movie) {
  reqularRequest
    .get(movie.posterImageUrel)
    .pipe(
      fs.createWriteStream(path.resolve(__dirname, `posters/${movie.rank}.png`))
    );
}

main();
