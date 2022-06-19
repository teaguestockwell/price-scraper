import { scrapeMeta } from './scrape-meta';

it('loads pages', async () => {
  const data = await scrapeMeta({
    url:
      'https://www.getfpv.com/radiomaster-tx16s-max-pro-multi-protocol-2-4ghz-radio-transmitter-w-ag01-gimbals-lumenier-edition.html',
    type: 'cli',
    wait: 0,
  });

  expect(data.currency).toBe('USD');
  expect(data.price).toBeTruthy();
  expect(data.image).toContain('getfpv.com');
  expect(data.name).toBeTruthy();
  expect(data.url).toContain('getfpv.com');
});
