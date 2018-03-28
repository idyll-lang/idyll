const { Contents, hrefFromName } = require('./contents')

module.exports = {
  exportPathMap: function() {
    const obj = { '/': { page: '/introduction' } }
    for (const group of Contents) {
      for (const page of group.pages) {
        const key = '/' + hrefFromName(page)
        obj[key] = { page: key }
      }
    }
    return obj
  }
}