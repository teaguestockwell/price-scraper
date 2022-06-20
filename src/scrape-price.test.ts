import { scrapePrice } from './scrape-price';

const urls = [
  'https://www.amazon.com/Pampers-Sensitive-Water-Based-Pop-Top-Refill/dp/B07JRBSPZ3/',
  'https://lunacycle.com/sur-ron-float-seat/',
  'https://www.ebay.com/itm/202799338884',
  'https://www.getfpv.com/multi-rotor-frames/5-quad-frames/speedybee-5-freestyle-frame.html',
  'https://www.apple.com/shop/buy-mac/macbook-air/midnight-apple-m2-chip-with-8-core-cpu-and-8-core-gpu-256gb',
];

describe('scrapePrice', () => {
  it.each(urls)('scrapes %s', async url => {
    const data = await scrapePrice({ url, backOffCoefficient: 1.2 });
    const host = new URL(url).hostname;

    console.log(data);

    expect(data.price).toBeTruthy();
    expect(data.title).toBeTruthy();
    expect(data.url).toContain(host);
  });
});
