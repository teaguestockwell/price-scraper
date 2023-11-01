import { scrapePrice } from './scrape-price';

const urls = [
  'https://www.amazon.com/Pampers-Sensitive-Water-Based-Pop-Top-Refill/dp/B07JRBSPZ3/',
  'https://lunacycle.com/sur-ron-float-seat/',
  'https://www.ebay.com/itm/234695483731?epid=7054508373',
  'https://www.getfpv.com/multi-rotor-frames/5-quad-frames/speedybee-5-freestyle-frame.html',
  'https://www.apple.com/shop/buy-mac/macbook-air/midnight-apple-m2-chip-with-8-core-cpu-and-8-core-gpu-256gb',
  'https://a.co/d/iDCaJW4'
];

describe('scrapePrice', () => {
  it.each(urls)('scrapes %s', async url => {
    const data = await scrapePrice({ url });
    const host = new URL(url).hostname;

    expect(data.price).toBeTruthy();
    expect(data.title).toBeTruthy();
    expect(data.url).toContain(host);
    expect(data).toMatchSnapshot()
  });
  it("scrapes products that cost greater than 1: ~2.75", async () => {
    const data = await scrapePrice({url: 'https://www.homedepot.com/p/1-2-in-13-x-2-in-Zinc-Plated-Grade-8-Cap-Screw-810088/204274282' })
    expect(data).toMatchSnapshot()
  })
  it('scrapes products that cost less than 1: ~0.50', async () => {
    const data = await scrapePrice({url: 'https://www.homedepot.com/p/Everbilt-1-2-in-Yellow-Zinc-Grade-8-Split-Washer-807138/204276412' })
    expect(data).toMatchSnapshot()
  })
});
