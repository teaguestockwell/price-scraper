import { ScrapeMeta } from './scrape-meta';

export type ScrapeOptions = {
  type: 'headed' | 'headless' | 'cli';
  url: string;
  wait: number;
  eval: (body?: string) => Partial<ScrapeMeta>;
};
