import { ScrapeMeta } from './scrape-meta';

export type ScrapeMetaWithMeta = ScrapeMeta & {
  meta: Record<string, string | null | undefined> | null;
}

export type ScrapeOptions = {
  type: 'headed' | 'headless' | 'cli';
  url: string;
  wait: number;
  eval: (body?: string) => Partial<ScrapeMetaWithMeta>;
};
