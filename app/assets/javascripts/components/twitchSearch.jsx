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
       items:  this.props.items,
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
    this.setState({matchingItems: []});
    removeClass(autocomplete, 'menu-open');
    addClass(autocomplete, 'menu-hidden');
  },
  showMenu: function() {
    var autocomplete = this.refs.autocomplete.getDOMNode();
    removeClass(autocomplete, 'menu-hidden');
    addClass(autocomplete, 'menu-open');
  },
  /**
   * Input box text has changed, trigger update of the autocomplete box.
  **/
  changeInput: function () {
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

      this.setState({items: suggestions, matchingItems: suggestions});
    });

  },
  selectAutoComplete: function (e) {
    var autocomplete = this.refs.autocomplete.getDOMNode();
    var result = e.target.innerHTML;
    this.hideMenu();
    // this.refs.searchInput.getDOMNode().value = result;
    this.props.addStream(result);
  },
  render: function(){

    var items = this.state.matchingItems.map(function (item) {
      return (
        <li>
          <a onClick={this.selectAutoComplete}>
            {item}
          </a>
        </li>
      );
    }.bind(this));

    return (
      <div className="react-search">
        <input type="text" className="input-text" ref="searchInput" onChange={this.changeInput} />

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
