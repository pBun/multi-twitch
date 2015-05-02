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
    var autocomplete = this.refs.autocomplete.getDOMNode();
    var searchValue = this.refs.searchInput.getDOMNode().value;

    if (!searchValue) {
      this.hideMenu();
      return;
    }

    api.get('search/streams', {'query': searchValue}).then((data) => {
      var suggestions = [];
      for (var stream of data.streams) {
        suggestions.push(stream.channel.name);
      }

      if (!suggestions.length) {
        this.hideMenu();
      } else {
        this.showMenu();
      }

      this.setState({matchingItems: suggestions});
    });
  },

  /**
   * Input box text has changed, trigger update of the autocomplete box.
  **/
  changeInput: function() {


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
          placeholder="Chanel name"
          onKeyDown={this.keyInput}
          onChange={this.changeInput} />

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
