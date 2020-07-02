import React from 'react';
import Backdrop from '#components/backdrop';
import _cs from 'classnames';

import ProjectForm from './project-form';

import Translate from '#components/Translate';

function ProjectFormModal (p) {
  const {
    projectData,
    countryId,
    onCloseButtonClick,
    pending,
  } = p;

  return (
    <Backdrop>
      <div className='project-form-modal'>
        <header className='tc-header'>
          <h1 className='tc-heading'>
            <Translate stringId='projectFormModalTitle'/>
          </h1>
          <div className='tc-actions'>
            <button
              className={
                _cs(
                  'button button--secondary-bounded',
                  pending && 'disabled',
                )
              }
              onClick={onCloseButtonClick}
              disabled={pending}
            >
              <Translate stringId='projectFormModalClose'/>
            </button>
          </div>
        </header>
        <ProjectForm
          projectData={projectData}
          countryId={countryId}
        />
      </div>
    </Backdrop>
  );
}

export default ProjectFormModal;
