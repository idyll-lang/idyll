import Link from 'next/link';
import markdown from 'markdown-in-js';
import Layout from '../../components/layout';
import { indexedComponents } from '../../idyll-components/contents';
import showdown from 'showdown';
import Parser from 'html-react-parser';
import * as Examples from '../../idyll-components/examples';

showdown.setFlavor('github');
const mdConverter = new showdown.Converter();

function md2html(md, naked = false) {
  if (!md) return md;
  let html = mdConverter.makeHtml(md);
  if (naked) html = html.replace(/^<p>/, '').replace(/<\/p>$/, '');
  return Parser(html);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

class IdyllComponentDoc extends React.Component {
  render() {
    const {
      title,
      hrefId,
      description,
      image,
      idyllProps,
      component
    } = this.props.component;

    const exampleCode = Examples[title];

    console.log(component);
    console.log(component._idyll);

    return (
      <div id={hrefId}>
        <h1>{title}</h1>
        {md2html(description)}
        {image && (
          <figure>
            <img src={`/static/images/components/${image}`} alt={title} />
          </figure>
        )}
        {exampleCode && (
          <pre>
            <code>{exampleCode}</code>
          </pre>
        )}
        {component._idyll.props && component._idyll.props.length > 0 && (
          <div>
            <h4>Props</h4>
            <ul>{component._idyll.props.map(p => this.renderPropBullet(p))}</ul>
          </div>
        )}
      </div>
    );
  }

  renderPropBullet(prop) {
    const { name, type, example } = prop;
    const description = prop[name];
    return (
      <li key={name} className="idyll-prop">
        <b>{name}</b>
        <code>{type}</code> &mdash;{' '}
        {/* <span>{ md2html(description) }</span> */}
      </li>
    );
  }
}

export default class IdyllComponentPage extends React.PureComponent {
  // getInitialProps({query}) {
  //   return {
  //     slug: query.slug
  //   }
  // }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { url } = this.props;
    const comp = indexedComponents[url.query.slug];
    return (
      <Layout
        url={url}
        title={`Idyll Documentation | Component - ${comp.name}`}
      >
        <div>
          <Link href={'/docs/components'}>
            <a>← Back</a>
          </Link>
          <IdyllComponentDoc component={comp} />
        </div>
      </Layout>
    );
  }
}
