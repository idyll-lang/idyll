
const React = require('react');
const ReactDOM = require('react-dom');
const Container = require('./container');
const extend = require('xtend');
const IdyllComponent = require('idyll-component');

class Screen extends IdyllComponent {
  constructor (props) {
    super(props);
  }


  render () {
    let overlayStyle = {
      position: this.props.display ? this.props.display : 'relative',
      zIndex: 1,
      height: '100vh',
      width: this.props.fullBleed ? '100vw' : undefined,
      left: this.props.display === 'fixed' ? 0 : undefined,
      pointerEvents: 'none',
      transition: 'background 0.5s'
    };

    if (this.props.backgroundImage) {
      overlayStyle.backgroundImage = 'url(' + this.props.backgroundImage + ')';
      overlayStyle.backgroundSize = 'cover';
      overlayStyle.backgroundPosition = 'top center';
    }

    let contentContainerStyle = extend({
      flexDirection: this.props.direction || 'column',
      display: 'flex',
      height: '100%',
      justifyContent: {
        center: 'center'
      }[this.props.justify] || undefined
    }, this.props.contentContainerStyle || {});

    let contentStyle = {
      alignSelf: {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
        stretch: 'stretch'
      }[this.props.align] || 'flex-end',
      pointerEvents: 'all'
    }

    return <Container style={overlayStyle}
      className={this.props.className}
      fullBleed={this.props.fullBleed}
      expand={this.props.expand}
      expandLeft={this.props.display === 'fixed' ? 0 : this.props.expandLeft}
      expandRight={this.props.display === 'fixed' ? 0 : this.props.expandRight}
      padding={this.props.padding}
    >
      <div style={contentContainerStyle}>
        <div style={{display: 'flex', flex: this.props.position}}/>
        <div style={contentStyle} className="screen-content" >
          {this.props.children}
        </div>
        <div style={{display: 'flex', flex: 1 - this.props.position}}/>
      </div>
    </Container>
  }
}

Screen.defaultProps = {
  position: 0.5,
  padding: 0,
  fullBleed: false,
  align: 'left',
};

module.exports = Screen;