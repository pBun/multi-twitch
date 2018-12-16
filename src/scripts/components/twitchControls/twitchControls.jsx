import React from 'react';
import TwitchSearch from './twitchSearch.jsx';

export default class TwitchControls extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chatLayouts: [{
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
            ]
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
        const { chatLayouts } = this.state;
        const chatLayoutOptions = chatLayouts.map((item) => {
            return (
                <option key={item.name} value={item.name}>{item.label}</option>
            );
        });
        const streamControls = streams.map((item) => {
            return (
                <div key={item.id} className="stream-item">
                    <h3 className="stream-name">{item.name}</h3>
                    <a className="close" onClick={this.clickStreamClose.bind(this, item)}>Close</a>
                </div>
            );
        });


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
                            {streamControls}
                        </div>
                        <div className="chat-controls">
                            <div className="control-section">
                                <select value={this.props.currentChatLayout}
                                    onChange={this.props.changeChatLayout}
                                >{chatLayoutOptions}</select>
                            </div>
                        </div>
                    </div>
                </div>

                <a className="control-toggle"
                    onClick={this.props.toggleControls}
                >Toggle controls</a>

            </div>
        );
    }

}
