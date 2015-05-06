var React = require('react');
var TwitchAPI = require('../twitchAPI.js');
var api = new TwitchAPI();
var TwitchSearch = require('babel!./twitchSearch.jsx');

var twitchSearchByGame = React.createClass({

  getInitialState: function() {

    return {
      channels: [],
      game: ''
    }

  },

  getChannels: function(game) {

    if (!game) {
      return;
    }

    this.setState({searching: true});
    api.get('search/streams', {'query': game, 'limit': 100}).then((data) => {

      var channels = data.streams.map((stream) => {
        if (stream.game === game && stream.channel) {
          return stream.channel;
        }
      }).filter((channel) => { return channel; });

      this.setState({
        game: game,
        channels: channels,
        searching: false
      });

    });
  },

  clickChannel: function(channel) {
    this.props.selectItem(channel);
  },

  render: function() {

    var isSearching = this.state.searching;
    var doneSearching = !isSearching && typeof this.state.searching != 'undefined';
    var resultsEmpty = this.state.channels.length < 1;

    var items = this.state.channels.map(function(item) {
      return (
        <li className={this.state.focus === item ? 'focus' : ''}>
          <a key={item.name} onClick={this.clickChannel.bind(this, item.name)}>
            <div className="image-wrapper">
              <img className="avatar" src={item.logo} />
            </div>
            <h3 className="name">{item.display_name}</h3>
            <p className="title">{item.status}</p>
          </a>
        </li>
      );
    }.bind(this));

    var loading = isSearching ? (<span className="loading">Loading...</span>) : null;
    var noItems = doneSearching && resultsEmpty ? (<span className="no-channels">No channels found =(</span>) : null;

    return (
      <div className="channel-search">
        <TwitchSearch
          streams={this.props.streams}
          selectItem={this.getChannels}
          twitchSearchType="games"
          placeholder="Game name"
          clearOnSelect={false} />
        <ul className="channel-list">
          {loading}
          {noItems}
          {items}
        </ul>
      </div>
    );
  }

});

module.exports = twitchSearchByGame;
