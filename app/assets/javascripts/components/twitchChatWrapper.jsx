var React = require('react');
var TwitchChat = require('babel!./twitchChat.jsx');

var twitchChatWrapper = React.createClass({

  render: function() {

    var chatTabs = this.props.streams.map((item) => {
      let isActive = item === this.props.activeStream;
      return (
        <div role="tab"
          className={isActive ? 'active' : 'inactive'}
          aria-selected={isActive ? 'true' : 'false'}
          aria-expanded={isActive ? 'true' : 'false'}
          >
          <a className="tab-inner" onClick={this.props.setActiveStream.bind(this, item)}>{item.name}</a>
          <a className="close" onClick={this.props.removeStream.bind(this, item)}>close</a>
        </div>
      );
    });

    var chatPanels = this.props.streams.map((item) => {
      let isActive = item === this.props.activeStream;
      return (
        <div role="tabpanel"
          className={isActive ? 'active' : 'inactive'}
          >
          <div className="controls">
            <a className="close" onClick={this.props.removeStream.bind(this, item)}>close</a>
          </div>
          <TwitchChat stream={item} />
        </div>
      );
    });

    return (
      <div className="react-tabs">
        <ul role="tablist">
          {chatTabs}
        </ul>
        {chatPanels}
      </div>
    );
  }

});

module.exports = twitchChatWrapper;
