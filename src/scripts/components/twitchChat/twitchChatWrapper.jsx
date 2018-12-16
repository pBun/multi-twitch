import React from 'react';

import TwitchChat from './twitchChat.jsx';

class ChatTab extends React.PureComponent {
    render() {
        const { stream, isActive, clickHandler } = this.props;
        return (
            <li key={stream.id} role="tab"
                className={isActive ? 'active' : 'inactive'}
                aria-selected={isActive ? 'true' : 'false'}
                aria-expanded={isActive ? 'true' : 'false'}
            >
                <a className="tab-inner" onClick={clickHandler}>{stream.name}</a>
            </li>
        );
    }
}

class ChatPanel extends React.PureComponent {
    render() {
        const { stream, isActive } = this.props;
        return (
            <div key={stream.id} role="tabpanel"
                className={isActive ? 'active' : 'inactive'}
            >
                <TwitchChat stream={stream} />
            </div>
        );
    }
}

export default class TwitchChatWrapper extends React.Component {

    constructor(props) {
        super(props);
        this.chatWrapper = React.createRef();
        this.chatPanels = React.createRef();
        this.chatTabs = React.createRef();
        this.updateChatSize = this.updateChatSize.bind(this);
    }

    componentDidUpdate() {
        this.updateChatSize();
    }

    componentDidMount() {
        this.updateChatSize();
        window.addEventListener('resize', this.updateChatSize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateChatSize);
    }

    updateChatSize() {
        var chatWrapper = this.chatWrapper.current;
        var chatPanels = this.chatPanels.current;
        var chatTabs = this.chatTabs.current;
        var newHeight = chatWrapper.clientHeight - chatTabs.offsetHeight;
        chatPanels.style.height = newHeight + 'px';
    }

    render() {
        const { streams, activeStream, setActiveStream } = this.props;

        return (
            <div className="twitch-chat" ref={this.chatWrapper}>
                <ul role="tablist" ref={this.chatTabs}>
                    {streams.map((item) => (
                        <ChatTab
                            key={item.name}
                            stream={item}
                            isActive={item === activeStream}
                            clickHandler={setActiveStream.bind(this, item)}
                        />
                    ))}
                </ul>
                <div className="chat-panels" ref={this.chatPanels}>
                    {streams.map((item) => (
                        <ChatPanel
                            key={item.name}
                            stream={item}
                            isActive={item === activeStream}
                        />
                    ))}
                </div>
            </div>
        );
    }
}
