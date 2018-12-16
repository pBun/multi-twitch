import React from 'react';
import classNames from 'classnames';

class DropdownLink extends React.PureComponent {
    render() {
        const {
            item,
            isHighlighted,
            clickHandler,
            mouseOverHandler,
            focusHandler
        } = this.props;
        const title = item.name === item.display_name
            ? item.name : `${item.name} (${item.display_name})`;
        const subtitle = `${item.status} | ${item.game}`;
        return (
            <a className={classNames('DropdownLink', { 'DropdownLink--highlighted': isHighlighted })}
                onClick={clickHandler.bind(this, item)}
                onMouseOver={mouseOverHandler.bind(this, item)}
                onFocus={focusHandler.bind(this, item)}
            >
                <span className="DropdownLink__image">
                    <img src={item.logo} />
                </span>
                <span className="DropdownLink__text">
                    <span className="DropdownLink__title">{title}</span>
                    <span className="DropdownLink__subtitle">{subtitle}</span>
                </span>
            </a>
        );
    }
}

export default class DropdownMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            focus: {},
        };
    }

    highlightNext() {
        const { items } = this.props;
        const curIndex = items.indexOf(this.state.focus);
        let targetIndex = curIndex > -1 ? curIndex + 1 : 0;
        targetIndex = targetIndex >= items.length ? 0 : targetIndex;
        const targetItem = items[targetIndex];
        this.highlightItem(targetItem);
    }

    highlightPrevious() {
        const { items } = this.props;
        const curIndex = items.indexOf(this.state.focus);
        const lastIndex = items.length - 1;
        let targetIndex = curIndex > -1 ? curIndex - 1 : lastIndex;
        targetIndex = targetIndex < 0 ? lastIndex : targetIndex;
        const targetItem = items[targetIndex];
        this.highlightItem(targetItem);
    }

    clickHandler() {
        this.props.selectItemHandler(this.state.focus);
    }

    highlightItem(item) {
        const newItem = item || {};
        this.setState({
            focus: newItem,
        });
        this.props.highlightHandler(newItem);
    }

    render() {
        const { items } = this.props;
        const { focus } = this.state;
        return (
            <div className="DropdownMenu">
                {items.map(item => (
                    <DropdownLink
                        item={item}
                        key={item._id}
                        isHighlighted={item._id === focus._id}
                        mouseOverHandler={this.highlightItem.bind(this, item)}
                        focusHandler={this.highlightItem.bind(this, item)}
                        clickHandler={this.clickHandler.bind(this)}
                    />
                ))}
            </div>
        );
    }
}
