import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';

class Tweet extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      loadingMessage: 'Loading tweet...'
    };
    this.tweetContainer = createRef();
    this.loadTweet = this.loadTweet.bind(this);
  }

  isTwttrReady() {
    return !!window['twttr'];
  }

  loadTwttr() {
    return new Promise((resolve, reject) => {
      const twttrEl = document.createElement('script');
      twttrEl.setAttribute(
        'src',
        `${
          document.location.protocol === 'file:'
            ? 'https:'
            : document.location.protocol
        }//platform.twitter.com/widgets.js`
      );
      twttrEl.onload = () => resolve();
      twttrEl.onerror = error => reject(error);
      (document.head || document.body || { appendChild: () => {} }).appendChild(
        twttrEl
      );
    });
  }

  loadTweet() {
    const twttr = window['twttr'];
    const { id, parameters } = this.props;

    twttr.widgets.createTweet('' + id, this.tweetContainer.current, parameters);

    this.setState({ loading: false });
  }

  componentDidMount() {
    if (this.isTwttrReady()) {
      this.loadTweet();
    } else {
      const loadingMessage = `Error loading tweet ${this.props.id}`;
      this.loadTwttr()
        .then(this.loadTweet)
        .catch(() => this.setState({ loadingMessage }));
    }
  }

  render() {
    const { loading, loadingMessage } = this.state;

    return (
      <div
        ref={this.tweetContainer}
        style={
          this.props.style
            ? this.props.style
            : { minHeight: 309, marginTop: 10, marginBottom: 10 }
        }
      >
        {loading && loadingMessage}
      </div>
    );
  }
}

Tweet.propTypes = {
  id: PropTypes.string, //Tweet id can be found via url, e.g https://twitter.com/user/status/id
  parameters: PropTypes.object //https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference
};

Tweet._idyll = {
  name: 'Tweet',
  tagType: 'closed',
  props: [
    {
      name: 'id',
      type: 'string',
      example: '"1123077742466031616"',
      description:
        'The ID of the Tweet, found in the URL after /status/. Required.'
    },
    {
      name: 'parameters',
      type: 'object',
      example: '`{linkColor: "#8342f4"}`',
      description:
        'Embedded tweet params. See https://developer.twitter.com/en/docs/twitter-for-websites/embedded-tweets/guides/embedded-tweet-parameter-reference. Optional'
    }
  ]
};

export default Tweet;
