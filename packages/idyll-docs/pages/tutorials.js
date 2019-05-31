import Link from 'next/link';
import Layout from '../components/basic-layout';
import GalleryGroup from '../components/gallery-group';
import { tutorials } from '../gallery';
import Donate from '../components/donate-link';

const Tutorials = () => (
  <section style={{ position: 'relative' }}>
    <h1>Tutorials</h1>

    <div style={{ position: 'absolute', top: 0, right: 0 }}>
      <Donate />
    </div>

    {tutorials.map(eg => (
      <GalleryGroup {...eg} key={eg.title} />
    ))}
  </section>
);

export default ({ url }) => (
  <Layout
    url={url}
    title="Idyll Tutorials"
    description="Explorable explanations and interactive blog posts, made with Idyll."
    selected="tutorials"
    shareImage={'https://idyll-lang.org/static/images/example-share.png'}
  >
    <Tutorials />
  </Layout>
);
