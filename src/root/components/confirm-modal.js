import React from 'react';
import _cs from 'classnames';

import Backdrop from './backdrop';
import Translate from '#components/Translate';

function ConfirmModal (p) {
  const {
    className,
    title = 'Confirm',
    message,
    onClose,
  } = p;

  const handleOkClick = React.useCallback(() => {
    if (onClose) {
      onClose(true);
    }
  }, [onClose]);

  const handleCancelClick = React.useCallback(() => {
    if (onClose) {
      onClose(false);
    }
  }, [onClose]);

  return (
    <Backdrop>
      <div className={_cs(className, 'tc-confirm-modal')}>
        <h3 className='tc-heading'>
          { title }
        </h3>
        <div className='tc-message'>
          { message }
        </div>
        <div className='tc-footer'>
          <button
            className='button'
            onClick={handleCancelClick}
          >
            <Translate stringId='confirmModalCancel'/>
          </button>
          <button
            className='button tc-ok-button'
            onClick={handleOkClick}
          >
            <Translate stringId='confirmModalOk'/>
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

export default ConfirmModal;
