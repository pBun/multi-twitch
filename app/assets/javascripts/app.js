var React = require('react');

var TwitchMultiStream = require('babel!./components/twitchMultiStream.jsx');

React.render(
  React.createElement(
    TwitchMultiStream
  ),
  document.getElementById('multi-stream')
);
