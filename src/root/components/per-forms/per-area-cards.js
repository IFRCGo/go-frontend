import React, { useContext } from 'react';
import { connect } from 'react-redux';
import { environment } from '#config';
// import { PropTypes as T } from 'prop-types';
import { Link } from 'react-router-dom';

import LanguageContext from '#root/languageContext';
import Translate from '#components/Translate';

function PerAreaCards(props) {
  const { strings } = useContext(LanguageContext);

  const { formAreas, isCreate } = props;

  return (
    <div className='col col-12-sm per__container'>
      <div className='per_areas__header'>
        <h2 className='fold__title spacing-b'><Translate stringId='perdocumentAreas' /></h2>
      </div>
      <div className='per__cards row flex-sm'>
        {formAreas.map((area) => (
          <div className='col col-4-sm'>
            <div className='per__card' key={1}>
              <div className='per__card-header row-sm flex'>
                <div className='col-sm col-6'>{area.title}</div>
                  { !isCreate
                    ? (
                      <div className='col-sm col-6 text-right'>
                        <Link
                          className={`button button--xsmall button--secondary-filled per__list__button`}
                          to={`${area.link}/edit` ?? ''}
                        >
                          <Translate stringId='perDraftEdit' />
                        </Link>
                        <Link
                          className={`button button--xsmall button--secondary-bounded per__list__button`}
                          to={area.link ?? ''}
                        >
                          <Translate stringId='perdocumentView' />
                        </Link>
                      </div>
                    )
                    : null }
              </div>
              <div className='row flex'>
                <div className='card__col col col-6'>
                  <p className='card__label card__label'></p>
                  <p>{area.subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

if (environment !== 'production') {
  PerAreaCards.propTypes = {};
}

const selector = (state, ownProps) => ({});

const dispatcher = (dispatch) => ({
  // TODO: not sure if this is needed, everything is dispatched by the main Account page
});

export default connect(selector, dispatcher)(PerAreaCards);
