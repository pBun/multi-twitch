import React from 'react';
import TwitchSearch from './twitchSearch.jsx';

const CHAT_LAYOUTS = [{
        'label': 'Default',
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
            <select value={currentChatLayout}
                onChange={changeChatLayout}
            >{CHAT_LAYOUTS.map((item) => (
                <option key={item.name} value={item.name}>{item.label}</option>
            ))}</select>
        )
    }
}

class StreamListItem extends React.PureComponent {
    render() {
        const { stream, streamCloseHandler } = this.props;
        return (
            <div key={stream.id} className="stream-item">
                <h3 className="stream-name">{stream.name}</h3>
                <a className="close" onClick={streamCloseHandler}>Close</a>
            </div>
        );
    }
}

export default class TwitchControls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            searchEnabled: false,
            searchType: null,
        };
        this.enableSearch = this.enableSearch.bind(this);
        this.disableSearch = this.disableSearch.bind(this);
        this.selectSearchResult = this.selectSearchResult.bind(this);
        this.clickStreamClose = this.clickStreamClose.bind(this);
    }

    enableSearch(searchType) {
        this.setState({
            searchEnabled: true,
            searchType: searchType
        });
    }

    disableSearch() {
        this.setState({
            searchEnabled: false
        });
    }

    selectSearchResult(stream) {
        this.props.addStream(stream);
        this.disableSearch();
    }

    clickStreamClose(stream) {
        this.props.removeStream(stream);
    }

    render() {
        const { streams } = this.props;
        var controlClasses = [
            'controls',
            this.state.searchEnabled ? 'search-enabled' : 'search-disabled',
            this.state.searchType + '-search'
        ].join(' ');
        return (
            <div className={controlClasses}>
                <div className="inner-controls-wrap">
                    <div className="main-controls">
                        <div className="stream-controls control-section">
                            <h1 className="site-headline"> Multi Twitch < /h1>
                            <div className="add-stream-wrapper">
                                <TwitchSearch
                                    streams={this.props.streams}
                                    selectItem={this.props.addStream}
                                    placeholder="Add a channel"
                                />
                            </div>
                            {streams.map((item) => (
                                <StreamListItem
                                    key={item.id}
                                    stream={item}
                                    streamCloseHandler={this.clickStreamClose.bind(this, item)}
                                />
                            ))}
                        </div>
                        <div className="chat-controls">
                            <div className="control-section">
                                <ChatLayoutSelect
                                    currentChatLayout={this.props.currentChatLayout}
                                    changeChatLayout={this.props.changeChatLayout}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <a className="control-toggle"
                    onClick={this.props.toggleControls}
                ><span className="control-text">menu</span></a>

            </div>
        );
    }

}
