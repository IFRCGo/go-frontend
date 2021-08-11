import React, { useContext }  from 'react';
import { Link } from 'react-router-dom';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

import Select from 'react-select';
import { FormError } from '#components/form-elements/';
import DisplayTable from '#components/display-table';

function DrefApplications(props: any) {
  const { strings } = useContext(LanguageContext);
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
      id:"123",
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
              value={[]}
              placeholder={strings.perAccountSelectCountryPlaceholder}
              onChange={(e) => console.log(e)}
              options={[]}
            />
            <FormError
              errors={[]}
              property='country'
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
              rows={rows}
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
              rows={rows}
              showHeader={true}
              noPaginate={true}
              className='table per-table--border-bottom'
            />
          </React.Fragment>
        </figure>
      </div>
    </React.Fragment>
  );
}

export default DrefApplications;
