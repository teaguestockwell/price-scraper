import { scrapePrice } from './scrape-price';

const urls = [
  'https://www.amazon.com/Pampers-Sensitive-Water-Based-Pop-Top-Refill/dp/B07JRBSPZ3/',
  'https://lunacycle.com/sur-ron-float-seat/',
  'https://www.ebay.com/itm/234695483731?epid=7054508373',
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
  it('scrapes products that cost less than a dollar', async () => {
    // given a store has a product with a cost > 1 can be scraped
    const baseCase = await scrapePrice({url: 'https://www.homedepot.com/p/1-2-in-13-x-2-in-Zinc-Plated-Grade-8-Cap-Screw-810088/204274282', backOffCoefficient: 1.3 })
    expect(baseCase.price).toBeTruthy()

    // when another product from the same store is scrapes, and its price is less than 1
    const testCase = await scrapePrice({url: 'https://www.homedepot.com/p/Everbilt-1-2-in-Yellow-Zinc-Grade-8-Split-Washer-807138/204276412', backOffCoefficient: 1.3 })

    // then it has a valid price
    expect(testCase.price).toBeTruthy()
  })
});
