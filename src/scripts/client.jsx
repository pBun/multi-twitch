import 'normalize.css';
import qs from 'qs';
import '../styles/index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import TwitchMultiStream from './components/twitchMultiStream.jsx';

const urlData = qs.parse(window.location.search.replace('?', ''));
ReactDOM.render(
    <TwitchMultiStream
        streams={urlData.streams.split(',')}
        layout={urlData.layout}
    />,
    document.getElementById('multi-stream')
);
