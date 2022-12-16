/* eslint-disable @typescript-eslint/no-empty-function */
import * as MSS from './shopping'

describe('getHostname', () => {
  it('should return the hostname without subdomains for a URL with subdomains', () => {
    expect(MSS.getHostname('https://www.example.com')).toEqual('example.com');
    expect(MSS.getHostname('https://api.example.com')).toEqual('example.com');
  });
  it('should return the original hostname for a URL without subdomains', () => {
    expect(MSS.getHostname('https://example.com')).toEqual('example.com');
  });
  it('should handle URLs with multiple subdomains', () => {
    expect(MSS.getHostname('https://sub1.sub2.example.com')).toEqual('example.com');
  });
  it('should return input for an invalid URL', () => {
    expect(MSS.getHostname('')).toEqual('');
    expect(MSS.getHostname('invalid')).toEqual('invalid');
  });
});

const priceCases = [
  ["2.75", 2.75],
  ["$2.75", 2.75],
  ["2,75", 2.75],
  ["0.50", 0.5],
  ["0", 0],
  ["0.0", 0],
  [".", undefined],
  [",", undefined],
  ["", undefined],
  [undefined, undefined],
  [null, undefined],
  [NaN, undefined],
  [{}, undefined],
  [() => {}, undefined],
  [0, 0],
  [-2, -2],
  [-0.2, -0.2]
];

describe("toPriceFormat", () => {
  priceCases.forEach(([given, then]) => {
    it(`toPriceFormat(${given}) === ${then}`, () => {
      expect(MSS.toPriceFormat(given)).toBe(then);
    });
  });
});