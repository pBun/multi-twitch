import 'normalize.css';
import '../styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import TwitchMultiStream from './components/twitchMultiStream.jsx';

let urlStreams = window.location.hash.replace('#', '').trim();
urlStreams = urlStreams ? urlStreams.split('&') : [];
ReactDOM.render(
    <TwitchMultiStream
        streams={urlStreams}
    />,
    document.getElementById('multi-stream')
);
