const routes = module.exports = require('next-routes')()

routes
  .add('component', '/docs/components/default/:slug', '/docs/component')
  .add('editor', '/editor/:uuid')
  .add('fullscreen', '/editor/:uuid/view')