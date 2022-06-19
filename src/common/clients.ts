import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';

const pup = puppeteer.use(stealth());

let headed: Browser | undefined;
let headless: Browser | undefined;

const getHeadedBrowser = async () => {
  if (!headed) {
    headed = await pup.launch({ headless: false });
  }
  return headed;
}

const getHeadlessBrowser = async () => {
  if (!headless) {
    headless = await pup.launch({ headless: true });
  }
  return headless;
}

export const getBrowser = async (options: {type: 'headed' | 'headless'}) => {
  return options.type === 'headed' ? getHeadedBrowser() : getHeadlessBrowser();
}

export const cleanup = async () => {
  if (headed) {
    await headed.close();
  }
  if (headless) {
    await headless.close();
  }
}

export const metascraper = require('metascraper')([
  require('@samirrayani/metascraper-shopping')(),
  require('metascraper-title')(),
  require('metascraper-image')(),
  require('metascraper-url')(),
]);