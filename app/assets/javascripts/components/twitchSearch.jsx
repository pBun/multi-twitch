var React = require('react');
var TwitchAPI = require('./twitchAPI.js');
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
       searchValue: ''
     }
  },
  componentDidMount: function() {
  },
  componentWillUnmount: function() {
  },
  hideMenu: function() {
    var autocomplete = this.refs.autocomplete.getDOMNode();
    this.props.currentSearch = null;
    this.setState({matchingItems: [], focus: null});
    removeClass(autocomplete, 'menu-open');
    addClass(autocomplete, 'menu-hidden');
  },
  showMenu: function() {
    var autocomplete = this.refs.autocomplete.getDOMNode();
    removeClass(autocomplete, 'menu-hidden');
    addClass(autocomplete, 'menu-open');
  },

  update: function() {

    clearTimeout(this.props.searchTimeout);
    this.props.searchTimeout = setTimeout(() => {

      this.props.currentSearch = this.refs.searchInput.getDOMNode().value;

      if (!this.props.currentSearch) {
        this.hideMenu();
        return;
      }

      api.get('search/channels', {'query': this.props.currentSearch}).then((data) => {

        if (!this.props.currentSearch) {
          return;
        }

        var suggestions = [];
        for (var stream of data.channels) {
          suggestions.push(stream.name);
        }

        if (!suggestions.length) {
          this.hideMenu();
        } else {
          this.showMenu();
        }

        this.setState({matchingItems: suggestions});
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
    this.props.currentSearch = null;
    var autocomplete = this.refs.autocomplete.getDOMNode();
    this.hideMenu();
    this.refs.searchInput.getDOMNode().value = '';
    this.props.addStream(item);
  },
  render: function(){

    var items = this.state.matchingItems.map(function(item) {
      return (
        <li className={this.state.focus === item ? 'focus' : ''}>
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
          placeholder="Channel name"
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
