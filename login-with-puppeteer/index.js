const puppeteer = require("puppeteer");

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://github.com/login");
  await page.type("#login_field", "mylogin");
  await page.type("#password", "mypassword");
  await page.click(
    "#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block"
  );
  await page.goto("https://github.com/Skelman50/ecommerce/settings");
};

main();
