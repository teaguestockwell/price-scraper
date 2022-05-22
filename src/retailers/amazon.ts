import { getCurrencyCode, Product, RetailerOptions, scrape } from '../common';

export const amazon = async (options: RetailerOptions): Promise<Product> => {
  const data = await scrape({
    url: options.url,
    headless: false,
    waitAfterNavigate: 200,
    eval: () => ({
      currency: document.querySelector('.a-price-symbol')?.innerHTML ?? '',
      price: document.querySelector('.a-price-whole')?.textContent ?? '',
      qty: '1',
      src:
        document.querySelector('.imgTagWrapper img')?.getAttribute('src') ?? '',
    }),
  });

  const currency = getCurrencyCode(data.currency);

  return {
    ...data,
    currency,
  };
};
