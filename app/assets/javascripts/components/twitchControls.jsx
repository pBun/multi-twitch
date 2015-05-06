var React = require('react');
var ClassSet = React.addons.classSet;
var TwitchSearch = require('babel!./twitchSearch.jsx');
var TwitchSearchByGame = require('babel!./twitchSearchByGame.jsx');

var twitchControls = React.createClass({

  getInitialState: function() {

    return {
      chatLayouts: [
        {'label': 'Chat on side', 'name': 'side'},
        {'label': 'Chat hidden', 'name': 'hidden'},
        {'label': 'Chat inline', 'name': 'block'}
      ]
    }

  },

  toggleAddStream: function() {
    this.setState({
      addingStream: !this.state.addingStream
    });
  },

  render: function() {

    var streams = this.props.streams;

    var chatLayoutOptions = this.state.chatLayouts.map((item) => {
      return (
        <option value={item.name}>{item.label}</option>
      );
    });


    var streamControls = streams.map((item) => {
      return (
        <div className="stream-controls">
          <h3 className="stream-name">{item.name}</h3>
          <a className="close" onClick={this.props.removeStream.bind(this, item)}>Close</a>
        </div>
      );
    });

    var csOptions = {
      'controls': true,
      'adding-stream': this.state.addingStream
    };
    var controlClasses = ClassSet(csOptions);

    return (
      <div className={controlClasses}>

        <div className="inner-controls-wrap">
          <div className="main-controls">
            <h1 className="site-headline">Multi Twitch</h1>
            <div className="control-section">
              <h2 className="section-headline">Options</h2>
              <select value={this.props.currentChatLayout} onChange={this.props.changeChatLayout}>
                {chatLayoutOptions}
              </select>
              <TwitchSearch streams={this.props.streams} selectItem={this.props.addStream} />
              <a className="secondary-toggle" onClick={this.toggleAddStream}>Search by game</a>
            </div>
            <div className="control-section">
              <h2 className="section-headline">Active Streams</h2>
              {streamControls}
            </div>
          </div>

          <div className="secondary-controls">
            <div className="control-section">
              <h2 className="section-headline">Add Stream</h2>
              <TwitchSearchByGame streams={this.props.streams} selectItem={this.props.addStream} />
            </div>
            <a className="secondary-toggle" onClick={this.toggleAddStream}>Back to main controls</a>
          </div>
        </div>

        <a className="control-toggle" onClick={this.props.toggleControls}>Toggle controls</a>

      </div>
    );
  }

});

module.exports = twitchControls;
