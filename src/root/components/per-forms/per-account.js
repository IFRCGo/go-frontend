import React, { useState, useContext, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import { countriesSelector } from '../../selectors';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import Select from 'react-select';
import { FormError } from '#components/form-elements/';
import DisplayTable, { SortHeader, FilterHeader } from '#components/display-table';
import { isoDate } from '#utils/format';

function PerAccount (props) {
  const { strings } = useContext(LanguageContext);

  const [country, setCountry] = useState();
  const [formList, setFormList] = useState([]);
  // PER Overviews variables
  const [ovFetching, ovFetched, overviewFormList] = useMemo(() => [
    props.perOverviewForm.fetching,
    props.perOverviewForm.fetched,
    props.perOverviewForm.data,
  ], [props.perOverviewForm]);

  useEffect(() => {
    if (!ovFetching && ovFetched){
      if (!country) {
        setFormList(overviewFormList.results);
      } else {
        setFormList(overviewFormList.results.filter(form => form.country?.id === country));
      }
    }
  }, [country, ovFetching, ovFetched, overviewFormList]);

  const headings = [
    {
      id: 'country',
      label: strings.projectFormCountryLabel
    },
    {
      id: 'updatedDate',
      label: strings.perTableDate
    },
    {
      id: 'assessmentNumber',
      label: strings.perTableAssessmentNumber
    },
    {
      id: 'formsIncluded',
      label: strings.perTableFormsIncluded
    },
    {
      id: 'link',
      label: ''
    }
  ];

  const rows = !ovFetching && ovFetched
    ? formList.map(form => ({
      id: form.id,
      country: form.country?.name,
      updatedDate: isoDate(form.updated_at),
      assessmentNumber: form.assessment_number, // TODO: get assessmentNumber into the response or calc somehow
      formsIncluded: 'asd', // TODO: get these as well, based on which have been created
      link: {
        value: (
          <React.Fragment>
            { !form.is_finalized
              ? (
                <Link
                  className='button button--xsmall button--primary-filled per__list__button'
                  to={`/per-assessment/${form.id}/edit#overview`}
                >
                  <Translate stringId='perDraftEdit' />
                </Link>
              ) 
              : null }
            <Link
              className='button button--xsmall button--primary-bounded per__list__button'
              to={`/per-assessment/${form.id}#overview`}
            >
              <Translate stringId='perdocumentView' />
            </Link>
          </React.Fragment>
        ),
        className: 'right-align'
      }
    }))
    : null;
  
  return (
    <React.Fragment>
      <div className='container-lg new-assessment-button'>
        <div className='text-center'>
          <Link
            to={'/per-assessment/create#overview'}
            className='button button--medium button--primary-filled'
          >
            <Translate stringId='perAccountNewAssessment'/>
          </Link>
        </div>
      </div>

      <div className='container-lg'>
        <figure className='chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='perAccountCompletedAssessments' /></h2>
          </figcaption>
          { !ovFetching && ovFetched
            ? (
              <React.Fragment>
                <div className='col col-4-sm mt-gs'>
                  <div className='form__group'>
                    <Select
                      name='country'
                      value={country}
                      placeholder={strings.perAccountSelectCountryPlaceholder}
                      onChange={(e) => setCountry(e?.value)}
                      options={props.countries.map(country => ({ value: country.value, label: country.label }))}
                    />
                    <FormError
                      errors={[]}
                      property='country'
                    />
                  </div>
                </div>
                <DisplayTable
                  headings={headings}
                  rows={rows}
                  showHeader={true}
                  noPaginate={true}
                  className='table per-table--border-bottom'
                />
              </React.Fragment>
            )
            : null }
        </figure>
      </div>
    </React.Fragment>
  );
}

if (environment !== 'production') {
  PerAccount.propTypes = {
    perOverviewForm: T.object,
    countries: T.array
  };
}

const selector = (state, ownProps) => ({
  perOverviewForm: state.perForm.getPerOverviewForm,
  countries: countriesSelector(state)
});

export default connect(selector)(PerAccount);
