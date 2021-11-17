import examples from './examples';
import tutorials from './tutorials';

function slugify(text) {
  return text
    .toString()
    .split(/([A-Z][a-z]+)/)
    .join('-')
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

const groupsToIndex = groups =>
  groups.reduce((indexes, group) => {
    group.items.forEach(example => {
      const slug = slugify(example.label);
      indexes[slug] = example;
    });

    return indexes;
  }, {});

const indexedGallery = groupsToIndex([...examples, ...tutorials]);
export { examples, tutorials, indexedGallery };
