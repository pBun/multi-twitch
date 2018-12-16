var React = require('react');

var twitchChat = React.createClass({

  render: function() {

    var chatUrl = 'http://twitch.tv/embed/' + this.props.stream.name + '/chat';

    return (
      <div className="stream-chat embed-container" ref="twitchChat">
        <iframe src={chatUrl} frameBorder="0" scrolling="no"></iframe>
      </div>
    );
  }

});

module.exports = twitchChat;
