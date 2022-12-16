/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { $jsonld, memoizeOne } from '@metascraper/helpers';

export const toPriceFormat = (price: any) => {
  if (typeof price === 'string') {
    // remove all non-numeric characters and symbols like $, € and others others.
    // except for '.' and ','
    price = price.replace(/[^\d\.\,]/g, '');

    price = /^(\d+\.?){1}(\.\d{2,3})*\,\d{1,2}$/.test(price)
      ? price.replace(/\./g, '').replace(',', '.') // case 1: price is formatted as '12.345,67'
      : price.replace(/,/g, ''); // case 2: price is formatted as '12,345.67'
  }

  const num = parseFloat(price);

  if (Number.isNaN(num)) {
    return;
  }

  return +num.toFixed(2);
};

export const getHostname = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;
    const domainLabels = hostname.split('.');
    if (domainLabels.length > 2) {
      return `${domainLabels[domainLabels.length - 2]}.${
        domainLabels[domainLabels.length - 1]
      }`;
    }
    return hostname;
  } catch {
    return url;
  }
};

const jsonLd = memoizeOne(($: any) => {
  const jsonld = JSON.parse($('script[type="application/ld+json"]').html());
  return jsonld;
});

const jsonLdGraph = memoizeOne(($: any) => {
  const jsonld = JSON.parse($('script[type="application/ld+json"]').html());
  return jsonld && jsonld['@graph'];
});

//@graph { @type=Product }
const jsonLdGraphProduct = memoizeOne(($: any) => {
  const jsonld = jsonLdGraph($);

  if (jsonld) {
    const products = jsonld.filter((i: any) => {
      return i['@type'] === 'Product';
    });
    return products.length > 0 ? products[0] : null;
  }
  return;
});

const jsonLdLastBreadcrumb = memoizeOne(($: any) => {
  const jsonld = jsonLdGraph($);
  if (jsonld) {
    const breadcrumbs = jsonld.filter((i: any) => {
      return i['@type'] === 'BreadcrumbList';
    });
    const breadcrumb = breadcrumbs.length > 0 && breadcrumbs[0];
    const items = breadcrumb.itemListElement;
    if (items && items.length > 0) {
      const item = items[items.length - 1];
      return item;
    }

    return null;
  }

  return null;
});

export const shopping = () => {
  const rules: Record<string, Array<(a: any) => unknown>> = {
    brand: [
      ({ htmlDom: $ }) => {
        const jsonld = jsonLd($);
        let brand = jsonld && jsonld.brand;
        if (brand && brand.name) {
          brand = brand.name;
        }
        return brand;
      },
    ],
    name: [
      ({ htmlDom: $ }) => {
        const jsonld = jsonLd($);

        return jsonld && jsonld.name;
      },
      ({ htmlDom: $ }) => {
        const jsonld = jsonLdLastBreadcrumb($);
        return jsonld && jsonld.name;
      },
      ({ htmlDom: $ }) => {
        const jsonld = jsonLdGraphProduct($);
        return jsonld && jsonld.name;
      },
      ({ htmlDom: $ }) => $('[property="og:title"]').attr('content'),
    ],
    url: [
      ({ htmlDom: $, url }) => {
        // dacor.com canonical points to homepage
        if (url.includes('dacor.com')) {
          return url;
        }
        if (url.includes('bedrosian')) {
          return $('link[rel="canonical"]').attr('href');
        }
      },
    ],
    image: [
      ({ htmlDom: $ }) => $('a[data-fancybox="images"]').attr('href'), //fireclaytile.com
      ({ htmlDom: $ }) => $('div#imgTagWrapperId img').attr('src'), //amazon.com
      ({ htmlDom: $, url }) => {
        //arizontile
        const relativeImage = $('.main-image-border.js-main-image').attr(
          'data-zoom-image'
        );
        const fullUrl = new URL(url);
        if (relativeImage) {
          return `${fullUrl.protocol}//${fullUrl.hostname}/${relativeImage}`;
        }
        return;
      },
      ({ htmlDom: $, url }) => {
        //semihandmade shopify
        const relativeImage = $('img.lazy.lazyload.img-fluid').attr('data-src');
        const fullUrl = new URL(url);
        if (relativeImage) {
          return `${fullUrl.protocol}${relativeImage}`;
        }
        return;
      },

      ({ htmlDom: $ }) => $('[property="og:image:secure_url"]').attr('content'),
      ({ htmlDom: $, url }) => {
        let content = $('[property="og:image"]').attr('content');
        if (url.includes('rh.com')) {
          content = content.replace('$GAL4$', '$np-fullwidth-lg$');
        }
        return content;
      },
      ({ htmlDom: $ }) => {
        const jsonld = jsonLd($);
        let image = jsonld && jsonld.image;

        if (image && image['@type'] === 'ImageObject') {
          image = image.image;
        }

        if (Array.isArray(image)) {
          image = image[0];
        }

        if (image) return image;
      },
      ({ htmlDom: $ }) => $('meta.swiftype[name="image"]').attr('content'),
      ({ htmlDom: $, url }) => {
        const image = $('[property="og:image"]').attr('content');
        const protocol = new URL(url).protocol;

        try {
          new URL(image); //catch if not a valid URL and assume it's because of protocol
        } catch (e) {
          if (image) return `${protocol}${image}`;
        }

        if (image) return image;
      },
    ],
    currency: [
      ({ htmlDom: $ }) => {
        const jsonld = jsonLdGraphProduct($);
        return jsonld && jsonld.offers && jsonld.offers.priceCurrency;
      },
      ({ htmlDom: $ }) => $('[property="og:price:currency"]').attr('content'),
      ({ htmlDom: $, url }) => $jsonld('offers.0.priceCurrency')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.priceCurrency')($, url),
      ({ htmlDom: $ }) =>
        $('[data-asin-currency-code]').attr('data-asin-currency-code'), //amazon
      ({ htmlDom: $ }) =>
        $('[property="product:price:currency"]').attr('content'),
      ({ htmlDom: $ }) => $('[itemprop=priceCurrency]').attr('content'),
    ],
    condition: [
      ({ htmlDom: $, url }) => $jsonld('itemCondition')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.itemCondition')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.0.itemCondition')($, url),
    ],
    sku: [
      ({ htmlDom: $ }) => {
        const jsonld = jsonLdGraphProduct($);
        return jsonld && jsonld.sku;
      },
      ({ htmlDom: $, url }) => $jsonld('sku')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.sku')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.0.sku')($, url),
      ({ htmlDom: $ }) => $('[itemprop=sku]').html(),
    ],
    mpn: [
      //mpn=ManufacturProductNumber
      ({ htmlDom: $, url }) => $jsonld('mpn')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.mpn')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.0.mpn')($, url),
    ],
    availability: [
      ({ htmlDom: $ }) => {
        const jsonld = jsonLdGraphProduct($);
        return jsonld && jsonld.offers && jsonld.offers.availability;
      },
      ({ htmlDom: $ }) => $('[property="og:availability"]').attr('content'),
      ({ htmlDom: $, url }) => $jsonld('offers.availability')($, url),
      ({ htmlDom: $, url }) => $jsonld('offers.0.availability')($, url),
      ({ htmlDom: $ }) => $('[itemprop=availability]').attr('href'),
    ],
    price: [
      ({ htmlDom: $ }) => {
        const jsonld = jsonLdGraphProduct($);
        return jsonld && jsonld.offers && toPriceFormat(jsonld.offers.price);
      },
      ({ htmlDom: $ }) =>
        toPriceFormat($('[property="og:price:amount"]').attr('content')),
      ({ htmlDom: $ }) => toPriceFormat($('[itemprop=price]').attr('content')),
      ({ htmlDom: $ }) =>
        toPriceFormat($('[property="product:price:amount"]').attr('content')),
      ({ htmlDom: $, url }) => toPriceFormat($jsonld('price')($, url)),
      ({ htmlDom: $, url }) => toPriceFormat($jsonld('offers.price')($, url)),
      ({ htmlDom: $, url }) => toPriceFormat($jsonld('offers.0.price')($, url)),
      ({ htmlDom: $, url }) => toPriceFormat($jsonld('0.offers.price')($, url)),
      ({ htmlDom: $, url }) =>
        toPriceFormat($jsonld('offers.lowPrice')($, url)),
      ({ htmlDom: $, url }) =>
        toPriceFormat($jsonld('offers.0.lowPrice')($, url)),
      ({ htmlDom: $, url }) =>
        toPriceFormat($jsonld('offers.highPrice')($, url)),
      ({ htmlDom: $, url }) =>
        toPriceFormat($jsonld('offers.0.highPrice')($, url)),
      ({ htmlDom: $ }) =>
        toPriceFormat($('[data-asin-price]').attr('data-asin-price')), //amazon
      ({ htmlDom: $ }) => toPriceFormat($('[itemprop=price]').html()),
      ({ htmlDom: $ }) =>
        toPriceFormat(
          toPriceFormat($('#attach-base-product-price').attr('value'))
        ),
    ],
    asin: [
      //unique amazon identifier
      ({ htmlDom: $ }) => $('[data-asin]').attr('data-asin'),
    ],
    hostname: [({ url }) => getHostname(url)],
    retailer: [
      ({ htmlDom: $ }) => $('[property="og:site_name"]').attr('content'),
    ],
  };
  return rules as any;
};
