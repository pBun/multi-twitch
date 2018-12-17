import 'normalize.css';
import qs from 'qs';
import '../styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import TwitchMultiStream from './components/twitchMultiStream.jsx';

const urlData = qs.parse(window.location.search.replace('?', ''));
const streams = urlData.streams ? urlData.streams.split(',') : [];
ReactDOM.render(
    <TwitchMultiStream
        streams={streams}
        layout={urlData.layout}
    />,
    document.getElementById('multi-stream')
);
