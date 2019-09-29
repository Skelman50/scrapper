const request = require("request-promise");
const cheerio = require("cheerio");

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

const scrapPosterUrl = async movies => {
  const promisemovies = movies.map(async movie => {
    const html = await request.get(movie.urlDescription);
    const $ = await cheerio.load(html);
    movie.posterUrl = $("div.poster > a").attr("href");
    return movie;
  });
  const moviesPostersUrl = await Promise.all(promisemovies);
  return moviesPostersUrl;
};

async function main() {
  try {
    let movies = await scrapTitleAndRatings();
    movies = await scrapPosterUrl(movies);
    console.log(movies);
  } catch (error) {
    console.log(error);
  }
}

main();
