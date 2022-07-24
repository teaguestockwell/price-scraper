import { scrape, parseXml } from '../common';
import { ScrapeMeta } from '../types';

type ParsedMeta = {
  price: number | null;
  asin: string | null;
  mpn: string | null;
};

const parseMeta = (meta: any, url: string): ParsedMeta => {
  const res: ParsedMeta = {
    price: null,
    asin: null,
    mpn: null,
  };

  if (!meta) {
    return res;
  }

  if (meta.price && typeof meta.price === 'string') {
    try {
      res.price = Number(meta.price?.replace(/[^0-9.]/g, '')) ?? null;
    } catch {
      console.log('error parsing amazon price');
    }
  }

  if (meta.details) {
    try {
      const json = parseXml(meta.details);
      const acc: Record<string, string> = {};
      json.tr?.forEach(({ th, td }: any) => {
        try {
          const k = th['#text'].trim().toLowerCase();
          const v = td['#text'].trim();
          acc[k] = v;
        } catch {}
      });

      if (acc.asin) {
        res.asin = acc.asin;
      }

      if (acc['item model number']) {
        res.mpn = acc['item model number'];
      }
    } catch {
      console.log('error parsing details xml meta.details');
    }
  } else if (meta.details2) {
    const json = parseXml(meta.details2);
    const acc: Record<string, string> = {};
    json.li?.forEach((li: any) => {
      try {
        const e = li.span.span;
        if (Array.isArray(e)) {
          const k = e[0]['#text']
            .split('  ')[0]
            .replaceAll(':', '')
            .replaceAll(`'`, '')
            .replaceAll('+', '')
            .trim()
            .toLowerCase();
          const v = e[1];
          if (typeof k === 'string' && typeof v === 'string') {
            acc[k] = v.trim();
          }
        }
      } catch (e) {
        console.log('error parsing details xml meta.details2', e);
      }
    });

    if (acc.asin) {
      res.asin = acc.asin;
    }

    if (acc['item model number']) {
      res.mpn = acc['item model number'];
    }
  } else {
    console.log('no parser', url)
  }

  return res;
};

export const amazon = async (url: string): Promise<ScrapeMeta> => {
  const data = await scrape({
    url,
    type: 'headless',
    wait: 300,
    eval: () => {
      return {
        title: document.title,
        image:
          document.querySelector('#landingImage')?.getAttribute('src') ?? null,
        meta: {
          price: document.querySelector('.a-price-whole')?.textContent,
          details: document.querySelector('.prodDetTable > tbody')?.innerHTML,
          details2: document.querySelector('.detail-bullet-list')?.innerHTML,
        },
      };
    },
  });
  const { meta, ...rest } = data;
  const parsedMeta = parseMeta(meta, url);

  return {
    ...rest,
    ...parsedMeta,
    currency: 'USD',
  };
};
