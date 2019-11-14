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
  if (props.perForm.getPerCountries.data.results) {
    props.perForm.getPerCountries.data.results.forEach(country => {
      const societyName = country.society_name ? country.society_name : country.name + ' NS';
      countryOptions.push(<option value={country.id} key={'persociety' + country.id}>{societyName}</option>);
    });
  }

  const formButtons = [
    {
      link: 'policy-strategy/',
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

  const delPerDraft = (draftId) => {
    props._deletePerDraft({ id: draftId });
  }

  const createRegionGroupedDocumentData = () => {
    const groupedDocuments = {};
    if (props.perOverviewForm.fetched) {
      console.log('start', props.perOverviewForm.data.results)
      props.perOverviewForm.data.results.forEach((perOverviewForm) => {
        perOverviewForm.formType = 'overview';
        if (perOverviewForm.country.region === null || perOverviewForm.country.region === '') {
          perOverviewForm.country.region = -1;
        }
        if (!groupedDocuments.hasOwnProperty(perOverviewForm.country.region)) {
          groupedDocuments[perOverviewForm.country.region] = { [perOverviewForm.country.id]: [] };
          groupedDocuments[perOverviewForm.country.region][perOverviewForm.country.id].push(perOverviewForm);
        } else {
          if (!groupedDocuments[perOverviewForm.country.region].hasOwnProperty(perOverviewForm.country.id)) {
            groupedDocuments[perOverviewForm.country.region][perOverviewForm.country.id] = [];
          }
          groupedDocuments[perOverviewForm.country.region][perOverviewForm.country.id].push(perOverviewForm);
        }
      });
    }
    if (props.perForm.getPerDocuments.fetched && !!props.perForm.getPerDocuments.data && !!props.perForm.getPerDocuments.data.results) {
      props.perForm.getPerDocuments.data.results.forEach(document => {
        if (document.country !== null) {
          if (document.country.region === null) {
            document.country.region = -1;
          }
          document.formType = 'per';
          if (!groupedDocuments.hasOwnProperty(document.country.region)) {
            groupedDocuments[document.country.region] = { [document.country.id]: [] };
            groupedDocuments[document.country.region][document.country.id].push(document);
          } else {
            if (!groupedDocuments[document.country.region].hasOwnProperty(document.country.id)) {
              groupedDocuments[document.country.region][document.country.id] = [];
            }
            groupedDocuments[document.country.region][document.country.id].push(document);
          }
        }
      });
    }
    return groupedDocuments;
  }

  // const documents = renderPerFormDocuments(createRegionGroupedDocumentData());
  console.log('finish', createRegionGroupedDocumentData());

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
