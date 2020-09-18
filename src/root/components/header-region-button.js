import React from 'react';
import DropdownMenu from './dropdown-menu';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { regionsByIdSelector, regionByIdOrNameSelector } from '../selectors';
import { connect } from 'react-redux';
import LanguageContext from '#root/languageContext';

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
    const { strings } = this.context; 
    const { currentPath, regions = {}, thisRegion } = this.props;
    const title = thisRegion ? thisRegion.label : strings.menuRegions;
    const triggerClassName = this.decideTriggerClassName(currentPath);
    const regionLinks = Object.values(regions).map(r => {
      r = r[0];
      return {
        to: `/regions/${r.id}`,
        text: r.label
      };
    });
    return (
      <DropdownMenu
        className={triggerClassName}
        label={
          <span title={`View ${title}`}>
            { title }
          </span>
        }
        dropdownContainerClassName='header-menu-dropdown'
      >
        <ul className='drop__menu' role='menu'>
          {regionLinks.map(o => (
            <li key={o.to}>
              <Link to={o.to} className='drop__menu-item' title={`View ${o.text}`}>
                {o.text}
              </Link>
            </li>
          ))}
        </ul>
      </DropdownMenu>
    );
  }
}

if (environment !== 'production') {
  HeaderRegionButton.propTypes = {
    id: T.string,
    currentPath: T.object
  };
}

HeaderRegionButton.contextType = LanguageContext;

const selector = (state, ownProps) => ({
  regions: regionsByIdSelector(state),
  thisRegion: ownProps.currentPath.url.includes('/regions') ? regionByIdOrNameSelector(state, ownProps.currentPath.params['id']) : null
});

const dispatcher = dispatch => ({});

export default connect(selector, dispatcher)(HeaderRegionButton);
