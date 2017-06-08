const React = require('react');
const IdyllComponent = require('idyll-component');

class Analytics extends IdyllComponent {
  componentDidMount() {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', props.google, 'auto');

    window.ga('send', 'pageview', {
      tag: this.props.tag
    });
  }

  render() {
    return null;
  }
}


module.exports = Analytics;
