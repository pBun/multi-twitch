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

  addStream: function(stream) {
    var streams = this.state.streams.slice();
    api.get('streams/' + stream).then((data) => {
      console.log(data.stream);
      streams.push(data.stream);
      this.setState({streams: streams})
    });
  },

  render: function() {

    var streams = this.state.streams.map((item) => {
      return (
        <TwitchStream stream={item} />
      );
    });

    var chatTabs = this.state.streams.map((item) => {
      return (
        <Tab>{item.channel.name}</Tab>
      );
    });

    var chatPanels = this.state.streams.map((item) => {
      return (
        <TabPanel>
          <TwitchChat stream={item} />
        </TabPanel>
      );
    });

    return (
      <div className="multi-stream">
        <div className="streams">
          {streams}
        </div>
        <div className="controls">
          <TwitchSearch streams={this.state.streams} addStream={this.addStream} />
          <Tabs>
            <TabList>
              {chatTabs}
            </TabList>
            {chatPanels}
          </Tabs>
        </div>
      </div>
    );
  }

});

module.exports = twitchMultiStream;
