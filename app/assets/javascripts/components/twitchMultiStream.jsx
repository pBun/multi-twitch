var React = require('react');

var TwitchSearch = require('babel!./twitchSearch.jsx');
var TwitchStream = require('babel!./twitchStream.jsx');
var TwitchChatWrapper = require('babel!./twitchChatWrapper.jsx');

var twitchMultiStream = React.createClass({

  getInitialState: function() {

    var streams = [];
    var propStreams = this.props.streams;

    propStreams.forEach((stream, i) => {
      streams.push({
        id: Date.now() + i,
        name: stream
      });
    });

    var defaultWidth = streams.length <= 2 ? 100 : streams.length <= 4 ? 50 : streams.length <= 9 ? 33 : 25;
    return {
      streams: streams,
      activeStream: streams[0],
      defaultWidth: defaultWidth
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
    urlStreams.forEach((stream, i) => {
      streams.push({
        id: Date.now() + i,
        name: stream
      });
    });
    var defaultWidth = streams.length <= 2 ? 100 : streams.length <= 4 ? 50 : streams.length <= 9 ? 33 : 25;
    this.setState({
      streams: streams,
      activeStream: streams[0],
      defaultWidth: defaultWidth
    });
  },

  addStream: function(stream) {
    var activeStream = this.state.activeStream;
    var streams = this.state.streams.slice();
    streams.push({
      id: Date.now(),
      name: stream
    });
    var defaultWidth = streams.length <= 2 ? 100 : streams.length <= 4 ? 50 : streams.length <= 9 ? 33 : 25;
    this.setState({
      streams: streams,
      activeStream: activeStream || streams[0],
      defaultWidth: defaultWidth
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
    var defaultWidth = streams.length <= 2 ? 100 : streams.length <= 4 ? 50 : streams.length <= 9 ? 33 : 25;
    this.setState({streams: []}); //hack for buggy twitch
    setTimeout(() => { //hack for buggy twitch
      this.setState({
        streams: streams,
        activeStream: activeStream != stream ? activeStream :
          streams.length ? streams[0] : null,
        defaultWidth: defaultWidth
      });
    }, 0);
  },

  updateStreamSize: function(stream, e) {
    var streams = this.state.streams.slice();
    streams.forEach((s) => {
      if (s.id === stream.id) {
        stream.width = e.target.value;
      }
    });
    this.setState({
      streams: streams
    });
  },

  toggleControls: function() {
    this.setState({
      controlsOpen: !this.state.controlsOpen
    });
  },

  render: function() {

    var streams = this.state.streams.map((item) => {
      return (
        <TwitchStream stream={item} defaultWidth={this.state.defaultWidth} />
      );
    });

    var streamControls = this.state.streams.map((item) => {
      return (
        <div className="stream-controls">
          <!--<input type="number" min="0" max="100" step="0.1" value={item.width} onChange={this.updateStreamSize.bind(this, item)} />-->
          <a className="close" onClick={this.removeStream.bind(this, item)}>Close {item.name}</a>
        </div>
      );
    });

    var controlsClasses = this.state.controlsOpen ? 'controls open' : 'controls closed';
    return (
      <div className="multi-stream">
        <div className={controlsClasses}>
          <TwitchSearch streams={this.state.streams} addStream={this.addStream} />
          {streamControls}
          <a className="control-toggle" onClick={this.toggleControls}>Toggle controls</a>
        </div>
        <div className="streams">
          {streams}
        </div>
        <div className="stream-meta">
          <TwitchChatWrapper
            streams={this.state.streams}
            activeStream={this.state.activeStream}
            setActiveStream={this.setActiveStream} />
        </div>
      </div>
    );
  }

});

module.exports = twitchMultiStream;
