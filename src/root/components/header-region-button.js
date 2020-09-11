
import React from 'react';
import Dropdown from './common/dropdown';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { regionsByIdSelector, regionByIdOrNameSelector } from '../selectors';
import { connect } from 'react-redux';

// const regionArray = Object.keys(regions).map(k => regions[k]);

class HeaderRegionButton extends React.Component {
  construct () {
    this.decideTriggerClassName = this.decideTriggerClassName.bind(this);
  }

  decideTriggerClassName (currentPath) {
    let className = 'drop__toggle--caret';

    if (currentPath.path.includes('/region')) {
      className += ' navbar-highlighted';
    }

    return className;
  }

  render () {
    const { id, currentPath, regions = {}, thisRegion } = this.props;
    const title = thisRegion ? thisRegion.label : 'Regions';
    const triggerClassName = this.decideTriggerClassName(currentPath);
    const regionLinks = Object.values(regions).map(r => {
      r = r[0];
      return {
        to: `/regions/${r.id}`,
        text: r.label
      };
    });
    return (
      <Dropdown
        id={id}
        triggerClassName={triggerClassName}
        triggerActiveClassName='active'
        triggerText={title}
        triggerTitle={`View ${title}`}
        triggerElement='a'
        direction='down'
        alignment='center' >
        <ul className='drop__menu' role='menu'>
          {regionLinks.map(o => (
            <li key={o.to}><Link to={o.to} className='drop__menu-item' title={`View ${o.text}`} data-hook='dropdown:close'>{o.text}</Link></li>
          ))}
        </ul>
      </Dropdown>
    );
  }
}

if (environment !== 'production') {
  HeaderRegionButton.propTypes = {
    id: T.string,
    currentPath: T.object
  };
}

const selector = (state, ownProps) => ({
  regions: regionsByIdSelector(state),
  thisRegion: ownProps.currentPath.url.includes('/regions') ? regionByIdOrNameSelector(state, ownProps.currentPath.params['id']) : null
});

const dispatcher = dispatch => ({});

export default connect(selector, dispatcher)(HeaderRegionButton);
