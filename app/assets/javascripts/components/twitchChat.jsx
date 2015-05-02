var React = require('react');

var twitchChat = React.createClass({

  componentDidUpdate: function() {
    this.updateChatSize();
  },

  componentDidMount: function() {
    this.updateChatSize();
    window.addEventListener('resize', this.updateChatSize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.updateChatSize);
  },

  updateChatSize: function() {
    var twitchChat = this.refs.twitchChat.getDOMNode();
    var newHeight = window.innerHeight - twitchChat.getBoundingClientRect().top;
    twitchChat.style.height = newHeight + 'px';
  },

  render: function() {

    var chatUrl = this.props.stream.url + '/chat?popout=';

    return (
      <div className="stream-chat embed-container" ref="twitchChat">
        <iframe src={chatUrl} frameborder="0" scrolling="no"></iframe>
      </div>
    );
  }

});

module.exports = twitchChat;
