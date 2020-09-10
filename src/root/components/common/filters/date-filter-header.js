import React from 'react';
import { PropTypes as T } from 'prop-types';
import { environment } from '#config';

import Dropdown from '#components/common/dropdown';
import DropdownMenu from '#components/dropdown-menu';

export default class DateFilterHeader extends React.PureComponent {
  constructor () {
    super();
    this.state = {
      startDate: null,
      endDate: null,
      setDate: null,
      isClosingDropdown: false
    };
    this.resetDateStatus = this.resetDateStatus.bind(this);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount () {
    this.setState({
      startDate: this.props.filter.startDate,
      endDate: this.props.filter.endDate
    });
  }

  resetDateStatus () {
    this.setState({
      isClosingDropdown: false
    });
  }

  applyPeriodFilter () {
    this.props.onSelect({'startDate': this.state.startDate, 'endDate': this.state.endDate});
    this.setState({ isClosingDropdown: true });
    this.state.startDate && this.state.endDate ? (
      this.setState({ setDate: `${this.state.startDate} - ${this.state.endDate}` })
    ) : (
      this.setState({ setDate: null })
    );
  }

  changeStartDate (e) {
    this.setState({'startDate': e.target.value});
  }

  changeEndDate (e) {
    this.setState({'endDate': e.target.value});
  }

  render () {
    const {id, title, featureType} = this.props;
    const mapStyle = 'form__control--medium form__control form__control--data_select form__control--brand form__control--filter';
    const tableStyle = 'drop__toggle--caret';
    /*
    <Dropdown
      id={id}
      triggerClassName={featureType === 'map' ? mapStyle : tableStyle}
      triggerActiveClassName='active'
      triggerText={this.state.setDate || title}
      triggerTitle={`Filter by ${title}`}
      triggerElement='a'
      isClosingDropdown={this.state.isClosingDropdown}
      resetDateStatus={this.resetDateStatus}
      direction='down'
      alignment='center'>
      <ul className='drop__menu drop__menu--select drop__menu--date' role='menu'>
        <li className='global-spacing'>
          <label className='form__label form__label--small'>From</label>
          <input type="date" className='form__control form__control--brand' name="startdate" value={this.state.startDate}
            onChange={this.changeStartDate.bind(this)} />
        </li>
        <li className='global-spacing'>
          <label className='form__label form__label--small'>To</label>
          <input type="date" className='form__control form__control--brand' name="enddate" value={this.state.endDate}
            onChange={this.changeEndDate.bind(this)} />
        </li>
        <li className='global-spacing-h'>
          <p className='text-center'>
            <button
              className="button button--primary-bounded button--xsmall"
              onClick={this.applyPeriodFilter.bind(this)}
            >
            Apply
            </button>
          </p>
        </li>
      </ul>
    </Dropdown>
    */

    return (
      <DropdownMenu
        className={featureType === 'map' ? mapStyle : tableStyle}
        activeClassName='active'
        label={
          <span title={`Filter by ${title}`}>
            {this.state.setDate || title}
          </span>
        }
        persistant
      >
        <ul className='drop__menu drop__menu--select drop__menu--date' role='menu'>
          <li className='global-spacing'>
            <label className='form__label form__label--small'>From</label>
            <input type="date" className='form__control form__control--brand' name="startdate" value={this.state.startDate}
              onChange={this.changeStartDate.bind(this)} />
          </li>
          <li className='global-spacing'>
            <label className='form__label form__label--small'>To</label>
            <input type="date" className='form__control form__control--brand' name="enddate" value={this.state.endDate}
              onChange={this.changeEndDate.bind(this)} />
          </li>
          <li className='global-spacing-h'>
            <p className='text-center'>
              <button
                className="button button--primary-bounded button--xsmall"
                onClick={this.applyPeriodFilter.bind(this)}
              >
              Apply
              </button>
            </p>
          </li>
        </ul>
      </DropdownMenu>
    );
  }
}

if (environment !== 'production') {
  DateFilterHeader.propTypes = {
    id: T.string,
    title: T.string,
    filter: T.oneOfType([T.string, T.object]),
    onSelect: T.func,
    featureType: T.string
  };
}
