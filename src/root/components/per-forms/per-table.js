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

  return Object.keys(countries).map((countryName, index) => {
    const rows = countries[countryName].map(form => {
      return {
        id: form.id,
        form_name: {
          value: form.hasOwnProperty('area') // if 'area' is there it's not an Overview
            ? `${form.is_draft ? '(Draft)' : ''} ${strings.perdocumentArea} ${form.area?.area_num || ''} \
              - ${form.area?.title || ''} - ${form.updated_at.substring(0, 10)} \
              - ${form.user?.first_name} ${form.user?.last_name}`
            : `${form.is_draft ? '(Draft)' : ''} ${strings.perdocumentOverview} \
              - ${form.date_of_current_capacity_assessment.substring(0, 10)} \
              - ${form.user?.first_name} ${form.user?.last_name}`
        },
        view_link: {
          value: (
            <React.Fragment>
              { form.is_draft
                ? (
                  <React.Fragment>
                    <Link
                      className='button button--xsmall button--primary-filled per__list__button'
                      to={`/per-form/${form.hasOwnProperty('area') ? '' : 'overview/'}${form.id}`}
                    >
                      <Translate stringId='perDraftDelete'/>
                    </Link>
                    <Link
                      className='button button--xsmall button--secondary-filled per__list__button'
                      to={`/per-form/${form.hasOwnProperty('area') ? '' : 'overview/'}${form.id}/edit`}
                    >
                      <Translate stringId='perDraftEdit'/>
                    </Link>
                  </React.Fragment>
                )
                : null }
              <Link
                className='button button--xsmall button--secondary-bounded per__list__button'
                to={`/per-form/${form.hasOwnProperty('area') ? '' : 'overview/'}${form.id}`}
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
