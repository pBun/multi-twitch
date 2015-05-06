var React = require('react');

var twitchChat = React.createClass({

  render: function() {

    var chatUrl = 'http://twitch.tv/' + this.props.stream.name + '/chat?popout=';

    return (
      <div className="stream-chat embed-container" ref="twitchChat">
        <iframe src={chatUrl} frameborder="0" scrolling="no"></iframe>
      </div>
    );
  }

});

module.exports = twitchChat;
