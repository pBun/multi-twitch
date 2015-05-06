var React = require('react');
var TwitchSearch = require('babel!./twitchSearch.jsx');

var twitchAddStream = React.createClass({

  render: function() {
    return (
      <div>
        <TwitchSearch streams={this.props.streams} addStream={this.props.addStream} />
      </div>
    );
  }

});

module.exports = twitchAddStream;
