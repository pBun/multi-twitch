var React = require('react');
var classNames = require('classnames');

export default class TwitchStream extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            channel: props.stream.name,
            embedId: 'embed-' + props.stream.id
        };
        this.handleStreamEvent = this.handleStreamEvent.bind(this);
        this.mute = this.mute.bind(this);
        this.unmute = this.unmute.bind(this);
    }

    componentDidMount() {
        var options = {
            width: 640,
            height: 400,
            channel: this.state.channel,
        };

        var player = this.state.player = new Twitch.Player(this.state.embedId, options);

        var self = this;
        player.addEventListener('ready', function() {
            if (self.props.activeStream.id === self.props.stream.id) {
                self.unmute();
            } else {
                self.mute();
            }
            player.play();
        });
    }

    mute() {
        var player = this.state.player;
        if (!player) return;
        player.setMuted(true);
    }

    unmute() {
        var player = this.state.player;
        if (!player) return;
        player.setMuted(false);
    }

    handleStreamEvent(data) {
        data.forEach((event) => {
            if (event.event === 'videoPlaying') {
                if (this.props.activeStream.id === this.props.stream.id) {
                    this.unmute();
                } else {
                    this.mute();
                }
            }
        });
    }

    render() {
        const isFocused = this.props.activeStream.id === this.props.stream.id;
        return (
            <div className={classNames('TwitchStream', {
                'TwitchStream--focused': isFocused,
                'TwitchStream--notFocused': !isFocused,
            })}>
                <div id={this.state.embedId} />
            </div>
        );
    }

}
