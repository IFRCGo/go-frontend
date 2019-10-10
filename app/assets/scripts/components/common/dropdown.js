'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import TetherComponent from 'react-tether';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      open: false
    };

    this._bodyListener = this._bodyListener.bind(this);
    this._toggleDropdown = this._toggleDropdown.bind(this);
  }

  _bodyListener (e) {
    // Get the dropdown that is a parent of the clicked element. If any.
    let theSelf = e.target;
    if (theSelf.tagName === 'BODY' ||
        theSelf.tagName === 'HTML' ||
        e.target.getAttribute('data-hook') === 'dropdown:close') {
      this.close();
      return;
    }

    // If the trigger element is an "a" the target is the "span", but it is a
    // button, the target is the "button" itself.
    // This code handles this case. No idea why this is happening.
    // TODO: Unveil whatever black magic is at work here.
    if (theSelf.tagName === 'SPAN' &&
        theSelf.parentNode === this.triggerRef &&
        theSelf.parentNode.getAttribute('data-hook') === 'dropdown:btn') {
      return;
    }
    if (theSelf.tagName === 'SPAN' &&
        theSelf.parentNode.getAttribute('data-hook') === 'dropdown:close') {
      this.close();
      return;
    }

    if (theSelf && theSelf.getAttribute('data-hook') === 'dropdown:btn') {
      if (theSelf !== this.triggerRef) {
        this.close();
      }
      return;
    }

    do {
      if (theSelf && theSelf.getAttribute('data-hook') === 'dropdown:content') {
        break;
      }
      theSelf = theSelf.parentNode;
    } while (theSelf && theSelf.tagName !== 'BODY' && theSelf.tagName !== 'HTML');

    if (theSelf !== this.dropdownRef) {
      this.close();
    }
  }

  _toggleDropdown (e) {
    e.preventDefault();
    this.toggle();
  }

  // Lifecycle method.
  // Called once as soon as the component has a DOM representation.
  componentDidMount () {
    window.addEventListener('click', this._bodyListener);
  }

  // Lifecycle method.
  componentWillUnmount () {
    window.removeEventListener('click', this._bodyListener);
  }

  toggle () {
    this.setState({ open: !this.state.open });
  }

  open () {
    !this.state.open && this.setState({ open: true });
  }

  close () {
    this.state.open && this.setState({ open: false });
  }

  renderTriggerElement () {
    const {
      id,
      triggerTitle,
      triggerText,
      triggerClassName,
      triggerActiveClassName,
      triggerElement: TriggerElement
    } = this.props;

    let triggerKlasses = ['drop__toggle'];
    let triggerProps = {
      onClick: this._toggleDropdown,
      'data-hook': 'dropdown:btn',
      ref: el => { this.triggerRef = el; }
    };

    if (triggerClassName) {
      triggerKlasses.push(triggerClassName);
    }

    if (this.state.open && triggerActiveClassName) {
      triggerKlasses.push(triggerActiveClassName);
    }

    triggerProps.className = triggerKlasses.join(' ');

    // Additional trigger props.
    if (TriggerElement === 'button') {
      triggerProps.type = 'button';
    } else {
      triggerProps.href = '#';
      if (id) {
        triggerProps.href += id;
      }
    }
    if (triggerTitle) {
      triggerProps.title = triggerTitle;
    }

    return (
      <TriggerElement {...triggerProps} >
        <span>{ triggerText }</span>
      </TriggerElement>
    );
  }

  renderContent () {
    const { id, direction, className } = this.props;

    // Base and additional classes for the trigger and the content.
    let klasses = ['drop__content', 'drop__content--react', `drop-trans--${direction}`];
    let dropdownContentProps = {
      ref: el => { this.dropdownRef = el; },
      'data-hook': 'dropdown:content'
    };

    if (className) {
      klasses.push(className);
    }

    dropdownContentProps.className = klasses.join(' ');

    if (id) {
      dropdownContentProps.id = id;
    }

    return (
      <TransitionGroup appear={true}>
        {this.state.open && (
          <CSSTransition
            component='div'
            classNames='drop-trans'
            timeout={{ enter: 300, exit: 300 }}>

            <TransitionItem
              props={dropdownContentProps}
              onChange={this.props.onChange} >
              { this.props.children }
            </TransitionItem>

          </CSSTransition>
        )}
      </TransitionGroup>
    );
  }

  render () {
    let { alignment, direction, isClosingDropdown } = this.props;
    if (isClosingDropdown) {
      this.close();
    }

    if (direction === 'left' || direction === 'right') {
      if (alignment !== 'center') {
        console.error(`Dropdown: alignment "${alignment}" is not supported. Defaulting to "center"`);
      }
      // When left and right "center" becomes "middle".
      alignment = 'middle';
    }

    let tetherAttachment;
    let tetherTargetAttachment;
    switch (direction) {
      case 'up':
        tetherAttachment = `bottom ${alignment}`;
        tetherTargetAttachment = `top ${alignment}`;
        break;
      case 'down':
        tetherAttachment = `top ${alignment}`;
        tetherTargetAttachment = `bottom ${alignment}`;
        break;
      case 'right':
        tetherAttachment = `${alignment} left`;
        tetherTargetAttachment = `${alignment} right`;
        break;
      case 'left':
        tetherAttachment = `${alignment} right`;
        tetherTargetAttachment = `${alignment} left`;
        break;
    }

    return (
      <TetherComponent
        attachment={tetherAttachment}
        targetAttachment={tetherTargetAttachment}
        constraints={[{
          to: 'scrollParent',
          attachment: 'together'
        }]}>
        {this.renderTriggerElement()}
        {this.renderContent()}
      </TetherComponent>
    );
  }
}

Dropdown.defaultProps = {
  triggerElement: 'button',
  direction: 'down',
  alignment: 'center'
};

if (process.env.NODE_ENV !== 'production') {
  Dropdown.propTypes = {
    id: T.string,
    onChange: T.func,

    triggerElement: T.oneOf(['a', 'button']),
    triggerClassName: T.string,
    triggerActiveClassName: T.string,
    triggerTitle: T.string,
    triggerText: T.string.isRequired,
    isClosingDropdown: T.bool.isRequired,

    direction: T.oneOf(['up', 'down', 'left', 'right']),
    alignment: T.oneOf(['left', 'center', 'right']),

    className: T.string,
    children: T.node
  };
}

class TransitionItem extends React.Component {
  componentDidMount () {
    this.props.onChange && this.props.onChange(true);
  }

  componentWillUnmount () {
    this.props.onChange && this.props.onChange(false);
  }

  render () {
    return <div {...this.props.props}>{ this.props.children }</div>;
  }
}

if (process.env.NODE_ENV !== 'production') {
  TransitionItem.propTypes = {
    onChange: T.func,
    props: T.object,
    children: T.node
  };
}
