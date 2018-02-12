
import {
  blog,
  centered,
  none
} from '../src/';


describe('Layouts', () => {
  describe('Blog', () => {
    it('has styles', () => {
      expect(blog.styles).toBeDefined();
    });
  })
  describe('Centered', () => {
    it('has styles', () => {
      expect(centered.styles).toBeDefined();
    });
  })
  describe('none', () => {
    it('has styles', () => {
      expect(none.styles).toBeDefined();
    });
  })
})
