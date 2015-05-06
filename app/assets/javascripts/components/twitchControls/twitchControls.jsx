var React = require('react');
var TwitchSearch = require('babel!./twitchSearch.jsx');
var TwitchSearchByGame = require('babel!./twitchSearchByGame.jsx');
var TwitchSearchByStream = require('babel!./twitchSearchByStream.jsx');

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

  enableSearch: function(searchType) {
    this.setState({
      searchEnabled: true,
      searchType: searchType
    });
  },

  disableSearch: function() {
    this.setState({
      searchEnabled: false
    });
  },

  selectSearchResult: function(stream) {
    this.props.addStream(stream);
    this.disableSearch();
  },

  render: function() {

    var streams = this.props.streams;

    var chatLayoutOptions = this.state.chatLayouts.map((item) => {
      return (
        <option key={item.name} value={item.name}>{item.label}</option>
      );
    });


    var streamControls = streams.map((item) => {
      return (
        <div key={item.id} className="stream-item">
          <h3 className="stream-name">{item.name}</h3>
          <a className="close" onClick={this.props.removeStream.bind(this, item)}>Close</a>
        </div>
      );
    });


    var controlClasses = [
      'controls',
      this.state.searchEnabled ? 'search-enabled' : 'search-disabled',
      this.state.searchType + '-search'
    ].join(' ');

    return (
      <div className={controlClasses}>

        <div className="inner-controls-wrap">
          <div className="main-controls">
            <div className="stream-controls control-section">
              <h1 className="site-headline">Multi Twitch</h1>
              <div className="add-stream-wrapper">
                <TwitchSearch
                  streams={this.props.streams}
                  selectItem={this.props.addStream}
                  placeholder="Add a channel" />
                <p className="hint">
                  <a className="secondary-toggle" onClick={this.enableSearch.bind(this, 'game')}>search games</a>
                  |
                  <a className="secondary-toggle" onClick={this.enableSearch.bind(this, 'stream')}>search streams</a>
                </p>
              </div>
              {streamControls}
            </div>
            <div className="chat-controls">
              <div className="control-section">
                <select value={this.props.currentChatLayout} onChange={this.props.changeChatLayout}>
                  {chatLayoutOptions}
                </select>
              </div>
            </div>
          </div>

          <div className="search-controls">
            <div className="game-search">
              <TwitchSearchByGame streams={this.props.streams} selectItem={this.selectSearchResult} />
            </div>
            <div className="stream-search">
              <TwitchSearchByStream streams={this.props.streams} selectItem={this.selectSearchResult} />
            </div>
            <a className="secondary-toggle" onClick={this.disableSearch}>Back to main controls</a>
          </div>
        </div>

        <a className="control-toggle" onClick={this.props.toggleControls}>Toggle controls</a>

      </div>
    );
  }

});

module.exports = twitchControls;
