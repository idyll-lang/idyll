import React from 'react';

class Ga4Analytics extends React.PureComponent {
  componentDidMount() {
    try {
      const url =
        'https://www.googletagmanager.com/gtag/js?id=' + this.props.google;

      (function(w, d, o, u) {
        const ga4ScriptNode = d.createElement('script');
        const firstONode = d.getElementsByTagName(o)[0];
        ga4ScriptNode.async = 1;
        ga4ScriptNode.src = u;
        firstONode.parentNode.insertBefore(ga4ScriptNode, firstONode);
      })(window, document, 'link', url);

      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag('js', new Date());

      gtag('config', this.props.google);
    } catch (error) {
      console.log('Could not mount google analytics 4: ' + error);
    }
  }

  render() {
    return null;
  }
}

Ga4Analytics._idyll = {
  name: 'Ga4Analytics',
  tagType: 'closed',
  props: [
    {
      name: 'google',
      type: 'string',
      example: '"G-XXXXXXX"',
      defaultValue: 'none',
      description: 'Component to add google analytics 4.'
    }
  ]
};

export default Ga4Analytics;
