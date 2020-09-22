import React, { useState, useContext } from 'react';
import { connect } from 'react-redux';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import {
  getPerCountries,
  getPerDraftDocument,
  getPerDocuments,
  deletePerDraft,
  getPerOverviewFormStrict as getPerOverviewForm
} from '#actions';
import PerDraftDocuments from './per-drafts';
import PerDocuments from './per-documents';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { regionsByIdSelector } from '../../selectors';

const RESULT_TYPES = {
  COUNTRY: 1,
  CLUSTER: 2,
  REGION: 3,
  COUNTRY_OFFICE: 4,
  REPRESENTATIVE_OFFICE: 5
};

const PerAccountTab = props => {
  const [chosenCountry, setChosenCountry] = useState({ id: 0, society_name: '' });

  const { strings } = useContext(LanguageContext);

  const changeChosenCountry = e => {
    let filteredCountry = props.perForm.getPerCountries.data.results.filter(country => country.id === parseInt(e.target.value));
    setChosenCountry({ id: filteredCountry[0].id, society_name: filteredCountry[0].society_name });
  };

  const countryOptions = [];
  const { results } = props.perForm.getPerCountries.data;
  if (results) {
    const filteredResults = results
      .filter(country => country.record_type === RESULT_TYPES.COUNTRY);
    filteredResults
      .forEach(country => {
        const societyName = country.society_name ? country.society_name : country.name + ' NS';
        countryOptions.push(<option value={country.id} key={'persociety' + country.id}>{societyName}</option>);
      });
    if (chosenCountry.id === 0) {
      setChosenCountry({id: filteredResults[0].id, society_name: filteredResults[0].society_name});
    }
  }

  const formButtons = [
    {
      link: 'policy-strategy',
      title: strings.perAccountPoliceStrategy,
    },
    {
      link: 'analysis-and-planning',
      title: strings.perAccountAnalysis,
    },
    {
      link: 'operational-capacity',
      title: strings.perAccountOperationalCapacity,
    },
    {
      link: 'operational-capacity-2',
      title: strings.perAccountOperationalCapacity2,
    },
    {
      link: 'coordination',
      title: strings.perAccountCoordination,
    },
    {
      link: 'operations-support',
      title: strings.perAccountSupport,
    }
  ];

  return (
    <div className='fold-container'>
      <section className='fold' id='per-forms'>
        <div className='inner'>
          <h2 className='fold__title margin-reset'>
            <Translate stringId='perAccountTitle'/>
          </h2>
          <hr />
          <p>
            <Translate stringId='perAccountDescription'/>
          </p>
          <br />
          <div className='row flex-xs'>
            <div className='col col-5-xs col-3-mid'>
              <span className='form__label'><Translate stringId='perAccountChooseCountry'/></span>
            </div>
            <div className='col col-7-xs col-9-mid'>
              <select onChange={changeChosenCountry}>
                {countryOptions}
              </select>
            </div>
          </div>
          <br /><br />
          <div className='text-center'>
            <Link
              to={`/per-forms/overview/${chosenCountry.id}`}
              className='button button--medium button--secondary-bounded'>
              <Translate stringId='perAccountOverview'/>
            </Link>
          </div>
          <div className='row flex-xs'>
            {formButtons.map(button => (
              <div key={button.title} className='per__form__col col col-6-xs col-4-mid'>
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
          <h2 className='fold__title margin-reset'>
            <Translate stringId='perAccountActiveForms'/>
          </h2>
          <hr />
          <PerDocuments
            perForm={props.perForm}
            perOverviewForm={props.perOverviewForm}
            regionsById={props.regionsById}
          />
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
  perOverviewForm: state.perForm.getPerOverviewForm,
  regionsById: regionsByIdSelector(state),
});

const dispatcher = (dispatch) => ({
  _getPerCountries: (...args) => dispatch(getPerCountries(...args)),
  _getPerDocuments: (...args) => dispatch(getPerDocuments(...args)),
  _deletePerDraft: (...args) => dispatch(deletePerDraft(...args)),
  _getPerDraftDocument: (...args) => dispatch(getPerDraftDocument(...args)),
  _getPerOverviewForm: (...args) => dispatch(getPerOverviewForm(...args))
});
export default connect(selector, dispatcher)(PerAccountTab);
