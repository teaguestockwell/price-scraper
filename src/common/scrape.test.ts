import { scrape } from './scrape';

it('loads pages', async () => {
  const { title, src } = await scrape({
    url: 'https://teaguestockwell.com',
    headless: true,
    waitAfterNavigate: 500,
    eval: () => ({
      title: document.title,
      src: document.querySelector("meta[property='og:image']")?.getAttribute('content') ?? '',
    }),
  })

  expect(title).toBe('Teague Stockwell • Portfolio')
  expect(src).toBe('https://teaguestockwell.com/heros/open-graph.png')
})
