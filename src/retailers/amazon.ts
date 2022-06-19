import { scrape } from '../common/scrape';

export const amazon = async (url: string) => {
  const data = await scrape({
    url,
    type: 'headless',
    wait: 200,
    eval: () => ({
      image:
        document.querySelector('.imgTagWrapper img')?.getAttribute('src') ??
        null,
      price: (document.querySelector('.a-price-whole')?.textContent ??
        '') as any,
    }),
  });

  return {
    ...data,
    price: data.price
      ? Number(((data.price as unknown) as string)?.replace(/[^0-9.]/g, ''))
      : null,
    currency: 'USD',
  };
};
