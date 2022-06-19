import { amazon } from './amazon';

const urls = [
  'https://www.amazon.com/Pampers-Sensitive-Water-Based-Pop-Top-Refill/dp/B07JRBSPZ3/',
  'https://www.amazon.com/Apple-MacBook-13-inch-512GB-Storage/dp/B08N5LFLC3/',
];

it.each(urls)('scrapes %s', async url => {
  const data = await amazon(url);

  expect(data.currency).toBe('USD');
  expect(data.price).toBeTruthy();
  expect(data.image).toContain('amazon.com');
  expect(data.name).toBeTruthy();
  expect(data.url).toContain('amazon.com');
});
