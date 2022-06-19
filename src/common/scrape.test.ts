import { scrape } from './scrape';

it('loads pages', async () => {
  const data = await scrape({
    url: 'https://teaguestockwell.com',
    type: 'headless',
    wait: 0,
    eval: () => ({
      image:
        document
          .querySelector("meta[property='og:image']")
          ?.getAttribute('content') ?? '',
    }),
  });
  const { image, url, hostname, name } = data;
  console.log(data)
  expect(name).toBe('Teague Stockwell • Portfolio');
  expect(image).toBe('https://teaguestockwell.com/heros/open-graph.png');
  expect(url).toBe('https://teaguestockwell.com');
  expect(hostname).toBe('teaguestockwell.com');
});
