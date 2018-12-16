import React from 'react';

import TwitchControls from './twitchControls/twitchControls.jsx';
import TwitchStream from './twitchStream.jsx';
import TwitchChatWrapper from './twitchChat/twitchChatWrapper.jsx';

export default class TwitchMultiStream extends React.Component {

    constructor(props) {
        super(props);

        const streams = props.streams.map((stream, i) => ({
            id: Date.now() + i,
            name: stream,
            ref: React.createRef(),
        }));

        this.state = {
            streams: streams,
            activeStream: streams[0],
            currentChatLayout: 'side'
        };
        this.setActiveStream = this.setActiveStream.bind(this);
        this.focusAudio = this.focusAudio.bind(this);
        this.toggleControls = this.toggleControls.bind(this);
        this.addStream = this.addStream.bind(this);
        this.removeStream = this.removeStream.bind(this);
        this.changeChatLayout = this.changeChatLayout.bind(this);
    }

    componentDidUpdate() {
        this.updateHash();
    }

    updateHash() {
        const streamNames = this.state.streams.map((stream) => {
            return stream.name;
        });
        window.location.hash = streamNames.join('&');
    }

    addStream(stream) {
        var activeStream = this.state.activeStream;
        var streams = this.state.streams.slice();
        streams.push({
            id: Date.now(),
            name: stream,
            ref: React.createRef(),
        });
        this.setState({
            streams: streams,
            activeStream: activeStream || streams[0]
        });
    }

    removeStream(stream) {
        var streamIndex = this.state.streams.indexOf(stream);
        if (streamIndex < 0) return
        var activeStream = this.state.activeStream;
        var streams = this.state.streams.slice();
        streams.splice(streamIndex, 1);
        this.setState({
            streams: streams,
            activeStream: activeStream != stream ? activeStream :
            streams.length ? streams[0] : null
        });
    }

    focusAudio(targetStream) {
        this.state.streams.forEach((stream) => {
            if (targetStream.id === stream.id) {
                stream.ref.current.unmute();
            } else {
                stream.ref.current.mute();
            }
        });
    }

    toggleControls() {
        this.setState({
            controlsOpen: !this.state.controlsOpen
        });
    }

    changeChatLayout(e) {
        this.setState({
            currentChatLayout: e.target.value
        });
    }

    setActiveStream(stream) {
        this.focusAudio(stream);
        this.setState({activeStream: stream});
    }

    render() {
        const { streams, activeStream, currentChatLayout } = this.state;

        var numTwitchBlocks = streams.length + (currentChatLayout === 'block' ? 1 : 0);
        var twitchBlockWidth = numTwitchBlocks <= 2 ? 100 : numTwitchBlocks <= 4 ? 50 : numTwitchBlocks <= 9 ? 33.3333 : 25;
        var twitchBlockHeight = numTwitchBlocks <= 1 ? 100 : numTwitchBlocks <= 6 ? 50 : numTwitchBlocks <= 9 ? 33.3333 : 25;
        var twitchBlockStyles = {
            width: twitchBlockWidth + '%',
            height: twitchBlockHeight + '%'
        };
        var twitchBlocks = streams.map((item) => {
            return (
                <div key={item.id} className="twitch-block stream" style={twitchBlockStyles}>
                    <div className="twitch-block-inner">
                        <TwitchStream
                            stream={item}
                            activeStream={activeStream}
                            ref={item.ref} />
                    </div>
                </div>
            );
        });
        twitchBlocks.push(
            <div key="chat" className="twitch-block chat" style={twitchBlockStyles}>
                <div className="twitch-block-inner">
                <TwitchChatWrapper
                    streams={streams}
                    activeStream={activeStream}
                    setActiveStream={this.setActiveStream} />
                </div>
            </div>
        );

        var noStreamMessage;
        if (streams.length < 1) {
            noStreamMessage = (<p className="no-streams-message">Click on the '+' to start adding streams</p>);
        }

        var multiStreamClasses = [
            'multi-stream',
            'chat-' + currentChatLayout,
            this.state.controlsOpen ? 'menu-open' : 'menu-closed'
        ].join(' ');

        return (
            <div className={multiStreamClasses}>
                <TwitchControls
                    toggleControls={this.toggleControls}
                    streams={streams}
                    addStream={this.addStream}
                    removeStream={this.removeStream}
                    currentChatLayout={currentChatLayout}
                    changeChatLayout={this.changeChatLayout}/>
                <div className="streams">
                    {twitchBlocks}
                </div>
                {noStreamMessage}
            </div>
        )
    }
}
