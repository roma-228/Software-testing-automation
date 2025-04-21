const { Given, When, Then, After } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
 const assert = require('assert');
 const fs = require('fs');
 const os = require('os');
 const path = require('path');

let driver;
let userDataDir;

 async function createDriver() {
   userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-user-data-'));
   const options = new chrome.Options();
   options.addArguments(
     `--user-data-dir=${userDataDir}`,
     '--headless',
     '--no-sandbox',
     '--disable-dev-shm-usage'
   );
   return await new Builder().forBrowser('chrome').setChromeOptions(options).build();
 }

let email = `user${Date.now()}@test.com`;
let password = `Pass${Math.floor(Math.random() * 10000)}!`;

Given('я відкриваю сторінку реєстрації {string}', async function (url) {
  driver = await createDriver();
  await driver.get(url);
});

When('я вводжу унікальне ім\'я користувача, email та пароль', async function () {
  await driver.findElement(By.name('username')).sendKeys('user' + Date.now());
  await driver.findElement(By.name('email')).sendKeys(email);
  await driver.findElement(By.name('password')).sendKeys(password);
});

When('натискаю кнопку {string}', async function (btnText) {
  const button = await driver.findElement(By.xpath(`//button[text()="${btnText}"]`));
  await button.click();
});

Then('я повинен побачити повідомлення про успішну реєстрацію', async function () {
  await driver.wait(until.urlContains('login.html'), 5000);
  const currentUrl = await driver.getCurrentUrl();
  assert(currentUrl.includes('login.html'));
});

When('я відкриваю сторінку логіну {string}', async function (url) {
  await driver.get(url);
});

When('я вводжу той самий email та пароль', async function () {
  await driver.findElement(By.name('email')).sendKeys(email);
  await driver.findElement(By.name('password')).sendKeys(password);

});

Then('я повинен бути перенаправлений на головну сторінку або побачити повідомлення про успішний вхід', async function () {
    await driver.wait(until.urlContains('profile.html'), 5000);
    const currentUrl = await driver.getCurrentUrl();
    assert(currentUrl.includes('profile.html'));
});


After(async () => {
    if (driver) {
      await driver.quit();
      driver = null;
    }
    if (userDataDir) {
      fs.rmSync(userDataDir, { recursive: true, force: true });
      userDataDir = null;
    }
  });