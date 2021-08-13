import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import Select from 'react-select';
import { getSelectInputValue } from '#utils/utils';
import DisplayTable from '#components/display-table';
import { connect } from 'react-redux';
import { drefApplicationsSelector, countriesSelector } from '#selectors';

// status:0|1
// created_at : datetime
// modified_at : datetime
// title : string;
// country_district.country : field
// appeal_code: string
// submission_to_geneva : date
// date_of_approval : date

// id: "123",
//       createdOn: '2021-01-01',
//       country: 'Nepal',
//       appealNumber: 'MDRMY006',
//       name: 'Nepal:Flood',
//       regionalTechReview: '2021-02-02',
//       submittedToGeneva: '2021-03-03',
//       lastUpdate: '2021-03-03'
//     }

const DrefApplications = (props) => {
  const { strings } = useContext(LanguageContext);
  const { countries, drefApplications } = props;
  const [country, setCountry] = useState();
  const [approved, setApproved] = useState([]);
  const [inProgress, setInProgress] = useState([]);

  useEffect(() => {

  }, [countries, drefApplications]);

  const countryOptions = React.useMemo(() => (
    props.countries.map(country => (
      { value: country.value, label: country.label }
    ))
  ), [props.countries]);


  const headings = [
    {
      id: 'createdOn',
      label: strings.drefTableCreatedOn
    },
    {
      id: 'country',
      label: strings.drefTableCountry
    },
    {
      id: 'appealNumber',
      label: strings.drefTableAppealNumber
    },
    {
      id: 'name',
      label: strings.drefTableName
    },
    {
      id: 'regionalTechReview',
      label: strings.drefTableRegionalTechReview
    },
    {
      id: 'submittedToGeneva',
      label: strings.drefTableSubToGeneva
    },
    {
      id: 'lastUpdate',
      label: strings.drefTableLastUpdate
    },
    {
      id: 'link',
      label: ''
    }
  ];

  const formList = [
    {
      id: "123",
      createdOn: '2021-01-01',
      country: 'Nepal',
      appealNumber: 'MDRMY006',
      name: 'Nepal:Flood',
      regionalTechReview: '2021-02-02',
      submittedToGeneva: '2021-03-03',
      lastUpdate: '2021-03-03'
    }
  ];
  const rows = formList.map(form => ({
    id: form.id,
    createdOn: form.createdOn,
    country: form.country,
    appealNumber: form.appealNumber,
    name: form.name,
    regionalTechReview: form.regionalTechReview,
    submittedToGeneva: form.submittedToGeneva,
    lastUpdate: form.lastUpdate,
    link: {
      value: (
        <React.Fragment>
          <Link
            className='button button--xsmall button--primary-bounded per__list__button'
            to={`/dref/${form.id}/edit`}
          >
            <Translate stringId='perDraftEdit' />
          </Link>
          <Link
            className='button button--xsmall button--primary-bounded per__list__button'
            to={`/dref/${form.id}/delete`}
          >
            <Translate stringId='perDraftDelete' />
          </Link>
          <button
            className='button button--xsmall button--primary-bounded per__list__button'
            onClick={() => console.log('exporting')}
          >
            <Translate stringId='threeWExport' />
          </button>
        </React.Fragment>
      )
    }
  }));

  return (
    <React.Fragment>

      <div className='container-lg'>
        <div className='col col-4-sm mt-gs'>
          <div className='form__group'>
            <Select
              name='country'
              value={getSelectInputValue(country, countryOptions)}
              placeholder={strings.perAccountSelectCountryPlaceholder}
              onChange={(e) => setCountry(e?.value)}
              options={countryOptions}
            />
          </div>
        </div>
        <figure className='chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='drefInProgressApplications' /></h2>
          </figcaption>
          <React.Fragment>
            <DisplayTable
              headings={headings}
              rows={inProgress}
              showHeader={true}
              noPaginate={true}
              className='table per-table--border-bottom'
            />
          </React.Fragment>
        </figure>
        <figure className='chart'>
          <figcaption>
            <h2 className='fold__title'><Translate stringId='drefApprovedApplications' /></h2>
          </figcaption>
          <React.Fragment>
            <DisplayTable
              headings={headings}
              rows={approved}
              showHeader={true}
              noPaginate={true}
              className='table per-table--border-bottom'
            />
          </React.Fragment>
        </figure>
      </div>
    </React.Fragment>
  );
};

if (environment !== 'production') {
  DrefApplications.propTypes = {
    user: T.object,
    drefApplications: T.object,
    countries: T.array,
  };
}

const selector = (state) => ({
  user: state.user.data,
  drefApplications: drefApplicationsSelector(state),
  countries: countriesSelector(state),
});

const dispatcher = (dispatch) => ({
});

export default connect(selector, dispatcher)(DrefApplications);
