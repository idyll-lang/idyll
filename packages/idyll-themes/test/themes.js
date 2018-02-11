
import {
  github,
  idyll,
  none,
  tufte
} from '../src/';


describe('Layouts', () => {
  describe('GitHub', () => {
    it('has styles', () => {
      expect(github.styles).toBeDefined();
    });
  })
  describe('Idyll', () => {
    it('has styles', () => {
      expect(idyll.styles).toBeDefined();
    });
  })
  describe('None', () => {
    it('has styles', () => {
      expect(none.styles).toBeDefined();
    });
  })
  describe('Tufte', () => {
    it('has styles', () => {
      expect(tufte.styles).toBeDefined();
    });
  })
})
