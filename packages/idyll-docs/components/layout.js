import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import GlobalStyles from './global-styles'
import { Contents } from '../contents'
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
    const { title = 'Idyll', children } = this.props
    return (
      <div id="master" className={ this.state.navOpen ? 'nav-open' : 'nav-closed' }>
        <Head>
          <title>{ title }</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel="icon" type="image/x-icon" href="/static/images/favicon.ico" />
          <meta property='og:image' content='https://idyll-lang.org/static/images/twitter-share.png' />
          <meta property='og:description' content="A markup language for interactive documents." />
          <meta property='og:title' content={title} />
          <meta property='og:url' content='https://idyll-lang.org' />
          <meta property='og:type' content='website' />
        </Head>

        <TopNav selected="docs" />
        <div className="content-container">

          <nav>
            <button
              className="nav-toggler"
              onClick={ () => this.toggleNavOpen() }
            ><svg width={15} height={15} viewBox={`0 0 100 100`}><path d="M 25 50 L 100 0 L 100 100 Z" fill="#ddd" stroke="none" /></svg></button>
            {
              Contents.map(group => (
                <section key={ group.title }>
                  <h1>{ group.title }</h1>
                  <ul>{
                    group.pages.map(page => {
                      return (
                        <li className={ page.route === this.presentPath ? 'active' : null } key={ page.title }>
                        {
                          page.route.indexOf('http') > -1 ? (
                            <a href={page.route} target='_blank'>{page.title}</a>
                          ) : (
                          <Link href={ page.route }>
                            <a>{ page.title }</a>
                          </Link>
                          )
                        }
                        </li>
                      )
                    })
                  }</ul>
                </section>
              ))
            }
          </nav>

          <main>
            <div className="main-container">
              { children }
            </div>
          </main>
        </div>

        <style jsx>{`
          .content-container {
            display: flex;
            justify-content: flex-end;
            padding-top: 70px;
          }

          nav, main {
            padding: 1em;
            box-sizing: border-box;
          }

          nav {
            // background: #efefef;
            transition: left ${NavTransitionDuration}s;
            position: fixed;
            left: 0;
            top: 70px;
            bottom: 0;
            width: ${NavWidth}%;
            min-width: 130px;
            border-right: solid 1px #999;
            // background: #4C4B63;
            // color: white;
            // box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
          }

          nav ul {
            margin-left: 10px;
            margin-top: 0;
          }
          nav h1 {
            margin-bottom: 0;
            // margin-top: 0;
          }
          nav section {
            margin-bottom: 2em;
          }

          main {
            width: ${MainWidth}%;
            transition: width ${NavTransitionDuration}s;
          }
          .main-container {
            max-width: 600px;
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

            nav {
              width: 130px;
              background: white;
              top: 50px;

              overflow-y: auto;
            }
            .nav-closed nav {
              left: -130px;
              overflow-y: inherit;
            }
            .content-container {
              padding-top: 50px;
            }
            .nav-toggler {
              display: block;
              position: absolute;
              top: 10px;
              right: 0;
              transition: all ${NavTransitionDuration}s;
              margin-right: 0;
              width: ${TogglerWidth}px;
              height: ${TogglerHeight}px;
              background: transparent;
              border: none;
              outline: none;
              cursor: pointer;
            }
            .nav-closed .nav-toggler {
              margin-right: -${TogglerWidth}px;
              transform: rotate(180deg);
            }
            .nav-closed main {
              width: 100%;
            }
            nav header {
              margin-top: ${TogglerHeight}px;
            }
            ul {
              font-size: 0.8em;
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
