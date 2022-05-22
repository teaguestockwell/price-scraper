import { scrape } from './scrape';

it('loads pages', async () => {
  const { title, src } = await scrape({
    url: 'https://teaguestockwell.com',
    headless: true,
    waitAfterNavigate: 500,
    eval: () => ({
      src: document.querySelector("meta[property='og:image']")?.getAttribute('content') ?? '',
      price: '',
      currency: 'USD',
      qty: '1',
      currencySymbol: ''
    }),
  })

  expect(title).toBe('Teague Stockwell • Portfolio')
  expect(src).toBe('https://teaguestockwell.com/heros/open-graph.png')
})
