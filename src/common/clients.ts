import { LaunchOptions, Browser } from 'playwright';
import { chromium as pw } from 'playwright-extra';
import { XMLParser } from 'fast-xml-parser';
import stealth from 'puppeteer-extra-plugin-stealth';

import metaScraper from 'metascraper';
import { shopping } from './shopping';
import metaTitle from 'metascraper-title';
import metaImage from 'metascraper-image';
import metaUrl from 'metascraper-url';
import metaDescription from 'metascraper-description';

import axios from 'axios';

pw.use(stealth());

const parser = new XMLParser({
  unpairedTags: ['link', 'meta'],
  ignoreAttributes: false,
  attributeNamePrefix: '',
});

export const parseXml = (xml: string) => parser.parse(xml);

export const http = axios;

let headed: Browser | undefined;
let headless: Browser | undefined;

const launchArgs = (() => {
  const defaultOps: LaunchOptions = {};
  let ops = process.env.PLAYWRIGHT_ARGS;
  if (ops) {
    try {
      ops = JSON.parse(ops);
    } catch {
      ops = undefined;
    }
  }
  const using = ops ?? defaultOps;
  // eslint-disable-next-line no-console
  console.log('using browser launch args', JSON.stringify(using, null, 2));
  return using as LaunchOptions;
})();

const getHeadedBrowser = async () => {
  if (!headed) {
    headed = await pw.launch({ headless: false, ...launchArgs });
  }
  return headed;
};

const getHeadlessBrowser = async () => {
  if (!headless) {
    headless = await pw.launch({ headless: true, ...launchArgs });
  }
  return headless;
};

export const getPage = async (browser: Browser) => {
  const page = await browser.newPage();
  return page;
};

export const getBrowser = async (options: { type: 'headed' | 'headless' }) => {
  return options.type === 'headed' ? getHeadedBrowser() : getHeadlessBrowser();
};

export const cleanup = async () => {
  if (headed) {
    await headed.close();
  }
  if (headless) {
    await headless.close();
  }
};

export const metascraper = metaScraper([
  shopping(),
  metaTitle(),
  metaImage(),
  metaUrl(),
  metaDescription(),
]);
