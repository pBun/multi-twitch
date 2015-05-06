var React = require('react');
var TwitchAPI = require('../twitchAPI.js');
var api = new TwitchAPI();

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

var Search = React.createClass({
  getInitialState: function(){
     return {
       api: new TwitchAPI(),
       matchingItems: [],
       searchValue: '',
       placeholder: this.props.placeholder || 'Search',
       clearOnSelect: typeof this.props.clearOnSelect !== 'undefined' ? this.props.clearOnSelect : true,
       twitchSearchType: this.props.twitchSearchType || 'channels'
     }
  },
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
  },
  hideMenu: function() {
    this.searching = false;
    var autocomplete = this.refs.autocomplete.getDOMNode();
    this.setState({matchingItems: [], focus: null});
    removeClass(autocomplete, 'menu-open');
    addClass(autocomplete, 'menu-hidden');
  },
  showMenu: function() {
    var autocomplete = this.refs.autocomplete.getDOMNode();
    removeClass(autocomplete, 'menu-hidden');
    addClass(autocomplete, 'menu-open');
  },

  updateSuggestions: function(items) {
    var suggestions = [];
    for (var item of items) {
      suggestions.push(item.name);
    }

    if (!suggestions.length) {
      this.hideMenu();
    } else {
      this.showMenu();
    }

    this.setState({matchingItems: suggestions});
  },

  update: function() {

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {

      var searchTerms = this.refs.searchInput.getDOMNode().value;
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
  },

  keyInput: function(e) {

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var focus = this.state.focus;
      if (!focus) {
        var startNum = e.key === 'ArrowDown' ? 0 : this.state.matchingItems.length -1;
        focus = this.state.matchingItems[startNum];
      } else {
        var mod = e.key === 'ArrowDown' ? 1 : -1;
        focus = this.state.matchingItems[this.state.matchingItems.indexOf(focus) + mod];
      }
      this.refs.searchInput.getDOMNode().value = focus || '';
      this.setState({focus: focus});
      return;
    }

    if (e.key === 'Enter') {
      this.selectAutoComplete(this.state.focus || this.refs.searchInput.getDOMNode().value);
      return;
    }

    if (e.key === 'Escape') {
      this.hideMenu();
      return;
    } else {
      this.update();
    }

  },
  clickAutoComplete: function(e) {
    var result = e.target.innerHTML;
    this.selectAutoComplete(result);
  },
  focusAutoComplete: function(e) {
    var result = e.target.innerHTML;
    this.setState({focus: result});
  },
  selectAutoComplete: function(item) {
    var autocomplete = this.refs.autocomplete.getDOMNode();
    this.hideMenu();
    if (this.state.clearOnSelect) {
      this.refs.searchInput.getDOMNode().value = '';
    } else {
      this.refs.searchInput.getDOMNode().value = item;
    }
    this.props.selectItem(item);
  },
  render: function(){

    var placeholderText = this.props.placeholder || 'Search';

    var items = this.state.matchingItems.map(function(item) {
      return (
        <li key={item} className={this.state.focus === item ? 'focus' : ''}>
          <a onClick={this.clickAutoComplete} onMouseOver={this.focusAutoComplete} onFocus={this.focusAutoComplete}>
            {item}
          </a>
        </li>
      );
    }.bind(this));

    return (
      <div className="twitch-search">
        <input type="text"
          className="input-text"
          ref="searchInput"
          placeholder={this.state.placeholder}
          onKeyDown={this.keyInput} />

        <div className="menu menu-hidden" ref="autocomplete">
          <ul>
          {items}
          </ul>
        </div>

      </div>
    );
  }
});

module.exports = Search;
