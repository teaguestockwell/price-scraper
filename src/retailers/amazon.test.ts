import { amazon } from './amazon';

const urls = [
  'https://www.amazon.com/Pampers-Sensitive-Water-Based-Pop-Top-Refill/dp/B07JRBSPZ3/',
  'https://www.amazon.com/Apple-MacBook-13-inch-512GB-Storage/dp/B08N5LFLC3/',
]

it.each(urls)('scrapes %s', async (url) => {
  const data = await amazon({url});

  console.log(data)
  
  expect(data.currency?.code).toBe('USD');
  expect(data.currency?.symbol).toBe('$');
  expect(data.currency?.name).toBe('United States Dollar');
  expect(data.price).toBeTruthy();
  expect(data.qty).toBe('1');
  expect(data.src).toContain('amazon.com');
  expect(data.title).toBeTruthy();
  expect(data.url).toContain('amazon.com');
});
