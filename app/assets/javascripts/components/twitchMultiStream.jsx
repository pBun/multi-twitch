var React = require('react');

var Search = require('babel!./twitchSearch.jsx');

var twitchMultiStream = React.createClass({

  getInitialState: function() {
    return {
      streams: []
    }
  },

  addStream: function(stream) {
    var streams = this.state.streams.slice();
    streams.push(stream);
    this.setState({streams: streams})
  },

  render: function() {

    var items = this.state.streams.map(function (item) {
      return (
        <li>{item}</li>
      );
    }.bind(this));

    return (
      <div>
        <Search streams={this.state.streams} addStream={this.addStream} />
        <ul>
          {items}
        </ul>
      </div>
    );
  }

});

module.exports = twitchMultiStream;
