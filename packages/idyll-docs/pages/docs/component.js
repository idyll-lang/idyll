import Link from 'next/link'
import markdown from 'markdown-in-js'
import Layout from '../../components/layout'
import { indexedComponents } from '../../idyll-components/contents';
import showdown from 'showdown'
import Parser from 'html-react-parser';
import * as Examples from '../../idyll-components/examples'

showdown.setFlavor('github')
const mdConverter = new showdown.Converter()

function md2html(md, naked = false) {
  if (!md) return md
  let html = mdConverter.makeHtml(md)
  if (naked) html = html.replace(/^<p>/, '').replace(/<\/p>$/, '')
  return Parser(html)
}

class IdyllComponentDoc extends React.Component {
  render() {
    const {
      title,
      hrefId,
      description,
      image,
      idyllProps,
    } = this.props.component

    const exampleCode = Examples[title];

    return (
      <div id={ hrefId }>
        <h1>{ title }</h1>
        { md2html(description) }
        { image &&
          <figure>
            <img src={ `/static/images/components/${image}` } alt={ title } />
          </figure>
        }
        { exampleCode &&
          <pre>
            <code>{ exampleCode }</code>
          </pre>
        }
        { idyllProps && idyllProps.length > 0 &&
          <div>
            <h4>Props</h4>
            <ul>
              { idyllProps.map(p => this.renderPropBullet(p)) }
            </ul>
          </div>
        }
      </div>
    )
  }

  renderPropBullet(prop) {
    const [ name ] = Object.keys(prop)
    const description = prop[name]
    return (
      <li key={ name } className="idyll-prop">
        <code>{ name }</code>
        {' '}&mdash;{' '}
        <span>{ md2html(description) }</span>
      </li>
    )
  }
}

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
    const comp = indexedComponents[url.query.slug];
    return (
      <Layout url={ url }>
        <div>
          <Link href={'/docs/components'}><a>← Back</a></Link>
          <IdyllComponentDoc component={ comp } />
        </div>
      </Layout>
    )
  }
}