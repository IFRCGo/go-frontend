import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';
import Translate from '#components/Translate';
import LanguageContext from '#root/languageContext';

import DisplayTable from '#components/display-table';

function PerTable ({regionId, countries}) {
  const { strings } = useContext(LanguageContext);

  // Must pass headings (with matching 'id's) to DisplayTable for the columns to show up at all
  const headings = [
    {
      id: 'form_name',
      label: ''
    }, {
      id: 'view_link',
      label: ''
    }
  ];

  return Object.keys(countries).map((countryName) => {
    const rows = countries[countryName].map(form => {
      return {
        id: `${form.id}${form.hasOwnProperty('area') ? '-form' : '-overview'}`,
        form_name: {
          // Keeping this logic in here, in case we want to re-add Forms
          // if it has 'area' it's a Form, otherwise an Overview
          value: form.hasOwnProperty('area')
            ? `${strings.perdocumentArea} ${form.area?.area_num || ''} \
              - ${form.area?.title || ''} - ${form.updated_at.substring(0, 10)} \
              - ${form.user?.first_name} ${form.user?.last_name}`
            : `${strings.perdocumentOverview} \
              - ${form.date_of_assessment.substring(0, 10)} \
              - ${form.user?.first_name} ${form.user?.last_name}`
        },
        view_link: {
          value: (
            <React.Fragment>
              { !form.is_finalized
                ? (
                  <React.Fragment>
                    <Link
                      className='button button--xsmall button--secondary-filled per__list__button'
                      to={`${form.hasOwnProperty('area') ? '/per-form/' : '/per-overview/'}${form.id}/edit`}
                    >
                      <Translate stringId='perDraftEdit'/>
                    </Link>
                  </React.Fragment>
                )
                : null }
              <Link
                className='button button--xsmall button--secondary-bounded per__list__button'
                to={`${form.hasOwnProperty('area') ? '/per-form/' : '/per-overview/'}${form.id}`}
              >
                <Translate stringId='perdocumentView'/>
              </Link>
            </React.Fragment>
          ),
          className: 'right-align'
        }
      };
    });

    return (
      <React.Fragment>
        <h3 className='tc-heading'>{countryName}</h3>
        <DisplayTable
          className='table table--border-bottom table--box-shadow table--per-table margin-half-t'
          headings={headings}
          rows={rows}
          showHeader={false}
          noPaginate={true}
        />
      </React.Fragment>
    );
  });
}

if (environment !== 'production') {
  PerTable.propTypes = {
    regionId: T.string,
    countries: T.object
  };
}

const selector = (state, ownProps) => ({});

const dispatcher = (dispatch) => ({});

export default connect(selector, dispatcher)(PerTable);
