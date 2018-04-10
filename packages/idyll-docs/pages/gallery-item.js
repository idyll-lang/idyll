import Link from 'next/link'
import Layout from '../components/basic-layout'
import { indexedItems } from '../gallery/contents';


export default class IdyllComponentPage extends React.PureComponent {

  // getInitialProps({query}) {
  //   return {
  //     slug: query.slug
  //   }
  // }

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    const { url } = this.props;
    const item = indexedItems[url.query.slug];
    return (
      <div>
        <div className="toolbar">
          <div><Link href="/gallery"><a>← Back</a></Link></div>
          {
            item.sourceUrl ?
            <div><a href={item.sourceUrl}>View Source Code</a></div>
            : null
          }
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