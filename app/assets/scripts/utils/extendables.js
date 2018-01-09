'use strict';
import React from 'react';

// Extendable components to add common functionalities.

// The SFPComponent adds handling for page change, filter change and sort change.
// All the functions expect the first parameter to be "what is being dealt with"
// and will update a corresponding state.
// It expects a state like:
// what: {
//  page: 1,
//  filters: {
//    name: 'value'
//  },
//  sort: {
//    field: '',
//    direction: 'asc'
//  }
// }
//
// After the state is updates a function updateData is called with "what"
// triggered the update.
export class SFPComponent extends React.Component {
  handlePageChange (what, page) {
    let state = this.state[what];
    state = Object.assign({}, state, { page: page.selected + 1 });

    this.setState({ [what]: state }, () => {
      if (this.updateData) {
        this.updateData(what);
      } else {
        console.warn('Method updateData not implemented.');
      }
    });
  }

  handleFilterChange (what, field, value) {
    let state = this.state[what];
    state = {
      ...state,
      page: 1,
      filters: {
        ...state.filters,
        [field]: value
      }
    };
    this.setState({ [what]: state }, () => {
      if (this.updateData) {
        this.updateData(what);
      } else {
        console.warn('Method updateData not implemented.');
      }
    });
  }

  handleSortChange (what, field) {
    let state = this.state[what];
    state = {
      ...state,
      page: 1,
      sort: {
        field,
        direction: state.sort.field === field && state.sort.direction === 'asc'
          ? 'desc'
          : 'asc'
      }
    };

    this.setState({ [what]: state }, () => {
      if (this.updateData) {
        this.updateData(what);
      } else {
        console.warn('Method updateData not implemented.');
      }
    });
  }
}
