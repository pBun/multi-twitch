import React from 'react';

export default class TwitchChat extends React.PureComponent {
    render() {
        const chatUrl = `http://twitch.tv/embed/${this.props.stream.name}/chat`;
        return (
            <div className="stream-chat embed-container">
                <iframe src={chatUrl} frameBorder="0" scrolling="no"></iframe>
            </div>
        );
    }
}
