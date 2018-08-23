
import { Link } from '../routes';
import Layout from '../components/basic-layout';
import { indexedItems } from '../gallery/contents';
import { logPageView, initGA } from '../components/analytics';
import Head from 'next/head'

const imageUrl = (url) => /^http/.test(url) ? url : `https://idyll-lang.org/static/images/${url}`;
const description = (item) => `Idyll Example | ${item.label}`;

export default class IdyllComponentPage extends React.PureComponent {

  // getInitialProps({query}) {
  //   return {
  //     slug: query.slug
  //   }
  // }

  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { url } = this.props;
    const item = indexedItems[url.query.slug];
    return (
      <div>
        <Head>
          <title>Idyll Example | {item.label}</title>
          <meta property='og:title' content="Idyll" />

          <meta property='og:url' content={`https://idyll-lang.org/gallery/${url.query.slug}`} />

          <meta name='description' content={description(item)} />
          <meta name="twitter:description" content={description(item)} />
          <meta property='og:description' content={description(item)} />

          <meta name="twitter:image" content={imageUrl(item.image)} />
          <meta property='og:image' content={imageUrl(item.image)} />
        </Head>
        <div className="toolbar">
          <div><Link href="/gallery"><a>← More Articles</a></Link></div>
          <div>{item.label} <a href={item.href} style={{textDecoration: 'underline'}}>(url)</a></div>
          <div>
          {
            item.sourceUrl ? <a href={item.sourceUrl}>View Source Code</a>
            : <div style={{width: 100}}></div>
          }
          </div>
        </div>
          <iframe src={item.href} frameBorder={0} />
        <style jsx>{`
          a, a:visited, a:link, .link, .link:visited {
            color: white;
            text-decoration: none;
          }

          a:hover {
            color: #E7E3D0;
          }


          .toolbar {
            height: 50px;
            background: #4C4B63;
            font-family: 'Fira Mono',monospace;
            // padding: 10px;
            box-sizing: border-box;
            color: white;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            padding-left: 10px;
            padding-right: 10px;
          }

          iframe {
            position: fixed;
            top: 50px;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    )
  }
}