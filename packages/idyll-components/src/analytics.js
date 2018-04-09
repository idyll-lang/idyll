import React from 'react';

class Analytics extends React.PureComponent {
  componentDidMount() {
    try {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

      ga('create', this.props.google, 'auto');

      window.ga('send', 'pageview', {
        tag: this.props.tag
      });
    } catch(e) { console.log('Could not mount Analytics.'); }
  }

  render() {
    return null;
  }
}


Analytics._idyll = {
  name: "Analytics",
  tagType: "closed",
  props: [{
    name: "google",
    type: 'string',
    example: '"UA-XXXXXXX"'
  }]
}



export default Analytics;
