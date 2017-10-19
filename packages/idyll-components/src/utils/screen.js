
import React from 'react';
import ReactDOM from 'react-dom';
import Container from './container';

class Screen extends React.PureComponent {
  constructor (props) {
    super(props);
  }


  render () {
    let overlayStyle = {
      position: this.props.display ? this.props.display : 'relative',
      zIndex: 1,
      width: this.props.fullBleed ? '100%' : undefined,
      left: this.props.display === 'fixed' ? 0 : undefined,
      pointerEvents: 'none',
      transition: 'background 0.5s'
    };

    if (this.props.height) {
      overlayStyle.minHeight = this.props.height;
    } else {
      overlayStyle.height = '100vh';
    }

    if (this.props.backgroundImage) {
      overlayStyle.backgroundImage = 'url(' + this.props.backgroundImage + ')';
      overlayStyle.backgroundSize = 'cover';
      overlayStyle.backgroundPosition = 'top center';
    }

    let contentContainerStyle = Object.assign({
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

    if (this.props.fullBleed) {
      return (
        <div style={{overflow: 'hidden'}}>
          <div style={Object.assign({}, overlayStyle, { position: 'absolute', left: 0 })}>
            <div style={contentContainerStyle}>
              <div style={{display: 'flex', flex: this.props.position}}/>
              <div style={contentStyle} className="screen-content" >
                {this.props.children}
              </div>
              <div style={{display: 'flex', flex: 1 - this.props.position}}/>
            </div>
          </div>
          <div style={{width: '100%', height: '100vh'}}></div>
        </div>
      );
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

export default Screen;
