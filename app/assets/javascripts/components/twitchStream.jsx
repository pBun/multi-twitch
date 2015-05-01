var React = require('react');

var twitchStream = React.createClass({

  render: function() {

    var embedUrl = this.props.stream.channel.url + '/embed';

    return (
      <div className="stream embed-container">
        <iframe src={embedUrl} frameborder="0" scrolling="no"></iframe>
      </div>
    );
  }

});

module.exports = twitchStream;
