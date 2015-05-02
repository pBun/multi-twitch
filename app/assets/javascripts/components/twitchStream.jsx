var React = require('react');
var ReactSWF = require('./react-swf');

var twitchStream = React.createClass({

  render: function() {

    var embedId = 'embed-' + this.props.stream.name;

    console.log(this.props.stream.width);

    return (
      <div className="stream" style={{width: (this.props.stream.width || this.props.defaultWidth || 100) + '%'}}>
        <div className="embed-container">
          <ReactSWF
            src = "//www-cdn.jtvnw.net/swflibs/TwitchPlayer.swf"
            id = {embedId}
            wmode = "transparent"
            flashVars = {{
              embed: 1,
              channel: this.props.stream.name,
              auto_play: 'true'
            }}
          />
        </div>
      </div>
    );
  }

});

module.exports = twitchStream;
