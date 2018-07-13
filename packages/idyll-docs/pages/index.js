import Link from 'next/link'

import IdyllDocument from 'idyll-document';
import * as IdyllComponents from 'idyll-components';
import Head from 'next/head'
import Fonts from '../components/fonts';
import { logPageView, initGA } from '../components/analytics';

// import markdown from 'markdown-in-js'


// const Content = () => markdown`
// # GitHub
// `

export default class LandingPage extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      exampleValue: `
# Hello World

[var name:"x" value:5 /]

The value of x is [Display value:x format:"d" /].

[Range value:x min:0 max:10 /]
      `.trim()
    }
    this.handleExampleValueChange = this.handleExampleValueChange.bind(this);
  }


  componentDidMount() {
    Fonts();
    if (!window.GA_INITIALIZED) {
      initGA()
      window.GA_INITIALIZED = true
    }
    logPageView()
  }

  componentDidCatch(error, info) {
    this.setState({ error });
  }

  handleExampleValueChange(event) {
    console.log(event)
    console.log(event.target.value);
    this.setState({ exampleValue: event.target.value });
  }

  render() {
    const { url } = this.props;
    const { exampleValue, error } = this.state;

    return (
      <div>
        <Head>
          <title>Idyll</title>
          <meta charSet='utf-8' />
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
          <link rel="icon" type="image/x-icon" href="/static/images/favicon.ico" />
          <meta property='og:image' content='https://idyll-lang.org/static/images/twitter-share.png' />
          <meta property='og:description' content="Create data-driven stories, explorable explanations, and interactive blog posts." />
          <meta property='og:title' content="Idyll" />
          <meta property='og:url' content='https://idyll-lang.org' />
          <meta property='og:type' content='website' />
          <meta name='description' content="Create data-driven stories, explorable explanations, and interactive blog posts." />
          <meta name="keywords" content="idyll, explorable explanation, data-driven, scrollytelling, interactive" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:creator" content="@mathisonian" />
          <meta name="twitter:title" content="Idyll" />
          <meta name="twitter:description" content="Create data-driven stories, explorable explanations, and interactive blog posts." />
          <meta name="twitter:image" content="https://idyll-lang.org/static/images/twitter-share.png" />
          <script async defer src="https://buttons.github.io/buttons.js"></script>
        </Head>
        <section>
          <div className="panel alt">
            <div className="logo-container">
              <img src="/static/images/quill.svg" alt="idyll-lang" className="nav-logo" />
              idyll
            </div>
            <div className="intro">
              Create data-driven stories, explorable explanations, and interactive blog posts.
            </div>
            <div className="example">
              {/* Idyll turns markup into interactive HTML and JavaScript. */}

              <div className="label">Input (editable)</div>
              <div className="textarea-container">
                <textarea rows={9} defaultValue={exampleValue} onChange={this.handleExampleValueChange} />
                <div className="edit-label">

                </div>
              </div>

              <div className="label">Output</div>
              <div className="output">
                <IdyllDocument layout='centered' markup={exampleValue} components={IdyllComponents} />
              {
                error ? (
                  <pre>
                    {error.toString()}
                  </pre>
                ) : null
              }
              </div>
              <div className="editor-link-container">
                <a className="editor-link" href="/editor">
                  Try Idyll in your browser
                </a>
              </div>
            </div>
            {/* <div className="learn-more">
              Learn More
            </div> */}
          </div>
          <div className="panel">
            <Link href="/gallery">
              <div className="gallery">
                {/* <a href="./gallery" className="gallery-image-block" style={{display: 'block'}}> */}
                  <div className="gallery-item" style={{ backgroundImage: 'url(/static/images/barnes-hut.png)' }}>
                    <div className="title"></div>
                  </div>
                  <div className="gallery-item" style={{ backgroundImage: 'url(/static/images/how-to-tune-a-guitar.png)' }}>
                    <div className="title"></div>
                  </div>
                  <div className="gallery-item" style={{ backgroundImage: 'url(/static/images/kde.png)' }}>
                    <div className="title"></div>
                  </div>
                  <div className="gallery-item" style={{ backgroundImage: 'url(/static/images/trig.png)' }}>
                    <div className="title"></div>
                  </div>
                  <div className="gallery-item" style={{ backgroundImage: 'url(/static/images/travelling-salesman.png)' }}>
                    <div className="title"></div>
                  </div>
                  <div className="gallery-item" style={{ backgroundImage: 'url(/static/images/complaints-2.gif)' }}>
                    <div className="title"></div>
                  </div>
                {/* </a> */}
                <div className="gallery-title">
                  <a href="./gallery">View Example Gallery</a>
                </div>
              </div>
            </Link>
            {/* <div className="alert">
              Support the project by <a href="">buying a sticker</a>.
            </div> */}
            <div className="links">
              <Link href="/docs/getting-started"><a>
                Quick Start
              </a></Link>
              |
              <Link href="/docs"><a>
                Docs
              </a></Link>
              |
              <a href="https://github.com/idyll-lang/idyll" target="_blank">
                GitHub
              </a>
              |
              <a href="https://gitter.im/idyll-lang/" target="_blank">
                Chat
              </a>
              |
              <a href="https://groups.google.com/forum/#!forum/idyll-lang" target="_blank">
                Mailing List
              </a>
              |
              <a href="https://opencollective.com/idyll" target="_blank">
                Support Us
              </a>
              {/* <a className="github-button" href="https://github.com/idyll-lang/idyll" data-icon="octicon-star" data-show-count="true" aria-label="Star idyll-lang/idyll on GitHub">Star</a> */}
            </div>
            <div>
              <p>
                 <b>Idyll</b> empowers journalists, researchers, and technical experts to create compelling interactive content for the web. The markup language extends Markdown with JavaScript components. Custom components can be written using familiar JavaScript tools like D3 or React.
                <br/><br/>
                Idyll can be used to create explorable explanations, and to add interactivity to blog engines and content management systems. The tool can generate standalone webpages or be embedded inside of an existing page, and can be fully themed to match your styleguide.

                <img style={{display: 'block', width: '75%', margin: '0 auto'}} src="/static/images/sponsors.png"/>

                Idyll is supported by the Interactive Data Lab at the University of Washington, and by Rhizome and The Eutopia Foundation.
              </p>
            </div>
          </div>
          <div style={{ position: 'absolute', left: 20, top: 20 }}>
              <a className="github-button" href="https://github.com/idyll-lang/idyll" data-show-count="true" data-icon="octicon-star" aria-label="Star idyll-lang/idyll on GitHub">Star</a>
          </div>
        </section>
        {/* <section>
          <div className="panel dark">
            <div className="content-container">
            </div>
          </div>
          <div className="panel alt">
          </div>
        </section> */}
        <style jsx global>{`

          html, body {
            margin: 0;
            padding: 0;
          }

          html {
            opacity: 0;
            transition: opacity 0.25s ease-in;
          }
          html.loaded {
            opacity: 1;
          }

          * {
            box-sizing: border-box;
          }

          input {
            display: block;
          }
        `}</style>
        <style jsx>{`
          p {
            // display: none;
            max-width: 476px;
            margin: 2em auto 0 auto;
            // text-align: justify;
            line-height: 1.4em;
            font-family: 'Source Sans Pro';
          }
          .alert {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            background: #4C4B63;
            color: white;
            padding: 5px 10px;
            font-size: 0.8em;
            font-family: 'Source Sans Pro';
            text-align: right;
          }
          .alert a, .alert a:visited {
            color: white;
          }
          textarea {
            display: block;
            width: 100%;
            font-family: 'Fira Mono', monospace;
            background: #4C4B63;
            border: none;
            padding: 10px;
            border:1px solid #4C4B63;
            color: white;
          }
          textarea:focus {
            outline: none !important;
            border:1px solid #222;
          }

          .example {

          }

          section {
            display: flex;
          }
          .panel {
            height: 100vh;
            width: 100%;
            position: relative;
            overflow-y: auto;
          }
          .panel.alt {
            background: #E7E3D0;
          }
          .panel.dark {
            background: #4C4B63;
          }

          .output {
            background: white;
            width: 100%;
            padding: 5px 10px;
            // height: calc(100vh - 550px);
            overflow-y: auto;
            min-height: 140px;
            margin-bottom: 1em;
          }

          input {
            display: block;
          }

          .learn-more {
            position: absolute;
            bottom: 10px;
            width: 100%;
            text-align: center;
            font-family: 'Source Sans Pro';
          }

          .logo-container {
            width: 100%;
            margin: 0 auto;
            font-family: 'Fira Mono';
            color: black;
            font-size: 48px;
            text-decoration: none;
            text-align: center;
            margin-top: 1em;
            font-weight: bold;
          }

          .editor-link-container {
            display: block;
            width: 100%;
            margin: 0 auto;
            margin-top: 2em;
            // margin-top: 84px;
            text-align: center;
          }

          .editor-link {
            // display: block;
            font-family: 'Fira Mono';
            text-decoration: none;
            color: black;
            font-size: 14px;
            color: white;
            // background: #6122FB;
            background: #4C4B63;
            padding: 10px 10px;
            transition: color 0.5s, background 0.5s;
          }

          .links {
            background: #efefef;
            padding: 0.5em;
          }
          .links a {
            color: white;
          }

          .other-links {
            font-style: italic;
          }
          .links,.other-links {
            width: 100%;
            text-align: center;
            font-family: 'Source Sans Pro';
          }
          .links a {
            color: black;
            text-decoration: none;
            padding: 0 15px;
            font-size: 0.9em;
          }

          .logo-container img {
            position: relative;
            top: 10px;
            right: 30px;
          }

          .gallery {
            position: relative;
            font-size: 22px;
            // background: #84828F;
            width: 100%;
            transition: height 1.5s;
            display: flex;
            flex-wrap: wrap;
            overflow: hidden;
            cursor: pointer;
          }
          .gallery .gallery-item .title {
            opacity: 0.5;
          }
          .gallery:hover .gallery-item .title {
            opacity: 0.25;
          }

          .gallery-item {
            width: 33%;
            flex-grow: 1;
            height: calc(100vh / 6);
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            cursor: pointer;
          }

          .gallery-item .title {
            opacity: 0;
            transition: opacity 1s;
            width: 100%;
            height: 100%;
            background: rgba(132, 130, 143, 1.0);
            display: block;
            text-decoration: none;
            color: white;
          }
          .gallery-item:hover .title {
            // opacity: 1;
          }

          .gallery-title {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            padding: 20px;
            background: rgba(255, 255, 255, 1.0);
            border: solid 1px #333;
            font-family: 'Fira Mono';
            font-size: 0.9em;
            margin: 0 auto;
            left: 0;
            right: 0;
            width: 300px;
            opacity: 1;
            transition: opacity 1s;
            text-align: center;
          }

          .gallery-title img {
            display: block;
            width: 50px;
            margin: 0 auto;
            margin-top: 15px;
          }

          .gallery-title a,.gallery-title a:visited {
            color: #000;
          }
          .gallery-title a:hover {
            color: #6122FB;
          }

          .gallery:hover .gallery-title {
            // opacity: 0;
          }

           .links a:hover {
            color: #6122FB;
            font-weight: bold;
          }

          .editor-link:hover {
            // color: #6122FB;
            background: #6122FB;
          }

          .example,
          .intro {
            max-width: 400px;
            margin: 0 auto;
            margin-top: 1em;
            font-family: 'Source Sans Pro';
            font-size: 24px;
            font-weight: 300;
            // letter-spacing: 0.3em;
            line-height: 1.1em;
            text-align: center;
          }

          .example {
            font-size: 18px;
            font-weight: normal;
            color: rgb(40, 40, 40);
            text-align: left;
          }

          .label {
            text-transform: uppercase;
            font-size: 0.8em;
            margin-top: 30px;
          }


          @media (max-width: 960px) {
            section {
              flex-direction: column;
            }
            .panel {
              height: auto;
              width: 100%;
              position: relative;
              overflow-y: auto;
              padding-bottom: 2em;
            }
            p {
              padding-left: 1em;
              padding-right: 1em;
            }

            .editor-link-container {
              margin-top: 0.5em;
            }
            // .gallery {
            //   margin-top: 1em;
            // }

            .links {
              font-size: 0.9em;
            }
            .example {
              width: 95%;
            }
          }

        `}</style>
      </div>
    )
  }
}


