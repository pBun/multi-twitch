import React from 'react';
import classNames from 'classnames';

import TwitchControls from './twitchControls/twitchControls.jsx';
import TwitchStream from './twitchStream.jsx';
import TwitchChatWrapper from './twitchChat/twitchChatWrapper.jsx';

class TwitchBlock extends React.PureComponent {
    render() {
        const { blockType, blockStyles, children } = this.props;
        return (
            <div className={classNames('TwitchBlock', `TwitchBlock--${blockType}`)} style={blockStyles}>
                <div className="TwitchBlock__inner">
                    {children}
                </div>
            </div>
        )
    }
}

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

    toggleControls(controlsState) {
        this.setState({
            controlsOpen: typeof controlsState === 'boolean'
                ? controlsState : !this.state.controlsOpen
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

        const numStreamBlocks = currentChatLayout === 'block' ? streams.length + 1
            : streams.length;
        const twitchBlockWidth = numStreamBlocks <= 2 ? 100 : numStreamBlocks <= 4 ? 50 : numStreamBlocks <= 9 ? 33.3333 : 25;
        const twitchBlockHeight = numStreamBlocks <= 1 ? 100 : numStreamBlocks <= 6 ? 50 : numStreamBlocks <= 9 ? 33.3333 : 25;
        const twitchBlockStyles = {
            width: twitchBlockWidth + '%',
            height: twitchBlockHeight + '%',
        };
        var twitchBlocks = streams.map((item) => {
            return (
                <TwitchBlock
                    key={item.id}
                    blockType="stream"
                    blockStyles={twitchBlockStyles}
                >
                    <TwitchStream
                        stream={item}
                        activeStream={activeStream}
                        ref={item.ref} />
                </TwitchBlock>
            );
        });
        twitchBlocks.push(
            <TwitchBlock
                key="chat"
                blockType="chat"
                blockStyles={twitchBlockStyles}
            >
                <TwitchChatWrapper
                    streams={streams}
                    activeStream={activeStream}
                    setActiveStream={this.setActiveStream} />
            </TwitchBlock>
        );

        var noStreamMessage;
        if (streams.length < 1) {
            noStreamMessage = (<p className="MultiStream__noStreams"> &lt; Click MENU to start adding streams</p>);
        }

        const chatId = `chat${currentChatLayout.charAt(0).toUpperCase()}${currentChatLayout.slice(1)}`;
        return (
            <div className={classNames(
                'MultiStream',
                `MultiStream--${chatId}`,
                {
                    'MultiStream--menuOpen': this.state.controlsOpen,
                    'MultiStream--menuClosed': !this.state.controlsOpen,
                }
            )}>
                <TwitchControls
                    toggleControls={this.toggleControls}
                    streams={streams}
                    addStream={this.addStream}
                    removeStream={this.removeStream}
                    currentChatLayout={currentChatLayout}
                    changeChatLayout={this.changeChatLayout}/>
                <div className="StreamList" onClick={this.toggleControls.bind(this, false)}>
                    {twitchBlocks}
                </div>
                {noStreamMessage}
            </div>
        )
    }
}
