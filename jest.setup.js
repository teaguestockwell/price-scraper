import {cleanup} from './src'

jest.setTimeout(40000);

afterAll(() => {
  cleanup()
})