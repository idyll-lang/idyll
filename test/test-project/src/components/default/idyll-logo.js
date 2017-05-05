const React = require('react');
const IdyllComponent = require('idyll-component');
const insertCSS = require('insert-css');
const fs = require('fs');
const css = fs.readFileSync(__dirname + '/styles/idyll-logo.css');
insertCSS(css.toString('utf8'));

class Logo extends IdyllComponent {
  render() {
    return (
      <div className={'logo-lockup'}>
        <a href="https://idyll-lang.github.io/">
          <img className={'logo'} src={'https://idyll-lang.github.io/images/logo.svg'} />
          <small>Made with Idyll</small>
        </a>
      </div>
    );
  }
}

module.exports = Logo;
