var React = require('react');
var ClassSet = React.addons.classSet;

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
      defaultWidth: defaultWidth,
      chatLayouts: [
        {'label': 'Chat on side', 'name': 'side'},
        {'label': 'Chat hidden', 'name': 'hidden'},
        {'label': 'Chat inline', 'name': 'block'}
      ],
      currentChatLayout: 'side'
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
    this.setState({streams: []}); //hack for buggy twitch
    setTimeout(() => { //hack for buggy twitch
      this.setState({
        streams: streams,
        activeStream: streams[0],
        defaultWidth: defaultWidth
      });
    }, 0);
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

  changeChatLayout: function(e) {
    this.setState({
      currentChatLayout: e.target.value
    });
  },

  render: function() {

    var streams = this.state.streams;
    var numTwitchBlocks = streams.length + (this.state.currentChatLayout === 'block' ? 1 : 0);
    var twitchBlockWidth = numTwitchBlocks <= 2 ? 100 : numTwitchBlocks <= 4 ? 50 : numTwitchBlocks <= 9 ? 33.3333 : 25;
    var twitchBlocks = streams.map((item) => {
      return (
        <div className="twitch-block" style={{width: twitchBlockWidth + '%'}}>
          <TwitchStream stream={item} />
        </div>
      );
    });
    twitchBlocks.push(
      <div className="twitch-block chat" style={{width: twitchBlockWidth + '%'}}>
        <div className="twitch-block-inner">
          <TwitchChatWrapper
            streams={this.state.streams}
            activeStream={this.state.activeStream}
            setActiveStream={this.setActiveStream} />
        </div>
      </div>
    );

    var chatLayoutOptions = this.state.chatLayouts.map((item) => {
      return (
        <option value={item.name}>{item.label}</option>
      );
    });

    var streamControls = streams.map((item) => {
      return (
        <div className="stream-controls">
          <h2>{item.name}</h2>
          <a className="close" onClick={this.removeStream.bind(this, item)}>Close</a>
        </div>
      );
    });

    var csOptions = {
      'multi-stream': true,
      'menu-open': this.state.controlsOpen,
      'menu-closed': !this.state.controlsOpen
    };
    if (this.state.currentChatLayout) {
      csOptions['chat-' + this.state.currentChatLayout] = true;
    }

    var multiStreamClasses = ClassSet(csOptions);
    return (
      <div className={multiStreamClasses}>
        <div className="controls">
          <h1>Multi Twitch</h1>
          <div className="global-options">
            <select value={this.state.currentChatLayout} onChange={this.changeChatLayout}>
              {chatLayoutOptions}
            </select>
          </div>
          <TwitchSearch streams={this.state.streams} addStream={this.addStream} />
          <div className="stream-controls-wrapper">
            {streamControls}
          </div>
          <a className="control-toggle" onClick={this.toggleControls}>Toggle controls</a>
        </div>
        <div className="streams">
          {twitchBlocks}
        </div>
      </div>
    );
  }

});

module.exports = twitchMultiStream;
