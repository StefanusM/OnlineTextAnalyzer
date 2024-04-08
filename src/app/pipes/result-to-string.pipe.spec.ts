import { ResultToStringPipe } from './result-to-string.pipe';

describe('ResultToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ResultToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
