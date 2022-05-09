import * as all from '.';

it('noop', () => {
  const product: all.Product = {
    title: 'product',
    url: 'url',
  };
  expect(product).toBeTruthy();
});
