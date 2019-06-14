import Link from 'next/link';
import Layout from '../components/basic-layout';
import GalleryGroup from '../components/gallery-group';
import { examples } from '../gallery';
import Donate from '../components/donate-link';

const Examples = () => (
  <section>
    <h1>Made with Idyll</h1>

    <div
      style={{
        borderRadius: 5,
        border: 'solid 1px #ddd',
        background: '#fefefe',
        padding: '1em',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <a style={{ fontSize: '1.25rem' }} href="https://parametric.press">
          Featured: Parametric Press, a digital magazine built with Idyll
        </a>
        <br />
        <br />
        The Parametric Press is an experiment, a born-digital magazine dedicated
        to showcasing the expository power that’s possible when the audio,
        visual, and interactive capabilities of dynamic media are effectively
        combined.
      </div>
      <div>
        <a href="https://parametric.press">
          <img
            style={{ maxWidth: 300, height: 'auto' }}
            src="https://parametric.press/issue-01/static/images/share.png"
          />
        </a>
      </div>
    </div>
    <div style={{ position: 'relative' }}>
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
        <li>
          <a href="./tutorials">Tutorials</a>
        </li>
      </ul>
      <p>
        If you've made something with Idyll and would like to post it here,
        please{' '}
        <a href="https://github.com/idyll-lang/idyll/issues" target="_blank">
          open an issue on GitHub
        </a>{' '}
        with the title "Gallery Example". If you like what we're doing, please
        consider{' '}
        <a href="https://opencollective.com/idyll">
          buying a sticker or donating
        </a>{' '}
        to help support future development of the project.
      </p>
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
