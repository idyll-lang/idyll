import { useRouter } from 'next/router';
import Link from 'next/link';
import markdown from 'markdown-in-js';
import Layout from '../../../components/layout';
import { indexedComponents } from '../../../idyll-components/contents';
import showdown from 'showdown';
import Parser from 'html-react-parser';
import * as Examples from '../../../idyll-components/examples';
import * as IdyllComponents from 'idyll-components';
import IdyllDocument from 'idyll-document';

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
      component,
      liveExample
    } = this.props.component;

    const exampleCode = Examples[title];

    return (
      <div id={hrefId}>
        <h1>{title}</h1>
        {md2html(description)}
        {!liveExample && image && (
          <figure>
            <img src={`/static/images/components/${image}`} alt={title} />
          </figure>
        )}
        {liveExample && exampleCode && (
          <div>
            <h4>Input:</h4>
            <pre>
              <code>{(exampleCode || '').trim()}</code>
            </pre>
            <h4>Output:</h4>
            <div
              style={{
                border: 'solid 1px black',
                borderRadius: 5,
                padding: '1em',
                boxShadow: '3px 3px 5px #ccc'
              }}
            >
              <IdyllDocument
                markup={exampleCode}
                components={IdyllComponents}
              />
            </div>
          </div>
        )}
        {((component && component._idyll.props) || idyllProps) && (
          <div>
            <h3>Props</h3>
            <ul>
              {(component ? component._idyll.props : idyllProps).map(p =>
                this.renderPropBullet(p)
              )}
            </ul>
          </div>
        )}
        {!liveExample && exampleCode && (
          <div>
            <h3>Example Code</h3>
            <pre>
              <code>{exampleCode}</code>
            </pre>
          </div>
        )}
      </div>
    );
  }

  renderPropBullet(prop) {
    const { name, type, example, defaultValue, description } = prop;
    return (
      <li key={name} className="idyll-prop">
        <b>{name}</b> <code>{type}</code> <br />
        <br />
        <span>{md2html(description)}</span>
        <ul>
          {example ? (
            <li>
              <em>Example</em>: <code>{example}</code>
            </li>
          ) : null}
          {defaultValue ? (
            <li>
              <em>Default value</em>: <code>{defaultValue}</code>
            </li>
          ) : null}
        </ul>
      </li>
    );
  }
}

class IdyllComponentPage extends React.PureComponent {
  render() {}
}

export async function getStaticPaths() {
  const _components = Object.keys(indexedComponents);

  const paths = _components.map(k => {
    return {
      params: { slug: [k] }
    };
  });

  // fallback: false means pages that don’t have the
  // correct id will 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  // Pass post data to the page via props
  return { props: { slug: params.slug } };
}

const Component = props => {
  const router = useRouter();
  const { slug } = router.query;
  const comp = indexedComponents[slug] || { name: '' };

  return (
    <Layout
      url={`/docs/components/${slug}`}
      title={`Idyll Documentation | Component - ${comp.name}`}
    >
      <div>
        <Link href={'/docs/components'}>
          <a>← Back</a>
        </Link>
        <IdyllComponentDoc component={comp} />
      </div>
      <style global>{`
        ul {
          list-style-type: none;
        }
        .idyll-prop {
          margin-bottom: 1em;
          padding: 1em;
          overflow-x: auto;
          background: #efefef;
        }
        .idyll-prop ul li {
          margin-top: 1em;
        }

        .idyll-prop code {
          border: solid 1px #222;
          border-radius: 5px;
          margin: 0 5px;
          background: #fff;
          white-space: nowrap;
        }
      `}</style>
    </Layout>
  );
};

export default Component;
