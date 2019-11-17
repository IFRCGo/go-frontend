import React from 'react';
import { Link } from 'react-router-dom';
import { environment } from '../../config';
import { PropTypes as T } from 'prop-types';

const PerDraftDocuments = ({ perForm, deletePerDraft }) => {

  const draftDocuments = [];
  if (perForm.getPerDraftDocument.fetched) {
    let index = 0;
    if (typeof perForm.getPerDraftDocument.data.results !== 'undefined' && perForm.getPerDraftDocument.data.results !== null) {
      perForm.getPerDraftDocument.data.results.forEach((draftDocument) => {
        let parsedData = null;
        try {
          parsedData = JSON.parse(draftDocument.data.replace(/'/g, '"'));
        } catch (e) {
          console.warn('API provided invalid data for draft document (' + draftDocument.data + ')! renderDraftDocuments () failed!\n\n', e);
          return;
        }
        draftDocuments.push(
          <div className='list__each__block flex' key={'draftDocument' + index}>
            <div>
              {draftDocument.code.toUpperCase()} - {parsedData.submitted_at !== '' ? parsedData.submitted_at.substring(0, 10) + ' - ' : null} {typeof draftDocument.user !== 'undefined' ? draftDocument.user.username + ' - ' : null} {draftDocument.country.name}
            </div>
            <div className='list__each__button'>
              <Link
                className='button button--small button--secondary-bounded'
                to={draftDocument.code === 'overview' ? '/per-forms/overview/' + draftDocument.country.id : '/edit-per-forms/' + draftDocument.code + '/' + draftDocument.user.username + '/' + draftDocument.country.id}>
                  Edit
              </Link>

              <button
                className='button button--small button--primary-bounded'
                onClick={(draftId) => deletePerDraft({ id: draftId })}
                style={{ marginLeft: 10 }}>
                  Delete
              </button>
            </div>
          </div>);
        index++;
      });
    }
  }
  return (<React.Fragment>
    <br /><br />
    <h2 className='fold__title margin-reset'>Active drafts</h2>
    <hr />
    {draftDocuments}
  </React.Fragment>);
};

if (environment !== 'production') {
  PerDraftDocuments.propTypes = {
    perForm: T.object,
    deletePerDraft: T.func
  };
}

export default PerDraftDocuments;
