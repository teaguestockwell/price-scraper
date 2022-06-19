import { ScrapeMeta } from './scrape-meta';

export type ScrapeOptions = {
  type: 'headed' | 'headless';
  url: string;
  wait: number;
  eval: () => Partial<ScrapeMeta>;
};
