export * from './amazon';

import { ScrapeMeta } from '../types';
import { amazon, amazonHostnames } from './amazon';

type Retailer = (url: string) => Promise<ScrapeMeta>;

export const route = (hostName: string): Retailer | void => {
  const base = hostName.replace('www.', '');
  if (amazonHostnames.has(base)) {
    return amazon;
  }
};
