var React = require('react');
var TwitchChat = require('babel!./twitchChat.jsx');

var twitchChatWrapper = React.createClass({

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
    var chatWrapper = this.refs.chatWrapper.getDOMNode();
    var chatPanels = this.refs.chatPanels.getDOMNode();
    var chatTabs = this.refs.chatTabs.getDOMNode();
    var newHeight = chatWrapper.clientHeight - chatTabs.offsetHeight;
    chatPanels.style.height = newHeight + 'px';
  },

  render: function() {

    var chatTabs = this.props.streams.map((item) => {
      let isActive = item === this.props.activeStream;
      return (
        <li role="tab"
          className={isActive ? 'active' : 'inactive'}
          aria-selected={isActive ? 'true' : 'false'}
          aria-expanded={isActive ? 'true' : 'false'}
          >
          <a className="tab-inner" onClick={this.props.setActiveStream.bind(this, item)}>{item.name}</a>
        </li>
      );
    });

    var chatPanels = this.props.streams.map((item) => {
      let isActive = item === this.props.activeStream;
      return (
        <div role="tabpanel"
          className={isActive ? 'active' : 'inactive'}
          >
          <TwitchChat stream={item} />
        </div>
      );
    });

    return (
      <div className="twitch-chat" ref="chatWrapper">
        <ul role="tablist" ref="chatTabs">
          {chatTabs}
        </ul>
        <div className="chat-panels" ref="chatPanels">
          {chatPanels}
        </div>
      </div>
    );
  }

});

module.exports = twitchChatWrapper;
