'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import ReactPaginate from 'react-paginate';
import c from 'classnames';

import { environment } from '../config';

import Dropdown from './dropdown';

export default class DisplayTable extends React.Component {
  render () {
    return (
      <React.Fragment>
        <table className='table table--zebra'>
          <thead>
            <tr>
              {this.props.headings.map(h => <th key={h.id}>{h.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {this.props.rows.map(row => (
              <tr key={row.id}>
                {this.props.headings.map(h => <td key={`${row.id}-${h.id}`}>{row[h.id]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination-wrapper'>
          <ReactPaginate
            previousLabel={<span>previous</span>}
            nextLabel={<span>next</span>}
            breakLabel={<span className='pages__page'>...</span>}
            pageCount={Math.ceil(this.props.pageCount)}
            forcePage={this.props.page}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.props.onPageChange}
            containerClassName={'pagination'}
            subContainerClassName={'pages'}
            pageClassName={'pages__wrapper'}
            pageLinkClassName={'pages__page'}
            activeClassName={'active'} />
        </div>
      </React.Fragment>
    );
  }
}

if (environment !== 'production') {
  DisplayTable.propTypes = {
    onPageChange: T.func,
    headings: T.array,
    rows: T.array,
    pageCount: T.number,
    page: T.number
  };
}

export class SortHeader extends React.PureComponent {
  render () {
    const {id, title, sort, onClick} = this.props;
    const onSortClick = (e) => {
      e.preventDefault();
      onClick();
    };
    const cl = c('table__sort', {
      'table__sort--none': sort.field !== id,
      'table__sort--asc': sort.field === id && sort.direction === 'asc',
      'table__sort--desc': sort.field === id && sort.direction === 'desc'
    });
    return (
      <a href='#' title={`Sort by ${title}`} className={cl} onClick={onSortClick}>{title}</a>
    );
  }
}

if (environment !== 'production') {
  SortHeader.propTypes = {
    id: T.string,
    title: T.string,
    sort: T.shape({
      field: T.string,
      direction: T.string
    }),
    onClick: T.func
  };
}

export class FilterHeader extends React.PureComponent {
  render () {
    const {id, title, options, onSelect, filter} = this.props;
    const onFilterClick = (option, e) => {
      e.preventDefault();
      onSelect(option.value);
    };
    return (
      <Dropdown
        id={id}
        triggerClassName='drop__toggle--caret'
        triggerActiveClassName='active'
        triggerText={title}
        triggerTitle={`Filter by ${title}`}
        triggerElement='a'
        direction='down'
        alignment='center' >
        <ul className='drop__menu drop__menu--select' role='menu'>
          {options.map(o => <li key={o.value}>
            <a href='#' title={`Filter by ${title} - ${o.label}`} className={c('drop__menu-item', {'drop__menu-item--active': filter === o.value})} data-hook='dropdown:close' onClick={onFilterClick.bind(this, o)}>{o.label}</a>
          </li>)}
        </ul>
      </Dropdown>
    );
  }
}

if (environment !== 'production') {
  FilterHeader.propTypes = {
    id: T.string,
    title: T.string,
    options: T.arrayOf(
      T.shape({
        value: T.string,
        label: T.string
      })
    ),
    filter: T.string,
    onSelect: T.func
  };
}
