import React from 'react';
const PropTypes = require('prop-types');

class EmbeddedGist extends React.PureComponent {

  constructor(props) {
      super(props);
      this.gist = props.gist;
      this.file = props.file;
      this.stylesheetAdded = false;
      this.state = {
        loading: true,
        src: ""
      };
  }

  // The Gist JSON data includes a stylesheet to add to the page
  // to make it look correct. `addStylesheet` ensures we only add
  // the stylesheet one time.
  addStylesheet(href) {
    if (!this.stylesheetAdded) {
      this.stylesheetAdded = true;
      var link = document.createElement('link');
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = href;

      (document.head || document.body || {appendChild: () => {}}).appendChild(link);
    }
  }

  componentDidMount() {
    // Create a JSONP callback that will set our state
    // with the data that comes back from the Gist site
    var gistCallback = EmbeddedGist.nextGistCallback();
    window[gistCallback] = function(gist) {
        this.setState({
          loading: false,
          src: gist.div
        });
        this.addStylesheet(gist.stylesheet);
    }.bind(this);

    var url = "https://gist.github.com/" + this.props.gist + ".json?callback=" + gistCallback;
    if (this.props.file) {
      url += "&file=" + this.props.file;
    }

    // Add the JSONP script tag to the document.
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    (document.head || document.body || {appendChild: () => {}}).appendChild(script);
  }

  render() {
    if (this.state.loading) {
      return <div>loading...</div>;
    } else {
      return <div dangerouslySetInnerHTML={{__html: this.state.src}} />;
    }
  }
}

EmbeddedGist.propTypes = {
    gist: PropTypes.string.isRequired, // e.g. "username/id"
    file: PropTypes.string // to embed a single specific file from the gist
};

// Each time we request a Gist, we'll need to generate a new
// global function name to serve as the JSONP callback.
var gistCallbackId = 0;
EmbeddedGist.nextGistCallback = () => {
    return "embed_gist_callback_" + gistCallbackId++;
};

EmbeddedGist.defaultProps = {
  gist: 'mathisonian/689614257cb1af6b15de3344da6cdc7a'
}

EmbeddedGist._idyll = {
  name: "Gist",
  tagType: "closed",
  props: [{
    name: "gist",
    type: "string",
    example: '"0f83a12e29b268ffca39f471ecf39e91"'
  }, {
    name: 'file',
    type: 'string',
    example: '"particles.idl"'
  }]
}
export default EmbeddedGist;

