import React from 'react';
import _cs from 'classnames';

import Backdrop from './backdrop';

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
            Cancel
          </button>
          <button
            className='button tc-ok-button'
            onClick={handleOkClick}
          >
            Ok
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

export default ConfirmModal;
