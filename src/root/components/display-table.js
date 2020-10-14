import React from 'react';
import { PropTypes as T } from 'prop-types';
import ReactPaginate from 'react-paginate';
import c from 'classnames';

import { resolveToString } from '#utils/lang';
import { environment } from '#config';
import languageContext from '#root/languageContext';

import DropdownMenu from './dropdown-menu';

export default class DisplayTable extends React.Component {
  renderTbody () {
    const { strings } = this.context;
    if (this.props.rows.length) {
      return this.props.rows.map(row => {
        // If the raw has a `rowOverride` property that is used as override.
        if (row.rowOverride) {
          return <React.Fragment key={row.rowOverride}>{row.rowOverride}</React.Fragment>;
        }

        return (
          <tr key={row.id}>
            {this.props.headings.map(h => {
              // Allow the column to be an object.
              // When it's an object additional properties, besides value will
              // be automatically passed to the `td` element
              const key = `${row.id}-${h.id}`;

              if (row[h.id] !== null && typeof row[h.id] === 'object' && !Array.isArray(row[h.id]) && !React.isValidElement(row[h.id])) {
                const {className, value, ...rest} = row[h.id];
                return <td key={key} className={c(`table__cell--${h.id}`, className)} {...rest}>{value}</td>;
              } else {
                return <td key={key} className={`table__cell--${h.id}`}>{row[h.id]}</td>;
              }
            })}
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={this.props.headings.length}>{this.props.emptyMessage || strings.noDataMessage}</td>
        </tr>
      );
    }
  }

  renderPagination () {
    if (this.props.rows.length && !this.props.noPaginate && this.props.pageCount > 1) {
      return (
        <div className='pagination-wrapper pagination-wrapper--table'>
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
      );
    } else {
      return null;
    }
  }

  render () {
    const showHeader = !!this.props.showHeader;
    return (
      <React.Fragment>
        <table className={this.props.className}>
          {showHeader
            ? (
              <thead>
                <tr>
                  {this.props.headings.map(h => {
                    const {id, className, label, ...rest} = h;
                    const activeHeader = label.props && label.props.isActive ? 'table__header--active' : null;
                    return <th key={id} className={c(`table__header--${id}`, className, activeHeader)} {...rest}>{label}</th>;
                  })}
                </tr>
              </thead>
            )
            : null}
          <tbody>
            {this.renderTbody()}
          </tbody>
        </table>
        {this.renderPagination()}
      </React.Fragment>
    );
  }
}

if (environment !== 'production') {
  DisplayTable.propTypes = {
    onPageChange: T.func,
    className: T.string,
    headings: T.array,
    rows: T.array,
    emptyMessage: T.string,
    pageCount: T.number,
    page: T.number,
    noPaginate: T.bool
  };
}

DisplayTable.contextType = languageContext;
DisplayTable.defaultProps = {
  className: 'table table--border-bottom'
};

export class SortHeader extends React.PureComponent {
  render () {
    const { strings } = this.context;
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
      <a href='#' title={resolveToString(strings.displayTableSortHeaderTooltip, { title: title || '' })} className={cl} onClick={onSortClick}>{title}</a>
    );
  }
}

SortHeader.contextType = languageContext;

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
    const { strings } = this.context;
    const { title, options, onSelect, filter} = this.props;

    const onFilterClick = (option, e) => {
      e.preventDefault();
      onSelect(option.value);
    };

    return (
      <DropdownMenu
        className="drop__toggle--caret"
        activeClassName="active"
        label={
          <span title={resolveToString(strings.displayTableFilterHeaderLabelTooltipText, { title })}>
            { title }
          </span>
        }
      >
        <ul className='drop__menu drop__menu--select' role='menu'>
          {options.map((o, i) => (
            <li key={`${o.value} - ${i}`}>
              <a
                href='#'
                title={resolveToString(strings.displayTableFilterHeaderOptionTooltipText, { title, label: o.label || '' })}
                className={c('drop__menu-item button', {'drop__menu-item--active': filter === o.value})}
                onClick={onFilterClick.bind(this, o)}
              >
                {o.label}
              </a>
            </li>
          ))}
        </ul>
      </DropdownMenu>
    );
  }
}

FilterHeader.contextType = languageContext;

if (environment !== 'production') {
  FilterHeader.propTypes = {
    id: T.string,
    title: T.string,
    options: T.arrayOf(
      T.shape({
        value: T.oneOfType([T.string, T.number]),
        label: T.string
      })
    ),
    filter: T.oneOfType([T.string, T.number]),
    onSelect: T.func
  };
}
