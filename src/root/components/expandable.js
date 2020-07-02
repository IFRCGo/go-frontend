import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';
import LanguageContext from '#root/languageContext';
class Expandable extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      expanded: false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle (e) {
    e.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  }

  render () {
    const { text, limit, sectionClass } = this.props;
    const { expanded } = this.state;
    const { strings } = this.context;
    const out = expanded ? text
      : text && text.length > limit ? text.slice(0, limit) : text;
    const link = expanded ? strings.expandableShowLess : strings.expandableShowMore;
    return (
      <React.Fragment>
        <span className={sectionClass || ''} dangerouslySetInnerHTML={{__html: out}} />
        {this.state.expanded ? null : '...'} <a href='#' onClick={this.toggle}>{link}</a>
      </React.Fragment>
    );
  }
}

Expandable.contextType = LanguageContext;
if (environment !== 'production') {
  Expandable.propTypes = {
    limit: T.number,
    text: T.string
  };
}

export default Expandable;
