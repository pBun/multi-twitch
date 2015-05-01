var React = require('react');

var ReactTabs = require('babel!./react-tabs/main.js');
var Tab = ReactTabs.Tab;
var Tabs = ReactTabs.Tabs;
var TabList = ReactTabs.TabList;
var TabPanel = ReactTabs.TabPanel;

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
    api.get('streams/' + stream).then((data) => {
      streams.push(data.stream);
      this.setState({
        streams: streams,
        activeStream: activeStream || streams[0]
      });
    });
  },

  removeStream: function(stream) {
    var activeStream = this.state.activeStream;
    var streams = this.state.streams.slice();
    var streamIndex = streams.indexOf(stream);
    streams.splice(streamIndex, 1);
    this.setState({
      streams: streams,
      activeStream: activeStream != stream ? activeStream :
        streams.length ? streams[0] : null
    });
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
          <a onClick={this.setActiveStream.bind(this, item)}>{item.channel.display_name}</a>
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
