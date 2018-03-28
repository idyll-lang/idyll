import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import GlobalStyles from './global-styles'
import { Contents, hrefFromName } from '../contents'
import TopNav from './top-nav';
import Fonts from './fonts';
import { logPageView, initGA } from './analytics';

const NavWidth = 20; // %
const MainWidth = 100 - NavWidth; // %
const TogglerWidth = 50; // px
const TogglerHeight = 25; // px
const NavTransitionDuration = 0.25; // s

class IdyllDocsLayout extends React.Component {
  constructor(props) {
    super(props)
    const {url} = props
    this.presentPath = url && url.asPath
    this.state = {
      navOpen: false,
    }
  }

  componentDidMount() {
    console.log('mount')
    Fonts();
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  toggleNavOpen() {
    this.setState({ navOpen: !this.state.navOpen })
  }

  render() {
    const { title = 'Idyll', selected = "", children } = this.props
    return (
      <div id="master" className={ this.state.navOpen ?  'nav-open' : 'nav-closed' }>
        <Head>
          <title>{ title }</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel="icon" type="image/x-icon" href="/static/images/favicon.ico" />
          <meta property='og:image' content='https://idyll-lang.org/static/images/twitter-share.png' />
          <meta property='og:description' content="A markup language for interactive documents." />
          <meta property='og:title' content="Idyll" />
          <meta property='og:url' content='https://idyll-lang.org' />
          <meta property='og:type' content='website' />
        </Head>

        <TopNav selected={selected} />
        <div className="content-container">
          <main>
            <div className="main-container">
              { children }
            </div>
          </main>
        </div>

        <style jsx>{`
          .content-container {
            display: flex;
            justify-content: center;
            padding-top: 70px;
          }

          main {
            padding: 1em;
            box-sizing: border-box;
          }
          main {
            width: ${MainWidth}%;
            transition: width ${NavTransitionDuration}s;
          }
          .main-container {
            // max-width: 600px;
            margin-left: 2em;
            margin-right: 2em;
            margin-top: 0;
          }

          .nav-toggler {
            display: none;
          }


          @media (max-width: 767px) {
            main {
              width: 100%;
            }

          }


          ul {
            padding: 0;
            list-style: none;
          }

          li {
            margin: 0.5rem 0;
          }

          a:not(:hover) {
            text-decoration: none;
          }

          .active {
            font-weight: bold;
          }
        `}</style>

        <GlobalStyles />

      </div>
    )
  }
}

export default IdyllDocsLayout
