var React = require('react');
var ReactSWF = require('./react-swf');

var twitchStream = React.createClass({

  getInitialState: function() {
    return {
      channel: this.props.stream.name,
      embedId: 'embed-' + this.props.stream.id
    }
  },

  componentDidMount: function() {

    var eventHandlerName = 'onTwitchPlayerEvent' + this.props.stream.id;
    window[eventHandlerName] = this.handleStreamEvent;

    swfobject.embedSWF('//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf', this.state.embedId, '640', '400', '11', null,
      {
        'eventsCallback': eventHandlerName,
        'embed': 1,
        'channel': this.state.channel,
        'auto_play': 'true'
      }, {
        'allowScriptAccess': 'always',
        'allowFullScreen': 'true'
      }
    );

  },

  mute: function() {
    var player = document.getElementById(this.state.embedId);
    player.mute();
  },

  unmute: function() {
    var player = document.getElementById(this.state.embedId);
    player.unmute();
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

    return (
      <div className='embed-container'>
        <div id={embedId}></div>
      </div>
    );
  }

});

module.exports = twitchStream;
