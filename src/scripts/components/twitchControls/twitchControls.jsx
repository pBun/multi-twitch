import React from 'react';
import classNames from 'classnames';
import TwitchSearch from './twitchSearch.jsx';

const CHAT_LAYOUTS = [{
        'label': 'Chat on side',
        'name': 'side'
    },
    {
        'label': 'Active chat stream only',
        'name': 'focus'
    },
    {
        'label': 'No chat',
        'name': 'hidden'
    },
    {
        'label': 'Chat inline',
        'name': 'block'
    }
];

class ChatLayoutSelect extends React.PureComponent {
    render() {
        const { currentChatLayout, changeChatLayout } = this.props;
        return (
            <select className="ChatLayoutSelect" value={currentChatLayout}
                onChange={changeChatLayout}
            >{CHAT_LAYOUTS.map((item) => (
                <option key={item.name} value={item.name}>{item.label}</option>
            ))}</select>
        )
    }
}

class ActiveStreamListItem extends React.PureComponent {
    render() {
        const { stream, streamCloseHandler } = this.props;
        return (
            <a key={stream.id} className="ActiveStreamListItem" onClick={streamCloseHandler}>
                <span className="ActiveStreamListItem__name">{stream.name}</span>
            </a>
        );
    }
}

export default class TwitchControls extends React.PureComponent {
    render() {
        const { streams } = this.props;
        return (
            <div className="MainControls">
                <div className="MainControls__inner">
                    <div className="StreamControls MainControls__section">
                        <h1 className="MainControls__headline"> Multi Twitch < /h1>
                        <div className="StreamControls__add">
                            <TwitchSearch
                                streams={this.props.streams}
                                selectItemHandler={this.props.addStream}
                                placeholder="Add a channel"
                            />
                        </div>
                        <div className="ActiveStreamList">
                            {streams.map((item) => (
                                <ActiveStreamListItem
                                    key={item.id}
                                    stream={item}
                                    streamCloseHandler={this.props.removeStream.bind(this, item)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="ChatControls MainControls__section">
                        <ChatLayoutSelect
                            currentChatLayout={this.props.currentChatLayout}
                            changeChatLayout={this.props.changeChatLayout}
                        />
                    </div>
                </div>
                <a className="ControlToggle"
                    onClick={this.props.toggleControls}
                ><span className="ControlToggle__text">menu</span></a>
            </div>
        );
    }

}
