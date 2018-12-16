import React from 'react';
import TwitchAPI from '../../twitchAPI.js';
const api = new TwitchAPI();

var removeClass = function(el, className) {
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
};

var addClass = function(el, className) {
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
};

/**
 * Search module
 * A simple search box component.
 **/

 export default class TwitchControls extends React.Component {

     constructor(props) {
         super(props);
         this.state = {
            api: new TwitchAPI(),
            matchingItems: [],
            searchValue: '',
            placeholder: this.props.placeholder || 'Search',
            clearOnSelect: typeof this.props.clearOnSelect !== 'undefined' ? this.props.clearOnSelect : true,
            twitchSearchType: this.props.twitchSearchType || 'channels'
        };
        this.searchInput = React.createRef();
        this.autocomplete = React.createRef();
        this.hideMenu = this.hideMenu.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.updateSuggestions = this.updateSuggestions.bind(this);
        this.update = this.update.bind(this)
        this.keyInput = this.keyInput.bind(this);
        this.clickAutoComplete = this.clickAutoComplete.bind(this);
        this.focusAutoComplete = this.focusAutoComplete.bind(this);
        this.selectAutoComplete = this.selectAutoComplete.bind(this);
    }

    hideMenu() {
        this.searching = false;
        var autocomplete = this.autocomplete.current;
        this.setState({
            matchingItems: [],
            focus: null
        });
        removeClass(autocomplete, 'menu-open');
        addClass(autocomplete, 'menu-hidden');
    }

    showMenu() {
        var autocomplete = this.autocomplete.current;
        removeClass(autocomplete, 'menu-hidden');
        addClass(autocomplete, 'menu-open');
    }

    updateSuggestions(items) {
        var suggestions = [];
        for (var item of items) {
            suggestions.push(item.name);
        }

        if (!suggestions.length) {
            this.hideMenu();
        } else {
            this.showMenu();
        }

        this.setState({
            matchingItems: suggestions
        });
    }

    update() {

        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {

            var searchTerms = this.searchInput.current.value;
            this.searching = true;

            if (!searchTerms) {
                this.hideMenu();
                return;
            }

            var searchType = this.state.twitchSearchType;
            var options = {
                'query': searchTerms
            };
            if (searchType === 'games') {
                options.type = 'suggest';
            }

            api.get('search/' + searchType, options).then((data) => {

                if (!this.searching) {
                    return;
                }

                this.searching = false;

                var results = searchType === 'games' ? data.games : data.channels;
                this.updateSuggestions(results);

            });

        }, 300)
    }

    keyInput(e) {

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            var focus = this.state.focus;
            if (!focus) {
                var startNum = e.key === 'ArrowDown' ? 0 : this.state.matchingItems.length - 1;
                focus = this.state.matchingItems[startNum];
            } else {
                var mod = e.key === 'ArrowDown' ? 1 : -1;
                focus = this.state.matchingItems[this.state.matchingItems.indexOf(focus) + mod];
            }
            this.searchInput.current.value = focus || '';
            this.setState({
                focus: focus
            });
            return;
        }

        if (e.key === 'Enter') {
            this.selectAutoComplete(this.state.focus || this.searchInput.current.value);
            return;
        }

        if (e.key === 'Escape') {
            this.hideMenu();
            return;
        } else {
            this.update();
        }

    }

    clickAutoComplete(e) {
        var result = e.target.innerHTML;
        this.selectAutoComplete(result);
    }

    focusAutoComplete(e) {
        var result = e.target.innerHTML;
        this.setState({
            focus: result
        });
    }

    selectAutoComplete(item) {
        var autocomplete = this.autocomplete.current;
        this.hideMenu();
        if (this.state.clearOnSelect) {
            this.searchInput.current.value = '';
        } else {
            this.searchInput.current.value = item;
        }
        this.props.selectItem(item);
    }

    render() {

        var placeholderText = this.props.placeholder || 'Search';

        var items = this.state.matchingItems.map((item) => {
            return (
                <li key={item} className={this.state.focus === item ? 'focus' : ''}>
                    <a onClick={this.clickAutoComplete} onMouseOver={this.focusAutoComplete} onFocus={this.focusAutoComplete}>
                        {item}
                    </a>
                </li>
            );
        });

        return (
            <div className="twitch-search">
                <input type="text"
                    className="input-text"
                    ref={this.searchInput}
                    placeholder={this.state.placeholder}
                    onKeyDown={this.keyInput}
                />
                <div className="menu menu-hidden" ref={this.autocomplete}>
                    <ul>{items}</ul>
                </div>
            </div>
        );
    }
}
