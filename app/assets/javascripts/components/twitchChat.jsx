var React = require('react');

var twitchChat = React.createClass({

  render: function() {

    var chatUrl = this.props.stream.channel.url + '/chat?popout=';

    return (
      <div className="stream-chat embed-container">
        <iframe src={chatUrl} frameborder="0" scrolling="no"></iframe>
      </div>
    );
  }

});

module.exports = twitchChat;
