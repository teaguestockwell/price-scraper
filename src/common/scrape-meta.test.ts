import { scrapeMeta } from './scrape-meta';

describe('scrapeMeta', () => {
  it('www.getfpv.com cli', async () => {
    const data = await scrapeMeta({
      url:
        'https://www.getfpv.com/radiomaster-tx16s-max-pro-multi-protocol-2-4ghz-radio-transmitter-w-ag01-gimbals-lumenier-edition.html',
      type: 'cli',
      wait: 0,
    });

    expect(data.currency).toBe('USD');
    expect(data.price).toBeTruthy();
    expect(data.image).toContain('getfpv.com');
    expect(data.title).toBeTruthy();
    expect(data.url).toContain('getfpv.com');
  });
  it('teaguestockwell.com cli', async () => {
    const data = await scrapeMeta({
      url: 'https://teaguestockwell.com',
      type: 'cli',
      wait: 0,
    });

    expect(data.title).toBeTruthy();
  });
  it('canonical url', async () => {
    const data = await scrapeMeta({
      url: 'https://www.getfpv.com/new-arrivals-1/foxeer-foxwhoop-25-hd-cinewhoop-vista.html',
      type: 'cli',
      wait: 0
    })

    expect(data.url).toBe('https://www.getfpv.com/new-arrivals-1/foxeer-foxwhoop-25-hd-cinewhoop-vista.html')
  })
});
