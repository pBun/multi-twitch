var React = require('react');

var TwitchSearch = require('babel!./twitchSearch.jsx');
var TwitchStream = require('babel!./twitchStream.jsx');
var TwitchChatWrapper = require('babel!./twitchChatWrapper.jsx');

var twitchMultiStream = React.createClass({

  getInitialState: function() {

    var streams = [];
    var propStreams = this.props.streams;

    propStreams.forEach((stream) => {
      streams.push({name: stream});
    });

    return {
      streams: streams,
      activeStream: streams[0]
    }
  },

  componentDidMount: function() {
    window.addEventListener('hashchange', this.hashchangeHandler);
  },

  componentWillUnmount: function() {
    window.removeEventListener('hashchange', this.hashchangeHandler);
  },

  setActiveStream: function(stream) {
    this.setState({activeStream: stream});
  },

  hashchangeHandler: function(e) {
    var urlStreams = window.location.hash.replace('#', '');
    urlStreams = urlStreams ? urlStreams.split('&') : [];
    var streams = [];
    urlStreams.forEach((stream) => {
      streams.push({name: stream});
    });
    this.setState({
      streams: streams,
      activeStream: streams[0]
    });
  },

  addStream: function(stream) {
    var activeStream = this.state.activeStream;
    var streams = this.state.streams.slice();
    streams.push({name: stream});
    this.setState({
      streams: streams,
      activeStream: activeStream || streams[0]
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

    return (
      <div className="multi-stream">
        <div className="streams">
          {streams}
        </div>
        <div className="stream-meta">
          <TwitchSearch streams={this.state.streams} addStream={this.addStream} />
          <TwitchChatWrapper
            streams={this.state.streams}
            activeStream={this.state.activeStream}
            setActiveStream={this.setActiveStream}
            removeStream={this.removeStream} />
        </div>
      </div>
    );
  }

});

module.exports = twitchMultiStream;
