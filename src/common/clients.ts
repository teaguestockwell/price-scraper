import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import stealth from 'puppeteer-extra-plugin-stealth';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  unpairedTags: ["link", "meta"],
  ignoreAttributes: false,
  attributeNamePrefix: ""
});

export const parseXml = (xml: string) => parser.parse(xml);

export const http = axios

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
  require('metascraper-image')(),
]);