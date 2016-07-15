var React = require('react');

var twitchStream = React.createClass({

  getInitialState: function() {
    return {
      channel: this.props.stream.name,
      embedId: 'embed-' + this.props.stream.id
    }
  },

  componentDidMount: function() {

    var options = {
        width: 640,
        height: 400,
        channel: this.state.channel,
        // video: '{VIDEO_ID}'
    };

    var player = this.state.player = new Twitch.Player(this.state.embedId, options);

    var self = this;
    player.addEventListener('ready', function() {
      if (self.props.activeStream.id === self.props.stream.id) {
        self.unmute();
      } else {
        self.mute();
      }
      player.play();
    });
  },

  mute: function() {
    var player = this.state.player;
    if (!player) return;
    player.setMuted(true);
  },

  unmute: function() {
    var player = this.state.player;
    if (!player) return;
    player.setMuted(false);
  },

  handleStreamEvent: function(data) {
    data.forEach((event) => {
      if (event.event === 'videoPlaying') {
        if (this.props.activeStream.id === this.props.stream.id) {
          this.unmute();
        } else {
          this.mute();
        }
      }
    });
  },

  render: function() {

    var embedId = this.state.embedId;
    var embedClasses  = [
      'embed-container',
      this.props.activeStream.id === this.props.stream.id ? 'focused' : 'not-focused'
    ].join(' ');
    return (
      <div className={embedClasses}>
        <div id={embedId}></div>
      </div>
    );
  }

});

module.exports = twitchStream;
