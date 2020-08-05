const { Contents } = require('./contents');

module.exports = {
  exportPathMap: function() {
    const obj = { '/': { page: '/introduction' } };
    for (const group of Contents) {
      for (const page of group.pages) {
        const key = '/' + page;
        obj[key] = { page: key };
      }
    }
    return obj;
  },
  redirects() {
    return [
      {
        source: '/component',
        permanent: true,
        destination: '/docs/components/default/:slug'
      },
      {
        source: '/gallery-item',
        permanent: true,
        destination: '/gallery/:slug'
      },
      {
        source: '/editor/:uuid',
        permanent: true,
        destination: '/editor/:uuid'
      },
      {
        source: '/fullscreen/*',
        permanent: true,
        destination: '/editor/:uuid/view'
      },
      {
        source: '/docs/advanced-configuration',
        permanent: true,
        destination: '/docs/plugin-system'
      }
    ];
  }
};
