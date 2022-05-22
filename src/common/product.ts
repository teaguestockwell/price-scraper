import { Currency } from './currency';

export type Product = {
  /**
   * the ISO 4217 currency code, name, and symbol
   */
  currency: Currency | undefined;
  /**
   * the total amount of currency for the given qty
   */
  price: string;
  /**
   * the amount of complete sets sold for the given price
   */
  qty: string;
  /**
   * the main image's source url
   */
  src: string;
  /**
   * the name identifier used at this url
   */
  title: string;
  /**
   * the url scraped to get this product
   */
  url: string;
};
