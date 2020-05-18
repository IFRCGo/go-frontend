import React from 'react';
import Backdrop from '#components/backdrop';
import _cs from 'classnames';

import ProjectForm from './project-form';

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
            Red Cross / Red Crescent activities
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
              Close
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
