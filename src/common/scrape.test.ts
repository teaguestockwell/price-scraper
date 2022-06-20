import { scrape } from './scrape';

describe('scrape', () => {
  it('teaguestockwell.com', async () => {
    const data = await scrape({
      url: 'https://teaguestockwell.com',
      type: 'headless',
      wait: 0,
      eval: () => ({
        title: document.title,
        image:
          document
            .querySelector("meta[property='og:image']")
            ?.getAttribute('content') ?? '',
      }),
    });
    const { image, url, hostname, title } = data;

    expect(title).toBe('Teague Stockwell • Portfolio');
    expect(image).toBe('https://teaguestockwell.com/heros/open-graph.png');
    expect(url).toBe('https://teaguestockwell.com');
    expect(hostname).toBe('teaguestockwell.com');
  });
});
