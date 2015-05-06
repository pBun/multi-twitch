var React = require('react');
var TwitchAPI = require('./twitchAPI.js');
var api = new TwitchAPI();
var TwitchSearch = require('babel!./twitchSearch.jsx');

var twitchSearchByGame = React.createClass({

  getInitialState: function() {

    return {
      channels: [],
      game: ''
    }

  },

  listGames: function(game) {

    if (!game) {
      return;
    }

    api.get('search/streams', {'query': game, 'limit': 100}).then((data) => {

      var channels = data.streams.map((stream) => {
        if (stream.game === game && stream.channel) {
          return stream.channel;
        }
      }).filter((channel) => { return channel; });

      this.setState({
        game: game,
        channels: channels
      });

    });
  },

  clickChannel: function(e) {
    var item = e.target.innerHTML;
    this.props.selectItem(item);
  },

  render: function() {

    var items = this.state.channels.map(function(item) {
      return (
        <li className={this.state.focus === item ? 'focus' : ''}>
          <a onClick={this.clickChannel}>
            <img className="avatar" src={item.logo} />
            <span className="title">{item.status}</span>
            <span className="label">{item.display_name}</span>
          </a>
        </li>
      );
    }.bind(this));

    return (
      <div className="search-by-game">
        <TwitchSearch streams={this.props.streams} selectItem={this.listGames} twitchSearchType="games" />
        <ul className="channel-list">
          {items}
        </ul>
      </div>
    );
  }

});

module.exports = twitchSearchByGame;
