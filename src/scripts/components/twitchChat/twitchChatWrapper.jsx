import React from 'react';
import classNames from 'classnames';

import TwitchChat from './twitchChat.jsx';

class ChatTab extends React.PureComponent {
    render() {
        const { stream, isActive, clickHandler } = this.props;
        return (
            <li
                className={classNames(
                    'ChatTab',
                    {
                        'ChatTab--active': isActive,
                        'ChatTab--inactive': !isActive,
                    },
                )}
                key={stream.id} role="tab"
            >
                <a className="ChatTab__inner" onClick={clickHandler}>{stream.name}</a>
            </li>
        );
    }
}

class ChatPanel extends React.PureComponent {
    render() {
        const { stream, isActive } = this.props;
        return (
            <div
                className={classNames(
                    'ChatPanel',
                    {
                        'ChatPanel--active': isActive,
                        'ChatPanel--inactive': !isActive,
                    },
                )}
                key={stream.id}
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
            <div className="TwitchChat" ref={this.chatWrapper}>
                <ul className="TwitchChat__tabs" ref={this.chatTabs}>
                    {streams.map((item) => (
                        <ChatTab
                            key={item.name}
                            stream={item}
                            isActive={item === activeStream}
                            clickHandler={setActiveStream.bind(this, item)}
                        />
                    ))}
                </ul>
                <div className="TwitchChat__chatPanels" ref={this.chatPanels}>
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
