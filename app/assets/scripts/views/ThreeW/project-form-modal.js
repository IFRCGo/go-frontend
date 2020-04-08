import React from 'react';
import Backdrop from '../../components/backdrop';
import _cs from 'classnames';

import ProjectForm from './project-form';

function ProjectFormModal (props) {
  const {
    projectData,
    countryId,
    onCloseButtonClick,
    pending,
  } = props;

  return (
    <Backdrop>
      <div className='project-form-modal'>
        <header>
          <h2>
            Red Cross / Red Crescent activities
          </h2>
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
