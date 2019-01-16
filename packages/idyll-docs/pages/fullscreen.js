import React from 'react';
import LiveIdyllEditor from '../components/editor';
import exampleMarkup from '../components/editor/initial';
import TopNav from '../components/top-nav';
import Fonts from '../components/fonts';
import Head from 'next/head';
import 'isomorphic-fetch';

import { Router } from '../routes';
import { logPageView, initGA } from '../components/analytics';

const API_URL = 'https://idyll-docs-wwijepjavd.now.sh';

const grey = x => `rgb(${x}, ${x}, ${x})`;

class EditorPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static async getInitialProps({ req, query }) {
    if (query && query.uuid) {
      try {
        const res = await fetch(`${API_URL}/api/editor/${query.uuid}`);
        const json = await res.json();
        return { initialMarkup: json.markup, uuid: query.uuid };
      } catch (e) {
        console.log(e);
      }
    }

    return { initialMarkup: exampleMarkup };
  }

  componentDidMount() {
    Fonts();
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  handleEdit = () => {
    Router.pushRoute('editor', { uuid: this.props.uuid });
  };

  render() {
    return (
      <div className="editor-page">
        <Head>
          <title>{'Idyll Editor'}</title>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href="/static/images/favicon.ico"
          />
          <meta
            property="og:image"
            content="https://idyll-lang.org/static/images/twitter-share.png"
          />
          <meta
            property="og:description"
            content="Try Idyll in your browser."
          />
          <meta property="og:title" content={'Idyll Editor'} />
          <meta property="og:url" content="https://idyll-lang.org/editor" />
          <meta property="og:type" content="website" />
        </Head>
        <TopNav selected="editor" />
        <div className="editor-container">
          <LiveIdyllEditor
            fullscreen={true}
            markup={this.props.initialMarkup}
            onChange={this.handleChange}
          />
          <button
            onClick={this.handleEdit}
            style={{ position: 'fixed', bottom: 20, right: 20 }}
          >
            Edit
          </button>
        </div>

        <style jsx>{`
          .editor-page {
          }

          .editor-container {
            margin-top: 70px;
            height: calc(100vh - 70px);
            display: flex;
            flex-direction: column;
          }

          button {
            padding: 4px 2px;
            width: 85px;
            color: black;
            background: white;
            border: solid 3px black;
            cursor: pointer;
            font: Helvetica, Arial, sans-sarif;
            font-size: 14px;
            transition: background 0.5s, color 0.5s;
          }

          button:hover {
            background: #333;
            color: #efefef;
          }
        `}</style>
      </div>
    );
  }
}

export default EditorPage;
