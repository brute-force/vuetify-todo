const expect = require('chai').expect;
const puppeteer = require('puppeteer');
const axios = require('axios');

describe('user tests', function () {
  let browser, page, token;

  const user = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'someTestCode12!'
  };

  before(async function () {
    this.timeout(5000);
    browser = await puppeteer.launch({ headless: true, defaultViewport: { width: 1920, height: 1080 } });
    // browser = await puppeteer.launch();
  });

  beforeEach(async function () {
    page = await browser.newPage();
  });

  afterEach(async function () {
    await page.close();
  });

  after(async function () {
    await axios.delete(
      'http://192.168.1.62:3000/users/me',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // await page.close();
    await browser.close();
  });

  it('register', async function () {
    this.timeout(5000);
    await page.goto('http://localhost:8080/register', { waitUntil: 'networkidle0' });
    await page.waitFor('div.v-toolbar__title');

    await page.type('input[name="name"]', user.name);
    await page.type('input[name="email"]', user.email);
    await page.type('input[name="password"]', user.password);

    await page.click('button.v-btn');
    await page.waitForSelector('h1');
    const spanLogoutText = await page.$eval('h1', (el) => el.innerHTML.trim());
    expect(spanLogoutText).to.equal('Dashboard');
  });

  it('log out', async function () {
    this.timeout(5000);
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
    await page.waitFor('div.v-toolbar__title');

    await page.evaluate(() => {
      document.querySelector('i.mdi-exit-to-app').closest('button').click();
    });

    await page.waitFor('div.v-card__actions');
    const digLoginText = await page.$eval('div.v-toolbar__title', (el) => el.innerHTML);
    expect(digLoginText).to.equal('Login');
  });

  it('log in', async function () {
    this.timeout(5000);
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
    await page.waitFor('div.v-toolbar__title');

    await page.type('input[name="email"]', user.email);
    await page.type('input[name="password"]', user.password);

    await page.click('button.v-btn');
    await page.waitForSelector('h1');
    const spanLogoutText = await page.$eval('h1', (el) => el.innerHTML.trim());

    const cookies = await page.cookies();
    const cookieToken = cookies.find(({ name }) => name === 'token');
    token = cookieToken.value;

    expect(spanLogoutText).to.equal('Dashboard');
  });
});
