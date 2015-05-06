var React = require('react');
var TwitchAPI = require('../twitchAPI.js');
var api = new TwitchAPI();

var twitchSearchByStream = React.createClass({

  getInitialState: function() {

    return {
      channels: [],
      game: ''
    }

  },

  update: function() {

    clearTimeout(this.props.searchTimeout);
    this.props.searchTimeout = setTimeout(() => {

      var searchTerms = this.props.currentSearch = this.refs.searchInput.getDOMNode().value;

      if (!searchTerms) {
        this.hideMenu();
        return;
      }

      var options = {
        'query': searchTerms
      };

      this.setState({searching: true});
      api.get('search/streams', options).then((data) => {

        if (!this.props.currentSearch) {
          return;
        }

        var channels = data.streams.map((stream) => {
          return stream.channel;
        });

        this.setState({channels: channels, searching: false});

      });

    }, 300)
  },

  keyInput: function(e) {

    if (e.key === 'Enter') {
      this.selectAutoComplete(this.refs.searchInput.getDOMNode().value);
      return;
    }

    this.update();

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

  clickChannel: function(channel) {
    this.props.selectItem(channel);
  },

  render: function() {

    var isSearching = this.state.searching;
    var doneSearching = !isSearching && typeof this.state.searching != 'undefined';
    var resultsEmpty = this.state.channels.length < 1;

    var items = this.state.channels.map(function(item) {
      return (
        <li key={item.name} className={this.state.focus === item ? 'focus' : ''}>
          <a onClick={this.clickChannel.bind(this, item.name)}>
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
        <div className="twitch-search">
          <input type="text"
            className="input-text"
            ref="searchInput"
            placeholder="Search live streams"
            onKeyDown={this.keyInput} />
        </div>
        <ul className="channel-list">
          {loading}
          {items}
        </ul>
      </div>
    );
  }

});

module.exports = twitchSearchByStream;
