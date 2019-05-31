import Link from 'next/link';
import Layout from '../components/basic-layout';
import GalleryGroup from '../components/gallery-group';
import { examples } from '../gallery';
import Donate from '../components/donate-link';

const Examples = () => (
  <section style={{ position: 'relative' }}>
    <h1>Example Gallery</h1>

    <p>
      <b>Browse by category</b>
    </p>
    <ul>
      {examples.map(({ title }) => {
        return (
          <li key={title}>
            <a href={`#${title.split(' ').join('-')}`}>{title}</a>
          </li>
        );
      })}
    </ul>
    <p>
      <b>...or scroll down to see them all.</b> If you've made something with
      Idyll and would like to post it here, please{' '}
      <a href="https://github.com/idyll-lang/idyll/issues" target="_blank">
        open an issue on GitHub
      </a>{' '}
      with the title "Gallery Example".
    </p>
    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <Donate />
    </div>

    {examples.map(eg => (
      <GalleryGroup {...eg} key={eg.title} />
    ))}
  </section>
);

export default ({ url }) => (
  <Layout
    url={url}
    title="Idyll Example Gallery"
    description="Explorable explanations and interactive blog posts, made with Idyll."
    selected="gallery"
    shareImage={'https://idyll-lang.org/static/images/example-share.png'}
  >
    <Examples />
  </Layout>
);
