import React from 'react';
import classNames from 'classnames';
import DropdownMenu from './dropdownMenu.jsx';
import TwitchAPI from '../../twitchAPI.js';
const api = new TwitchAPI();

export default class TwitchControls extends React.Component {

     constructor(props) {
         super(props);
         this.state = {
            matchingItems: [],
            searchValue: '',
            searching: false,
        };
        this.searchInput = React.createRef();
        this.autocomplete = React.createRef();
    }

    hideMenu() {
        this.setState({
            matchingItems: [],
            searching: false,
        });
    }

    search() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            var searchTerms = this.searchInput.current.value;
            if (!searchTerms) return this.hideMenu();
            var options = {
                'query': searchTerms
            };

            this.setState({
                searching: true,
            });
            api.get('search/channels', options).then((data) => {
                if (!this.state.searching) return;
                this.setState({
                    searching: false,
                    matchingItems: JSON.parse(JSON.stringify(data.channels)),
                });
            });
        }, 300)
    }

    keyDownHandler(e) {
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.autocomplete.current.highlightNext();
                break;
            case 'ArrowUp':
                e.preventDefault();
                this.autocomplete.current.highlightPrevious();
                break;
            case 'Enter':
                this.chooseItem(this.searchInput.current.value);
                break;
            case 'Escape':
                this.hideMenu();
                break
            default:
                this.search();
        }
    }

    autoCompleteFocusHandler(item) {
        this.searchInput.current.value = item.name;
    }

    chooseItem(item) {
        this.hideMenu();
        if (this.props.clearOnSelect) {
            this.searchInput.current.value = '';
        } else {
            this.searchInput.current.value = item.name;
        }
        this.props.selectItemHandler(item.name);
    }

    render() {
        const {
            matchingItems,
        } = this.state;
        var placeholderText = this.props.placeholder || 'Search';
        return (
            <div className="TwitchSearch">
                <input className="TwitchSearch__input"
                    type="text"
                    ref={this.searchInput}
                    placeholder={placeholderText}
                    onKeyDown={this.keyDownHandler.bind(this)}
                />
                <div className={classNames('TwitchSearch__autocomplete', {'TwitchSearch__autocomplete--hidden': !matchingItems.length})}>
                    <DropdownMenu ref={this.autocomplete}
                        items={matchingItems}
                        highlightHandler={this.autoCompleteFocusHandler.bind(this)}
                        selectItemHandler={this.chooseItem.bind(this)}
                    />
                </div>
            </div>
        );
    }
}
