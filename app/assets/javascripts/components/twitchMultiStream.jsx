var React = require('react');

var TwitchControls = require('babel!./twitchControls/twitchControls.jsx');
var TwitchStream = require('babel!./twitchStream.jsx');
var TwitchChatWrapper = require('babel!./twitchChat/twitchChatWrapper.jsx');

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
      currentChatLayout: 'side'
    }
  },

  componentDidUpdate: function() {
    this.updateHash();
  },

  updateHash: function() {
    var streamNames = this.state.streams.map((stream) => {
      return stream.name;
    });
    window.location.hash = streamNames.join('&');
  },

  setActiveStream: function(stream) {
    this.setState({activeStream: stream});
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
    this.setState({
      streams: streams,
      activeStream: activeStream != stream ? activeStream :
        streams.length ? streams[0] : null,
      defaultWidth: defaultWidth
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
    var twitchBlockHeight = numTwitchBlocks <= 1 ? 100 : numTwitchBlocks <= 4 ? 50 : numTwitchBlocks <= 9 ? 33.3333 : 25;
    var twitchBlockStyles = {
      width: twitchBlockWidth + '%',
      height: twitchBlockHeight + '%'
    };
    var twitchBlocks = streams.map((item) => {
      return (
        <div key={item.id} className="twitch-block stream" style={twitchBlockStyles}>
          <div className="twitch-block-inner">
            <TwitchStream stream={item} />
          </div>
        </div>
      );
    });
    twitchBlocks.push(
      <div key="chat" className="twitch-block chat" style={twitchBlockStyles}>
        <div className="twitch-block-inner">
          <TwitchChatWrapper
            streams={this.state.streams}
            activeStream={this.state.activeStream}
            setActiveStream={this.setActiveStream} />
        </div>
      </div>
    );

    var noStreamMessage;
    if (streams.length < 1) {
      noStreamMessage = (<p className="no-streams-message">Click on the '+' to start adding streams</p>);
    }

    var multiStreamClasses = [
      'multi-stream',
      'chat-' + this.state.currentChatLayout,
      this.state.controlsOpen ? 'menu-open' : 'menu-closed'
    ].join(' ');

    return (
      <div className={multiStreamClasses}>
        <TwitchControls
          toggleControls={this.toggleControls}
          streams={this.state.streams}
          addStream={this.addStream}
          removeStream={this.removeStream}
          currentChatLayout={this.state.currentChatLayout}
          changeChatLayout={this.changeChatLayout}/>
        <div className="streams">
          {twitchBlocks}
        </div>
        {noStreamMessage}
      </div>
    );
  }

});

module.exports = twitchMultiStream;
