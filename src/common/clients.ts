import type { Browser } from 'puppeteer';
import pup from 'puppeteer-extra';
// https://github.com/berstend/puppeteer-extra/issues/93#issuecomment-563159177
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import s0 from 'puppeteer-extra-plugin-stealth/evasions/chrome.app'
import s1 from 'puppeteer-extra-plugin-stealth/evasions/chrome.csi'
import s2 from 'puppeteer-extra-plugin-stealth/evasions/chrome.loadTimes'
import s3 from 'puppeteer-extra-plugin-stealth/evasions/defaultArgs'
import s4 from 'puppeteer-extra-plugin-stealth/evasions/iframe.contentWindow'
import s5 from 'puppeteer-extra-plugin-stealth/evasions/media.codecs'
import s6 from 'puppeteer-extra-plugin-stealth/evasions/navigator.hardwareConcurrency'
import s7 from 'puppeteer-extra-plugin-stealth/evasions/navigator.languages'
import s8 from 'puppeteer-extra-plugin-stealth/evasions/navigator.permissions'
import s9 from 'puppeteer-extra-plugin-stealth/evasions/navigator.plugins'
import s10 from 'puppeteer-extra-plugin-stealth/evasions/navigator.vendor'
import s11 from 'puppeteer-extra-plugin-stealth/evasions/navigator.webdriver'
import s12 from 'puppeteer-extra-plugin-stealth/evasions/sourceurl'
import s13 from 'puppeteer-extra-plugin-stealth/evasions/user-agent-override'
import s14 from 'puppeteer-extra-plugin-stealth/evasions/webgl.vendor'
import s15 from 'puppeteer-extra-plugin-stealth/evasions/window.outerdimensions'

import metaScraper from 'metascraper';
import shopping from '@samirrayani/metascraper-shopping';
import metaTitle from 'metascraper-title';
import metaImage from 'metascraper-image';
import metaUrl from 'metascraper-url';

import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const plugins = [
  StealthPlugin(),
  s0(),
  s1(),
  s2(),
  s3(),
  s4(),
  s5(),
  s6(),
  s7(),
  s8(),
  s9(),
  s10(),
  s11(),
  s12(),
  s13(),
  s14(),
  s15(),
];

const applyPlugins = async (browser: Browser) => {
  for (const plugin of plugins) {
    await plugin.onBrowser(browser);
  }
}

const parser = new XMLParser({
  unpairedTags: ["link", "meta"],
  ignoreAttributes: false,
  attributeNamePrefix: ""
});

export const parseXml = (xml: string) => parser.parse(xml);

export const http = axios

let headed: Browser | undefined;
let headless: Browser | undefined;

const launchArgs = (() => {
  const options = process.env.PUPPETEER_LAUNCH_ARGS
  const defaultArgs = { args: ['--no-sandbox', '--disable-setuid-sandbox']}
  if (options) {
    try {
      const args =  JSON.parse(options)
      console.log(`Puppeteer launch args: ${JSON.stringify(args)}`)
      return args
    } catch {
      console.warn('failed to parse PUPPETEER_LAUNCH_ARGS')
    }
  }
  console.log(`Puppeteer launch args: ${JSON.stringify(defaultArgs)}`)
  return defaultArgs
})();

const getHeadedBrowser = async () => {
  if (!headed) {
    headed = await pup.launch({ headless: false, ...launchArgs });
    applyPlugins(headed);
  }
  return headed;
}

const getHeadlessBrowser = async () => {
  if (!headless) {
    headless = await pup.launch({ headless: true, ...launchArgs});
    applyPlugins(headless);
  }
  return headless;
}

export const getPage = async (browser: Browser) => {
  const page = await browser.newPage();
  for (const plugin of plugins) {
    await plugin.onPageCreated(page);
  }
  return page;
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

export const metascraper = metaScraper([
  shopping(),
  metaTitle(),
  metaImage(),
  metaUrl(),
])
