import Link from 'next/link';
import Layout from '../components/basic-layout';
import GalleryGroup from '../components/gallery-group';
import { examples } from '../gallery';
import Donate from '../components/donate-link';

const Examples = () => (
  <section>
    <h1>Made with Idyll</h1>

    <div style={{ position: 'relative' }}>
      {/* <p>
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
      </ul> */}
      <p>
        If you've made something with Idyll and would like to post it here,
        please reach out on{' '}
        <a href="https://twitter.com/idyll_lang/" target="_blank">
          Twitter
        </a>{' '}
        or{' '}
        <a href="https://github.com/idyll-lang/idyll/issues" target="_blank">
          open an issue on GitHub
        </a>{' '}
        with the title "Gallery Example". For tutorials on how to use Idyll,{' '}
        <a href="./tutorials">click here</a>.
      </p>
    </div>

    {examples.slice(0, 1).map(eg => {
      return <GalleryGroup items={eg.items} title={eg.title} key={eg.title} />;
    })}
    {/* <div className="feature">
      <div className="feature--text">
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
      <div className="feature--image">
        <a href="https://parametric.press">
          <img
            style={{ maxWidth: 300, width: '100%', height: 'auto' }}
            src="https://parametric.press/issue-01/static/images/share.png"
          />
        </a>
      </div>
    </div> */}
    {examples.slice(1).map(eg => {
      return <GalleryGroup items={eg.items} title={eg.title} key={eg.title} />;
    })}

    <style>{`
      .feature {
        border-radius: 5px;
        border: solid 1px #ddd;
        background: #fefefe;
        padding: 1em;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        margin-top: 30px;
      }

      .feature--text {
        padding-right: 4em;
        max-width: 64%;
        flex: 2 2 64%;
      }

      .feature--image {
        flex: 1 1 300px;
        max-width: 300px;
        max-height: 150px;
      }

      @media (max-width: 769px) {
        .feature {
          padding: 0.5em;
          flex-direction: column;
          align-items: center;
        }

        .feature--text {
          padding: 0;
          text-align: center;
          max-width: 100%;
          flex-basis: 100%;
        }

        .feature--image {
          margin-top: 1em;
          max-width: 100%;
        }
      }
    `}</style>
  </section>
);

const GalleryPage = ({ url }) => (
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

export default GalleryPage;
