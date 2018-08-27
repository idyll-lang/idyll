import React from 'react';
let YouTube;

const YT_PLAYING = 1;
const YT_PAUSED = 2;

class YoutubeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    }
  }

  componentDidMount() {
    this.setState({ mounted: true });
    YouTube = require('react-youtube').default;
  }

  render() {
    if (!this.state.mounted) {
      return null;
    }

    const opts = {
      height: this.props.height,
      width: this.props.width,
      playerVars: Object.assign({}, { // https://developers.google.com/youtube/player_parameters
        autoplay: this.props.play
      }, this.props.options)
    };

    return (
      <YouTube
        key={this.props.id}
        videoId={this.props.id}
        opts={opts}
        onReady={this._onReady.bind(this)}
      />
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._player && this.props.id !== prevProps.id) {
      // // The video has changed
      // this.props.audio ? this._player.unMute() : this._player.mute();
      // if (this.props.play) {
      //   console.log('playing video')
      //   setTimeout(() => {
      //     this._player.playVideo();
      //   }, 1000)
      // }
    } else {
      // Modify options to the same video
      if (this._player && this.props.play !== prevProps.play) {
        this.props.play ? this._player.playVideo() : this._player.pauseVideo();
      }
      if (this._player && this.props.audio !== prevProps.audio) {
        this.props.audio ? this._player.unMute() : this._player.mute();
      }
    }
  }

  _onReady(event) {
    this._player = event.target;
    if (!this.props.audio) {
      this._player.mute();
    }
    this._player.addEventListener('onStateChange', (event) => {
      if (event.data === YT_PLAYING && !this.props.play) {
        this.props.updateProps({ play: true })
      } else if (event.data === YT_PAUSED && this.props.play) {
        this.props.updateProps({ play: false })
      }
    })
    this.props.onReady && this.props.onReady();
  }
}

export default YoutubeComponent;
