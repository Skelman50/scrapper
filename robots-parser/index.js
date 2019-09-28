const robotsParser = require("robots-parser");
const request = require("request-promise");

const robotsUrl = "https://textfiles.meulie.net/robots.txt";

const getRobotsTxt = async url => {
  const robotTxt = await request.get(url);
  const robots = robotsParser(url, robotTxt);
  console.log(
    robots.isAllowed("https://textfiles.meulie.net/100/", "BLEXBot")
  );
};

getRobotsTxt(robotsUrl);
