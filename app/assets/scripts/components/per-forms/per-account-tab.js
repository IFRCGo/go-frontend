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
import PerDraftDocuments from './per-drafts';
import PerDocuments from './per-documents';

const RESULT_TYPES = {
  COUNTRY: 1,
  CLUSTER: 2,
  REGION: 3,
  COUNTRY_OFFICE: 4,
  REPRESENTATIVE_OFFICE: 5
};

const PerAccountTab = props => {
  const [chosenCountry, setChosenCountry] = useState({ id: 0, society_name: '' });

  const changeChosenCountry = e => {
    let filteredCountry = props.perForm.getPerCountries.data.results.filter(country => country.id === parseInt(e.target.value));
    setChosenCountry({ id: filteredCountry[0].id, society_name: filteredCountry[0].society_name });
  };

  const countryOptions = [];
  const { results } = props.perForm.getPerCountries.data;
  if (results) {
    results
      .filter(country => country.record_type === RESULT_TYPES.COUNTRY)
      .forEach(country => {
        const societyName = country.society_name ? country.society_name : country.name + ' NS';
        countryOptions.push(<option value={country.id} key={'persociety' + country.id}>{societyName}</option>);
      });
  }

  const formButtons = [
    {
      link: 'policy-strategy',
      title: 'Area 1: Policy and Standards'
    },
    {
      link: 'analysis-and-planning',
      title: 'Area 2: Analysis and Planning'
    },
    {
      link: 'operational-capacity',
      title: 'Area 3: Operational capacity'
    },
    {
      link: 'operational-capacity-2',
      title: 'Area 3: Operational capacity 2'
    },
    {
      link: 'coordination',
      title: 'Area 4: Coordination'
    },
    {
      link: 'operations-support',
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
              to={`/per-forms/overview/${chosenCountry.id}`}
              className='button button--medium button--secondary-bounded'>
              Overview
            </Link>
          </div>
          <div className='clearfix'>
            {formButtons.map(button => (
              <div key={button.title} className='per__form__col'>
                <Link
                  to={`/per-forms/${button.link}/${chosenCountry.id}`}
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
          <PerDocuments perForm={props.perForm} perOverviewForm={props.perOverviewForm}/>
          <PerDraftDocuments
            perForm={props.perForm}
            deletePerDraft={props._deletePerDraft}
          />
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
