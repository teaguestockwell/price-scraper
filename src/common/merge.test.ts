import { merge } from './merge';

describe('merge', () => {
  it('does not create copy', () => {
    const src = { a: 1 };
    const dest = { b: 2 };

    const merged = merge(dest, src);

    expect(merged).toBe(dest);
  });
  it('shallow merges', () => {
    const dest = { a: 2, b: 2 };
    const src = { a: 1, b: 2 };

    const merged = merge(dest, src);

    expect(merged).toEqual({ a: 1, b: 2 });
  });
  it('ignores null and undefined', () => {
    const dest = { a: 2, b: 2 };
    const src = { a: null, b: 1, c: null };

    const merged = merge(dest, src);

    expect(merged).toEqual({ a: 2, b: 1 });
  });
  it('merges rest args in order', () => {
    const dest = { a: 1 };
    const src1 = { a: 2 };
    const src2 = { a: 3 };
    const src3 = { a: 4 };

    const merged = merge(dest, src1, src2, src3);

    expect(merged).toEqual({ a: 4 });
    expect(merged).toBe(dest);
  });
  it('does not merge self', () => {
    const dest = { a: 1 };
    const src1 = dest;
    const src2 = { a: 3 };
    const src3 = dest;

    const merged = merge(dest, src1, src2, src3);

    expect(merged).toEqual({ a: 3 });
  });
});
