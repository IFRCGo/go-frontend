import React, { useState } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { environment } from '../../config';
import {
  getPerCountries,
  getPerDraftDocument,
  getPerDocuments,
  deletePerDraft,
  getPerOverviewFormStrict as getPerOverviewForm
} from '../../actions';

const PerAccountTab = props => {
  const [chosenCountry, setChosenCountry] = useState({ id: 0, society_name: '' });

  const changeChosenCountry = e => {
    let filteredCountry = props.perForm.getPerCountries.data.results.filter(country => country.id === parseInt(e.target.value));
    setChosenCountry({ chosenCountry: { id: filteredCountry[0].id, society_name: filteredCountry[0].society_name } });
  };

  const countryOptions = [];
  if (props.perForm.getPerCountries.fetched && typeof props.perForm.getPerCountries.data.results !== 'undefined' && props.perForm.getPerCountries.data.results !== null) {
    props.perForm.getPerCountries.data.results.forEach(country => {
      const societyName = country.society_name !== null && country.society_name.trim() !== '' ? country.society_name : country.name + ' NS';
      countryOptions.push(<option value={country.id} key={'persociety' + country.id}>{societyName}</option>);
    });
  }

  const formButtons = [
    {
      link: '/per-forms/policy-strategy/' + chosenCountry.id,
      title: 'Area 1: Policy and Standards'
    },
    {
      link: '/per-forms/analysis-and-planning/' + chosenCountry.id,
      title: 'Area 2: Analysis and Planning'
    },
    {
      link: '/per-forms/operational-capacity/' + chosenCountry.id,
      title: 'Area 3: Operational capacity'
    },
    {
      link: '/per-forms/operational-capacity-2/' + chosenCountry.id,
      title: 'Area 3: Operational capacity 2'
    },
    {
      link: '/per-forms/coordination/' + chosenCountry.id,
      title: 'Area 4: Coordination'
    },
    {
      link: '/per-forms/operations-support/' + chosenCountry.id,
      title: 'Area 5: Operations support'
    }
  ];

  return (
    <div className='fold-container'>
      <section className='fold' id='per-forms'>
        <div className='inner'>
          <h2 className='fold__title margin-reset'>New PER Forms</h2>
          <hr />
          <p>Click on the following links to access the PER forms, where you can select individual National Societies.</p>
          <br />
          Choose National Society:&nbsp;
          <select onChange={changeChosenCountry}>
            {countryOptions}
          </select><br /><br />
          <div className='text-center'>
            <Link
              to={'/per-forms/overview/' + chosenCountry.id}
              className='button button--medium button--secondary-bounded'>
              Overview
            </Link>
          </div>
          <div className='clearfix'>
            {formButtons.map(button => (
              <div className='per__form__col'>
                <Link
                  to={button.link}
                  className='button button--medium button--secondary-bounded'
                >
                  {button.title}
                </Link>
              </div>
            ))}
          </div>
          <br /><br />
          <h2 className='fold__title margin-reset'>Active PER Forms</h2>
          <hr />
          {/* <span className='text-semi-bold'>{documents}</span>
          {this.renderDraftDocuments()} */}
        </div>
      </section>
    </div>
  );
};

if (environment !== 'production') {
  PerAccountTab.propTypes = {
    perForm: T.object,
    history: T.object,
    location: T.object,
    perOverviewForm: T.object,
    _deletePerDraft: T.func,
    _getPerCountries: T.func,
    _getPerDocuments: T.func,
    _getPerDraftDocument: T.func,
    _getPerOverviewForm: T.func,
  };
}

// /////////////////////////////////////////////////////////////////// //
// Connect functions

const selector = (state, ownProps) => ({
  perForm: state.perForm,
  perOverviewForm: state.perForm.getPerOverviewForm

});

const dispatcher = (dispatch) => ({
  _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  _getPerDocuments: (...args) => dispatch(getPerDocuments(...args)),
  _deletePerDraft: (...args) => dispatch(deletePerDraft(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});
export default connect(selector, dispatcher)(PerAccountTab);
