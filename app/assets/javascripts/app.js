var React = require('react');
var TwitchMultiStream = require('babel!./components/twitchMultiStream.jsx');

var urlStreams = window.location.hash.replace('#', '').trim();
urlStreams = urlStreams ? urlStreams.split('&') : [];
React.render(
  React.createElement(
    TwitchMultiStream,
    {streams:urlStreams}
  ),
  document.getElementById('multi-stream')
);
