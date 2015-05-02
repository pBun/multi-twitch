var React = require('react');

var TwitchSearch = require('babel!./twitchSearch.jsx');
var TwitchStream = require('babel!./twitchStream.jsx');
var TwitchChat = require('babel!./twitchChat.jsx');
var TwitchAPI = require('./twitchAPI.js');
var api = new TwitchAPI();

var twitchMultiStream = React.createClass({

  getInitialState: function() {
    return {
      streams: []
    }
  },

  setActiveStream: function(stream) {
    this.setState({activeStream: stream});
  },

  addStream: function(stream) {
    var activeStream = this.state.activeStream;
    var streams = this.state.streams.slice();
    api.get('channels/' + stream).then((data) => {
      if (!data) {
        return;
      }
      streams.push(data);
      this.setState({
        streams: streams,
        activeStream: activeStream || streams[0]
      });
    });
  },

  removeStream: function(stream) {
    var streamIndex = this.state.streams.indexOf(stream);
    if (streamIndex < 0) {
      return;
    }
    var activeStream = this.state.activeStream;
    var streams = this.state.streams.slice();
    streams.splice(streamIndex, 1);
    this.setState({streams: []}); //hack for buggy twitch
    setTimeout(() => { //hack for buggy twitch
      this.setState({
        streams: streams,
        activeStream: activeStream != stream ? activeStream :
          streams.length ? streams[0] : null
      });
    }, 0);
  },

  render: function() {

    var streams = this.state.streams.map((item) => {
      return (
        <TwitchStream stream={item} />
      );
    });

    var chatTabs = this.state.streams.map((item) => {
      let isActive = item === this.state.activeStream;
      return (
        <div role="tab"
          className={isActive ? 'active' : 'inactive'}
          aria-selected={isActive ? 'true' : 'false'}
          aria-expanded={isActive ? 'true' : 'false'}
          >
          <a className="tab-inner" onClick={this.setActiveStream.bind(this, item)}>{item.display_name}</a>
          <a className="close" onClick={this.removeStream.bind(this, item)}>close</a>
        </div>
      );
    });

    var chatPanels = this.state.streams.map((item) => {
      let isActive = item === this.state.activeStream;
      return (
        <div role="tabpanel"
          className={isActive ? 'active' : 'inactive'}
          >
          <div className="controls">
            <a className="close" onClick={this.removeStream.bind(this, item)}>close</a>
          </div>
          <TwitchChat stream={item} />
        </div>
      );
    });

    return (
      <div className="multi-stream">
        <div className="streams">
          {streams}
        </div>
        <div className="stream-meta">
          <TwitchSearch streams={this.state.streams} addStream={this.addStream} />
          <div className="react-tabs">
            <ul role="tablist">
              {chatTabs}
            </ul>
            {chatPanels}
          </div>
        </div>
      </div>
    );
  }

});

module.exports = twitchMultiStream;
