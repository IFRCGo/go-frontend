import React from 'react';
import { Link } from 'react-router-dom';
import { environment } from '#config';
import { PropTypes as T } from 'prop-types';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

const PerDocuments = ({perOverviewForm, perForm, regionsById}) => {
  const { strings } = React.useContext(LanguageContext);

  const groupedDocuments = {};
  if (perOverviewForm.fetched) {
    perOverviewForm.data.results.forEach((perOverviewForm) => {
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
  if (perForm.getPerForms.fetched && !!perForm.getPerForms.data && !!perForm.getPerForms.data.results) {
    perForm.getPerForms.data.results.forEach(document => {
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

  const renderPerFormDocuments = (documents) => {
    const regions = [];
    Object.keys(documents).forEach((regionKey, regionIndex) => {
      const countries = [];
      Object.keys(documents[regionKey]).forEach((countryKey, countryIndex) => {
        const perDocuments = [];
        let currentCountryName = '';
        documents[regionKey][countryKey].forEach((document) => {
          currentCountryName = document.country.name;
          if (document.formType === 'overview') {
            perDocuments.push((<React.Fragment key={'documentoverviewrow' + document.id}>
              <div className='list__each__block flex'>
                <div key={'documentov' + document.id}>
                  {strings.perdocumentOverview} - {document.date_of_current_capacity_assessment.substring(0, 10)} - {typeof document.user !== 'undefined' && document.user !== null ? document.user.first_name + ' ' + document.user.last_name : null}
                </div>
                <div className='list__each__button'>
                  <Link className='button button--xsmall button--secondary-bounded' to={'/view-per-forms/overview/' + document.id}>
                    <Translate stringId='perdocumentView'/>
                  </Link>
                </div>
              </div>
            </React.Fragment>));
          } else {
            perDocuments.push((<React.Fragment key={'documentrow' + document.code + 'id' + document.id}>
              <div className='list__each__block flex'>
                <div key={'document' + document.id}>
                  {document.code.toUpperCase()} - {document.name} - {document.updated_at.substring(0, 10)} - {typeof document.user !== 'undefined' && document.user !== null ? document.user.username : null}
                </div>
                <div className='list__each__button'>
                  <Link className='button button--xsmall button--secondary-bounded' to={'/view-per-forms/' + document.code + '/' + document.id}>
                    <Translate stringId='perdocumentView'/>
                  </Link>
                </div>
              </div>
            </React.Fragment>));
          }
        });
        countries.push(<div key={'countryDocument' + countryKey}><div className='heading-sub global-spacing-v'>{currentCountryName}</div>{perDocuments}<br /></div>);
      });
      regions.push(<div key={'regionDocument' + regionKey}><span className='fold__title'>{regionsById[regionKey][0].label}</span>{countries}<br /></div>);
    });
    return regions;
  };

  return (<React.Fragment>
    <span className='text-semi-bold'>{renderPerFormDocuments(groupedDocuments)}</span>
  </React.Fragment>);
};

if (environment !== 'production') {
  PerDocuments.propTypes = {
    perForm: T.object,
    perOverviewForm: T.object
  };
}

export default PerDocuments;
