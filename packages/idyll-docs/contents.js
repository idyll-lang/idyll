const Contents = [
  {
    title: 'Overview',
    pages: [
      {title: 'Introduction', route: '/docs' },
      {title: 'Getting started', route: '/docs/getting-started' },
      {title: 'Syntax', route: '/docs/syntax' },
      {title: 'Customizing', route: '/docs/configuration-and-styles' }
    ],
  },
  {
    title: 'Interactivity',
    pages: [
      {title: 'Built-in components', route: '/docs/components' },
      {title: 'Using components from npm', route: '/docs/components/npm' },
      {title: 'Make your own component', route: '/docs/components/custom' },
      {title: 'Scrolling and Refs', route: '/docs/components/scrolling-and-refs' }
    ],
  },
  {
    title: 'Publishing',
    pages: [
      { title: 'Deploying to the web', route: '/docs/publishing/deploying-to-the-web' },
      { title: 'Embedding Idyll', route: '/docs/publishing/embedding' }
    ],
  },
  {
    title: 'Useful Links',
    pages: [
      { title: 'Github', route: 'https://github.com/idyll-lang/idyll' },
      { title: 'Chat', route: 'https://gitter.im/idyll-lang/Lobby' },
      { title: 'Mailing List', route: 'https://groups.google.com/forum/#!forum/idyll-lang' },
      { title: 'Support Us', route: 'https://opencollective.com/idyll' }
    ],
  },
]

module.exports = {
  Contents
}
