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
    okText
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
        <h3 className='tc-heading text-uppercase'>
          { title }
          <button
            className='mma-xmark'
            title='Close'
            onClick={handleCancelClick}
          >
            <span>Dismiss</span>
          </button>
        </h3>
        <div className='tc-message'>
          { message }
        </div>
        <div className='tc-footer'>
          <button
            className='button button-small'
            onClick={handleCancelClick}
          >
            <Translate stringId='confirmModalCancel'/>
          </button>
          <button
            className='button button--primary-filled button--xsmall tc-ok-button text-uppercase'
            onClick={handleOkClick}
          >
            { okText
              ? (okText)
              : (<Translate stringId='confirmModalOk'/>) }
          </button>
        </div>
      </div>
    </Backdrop>
  );
}

export default ConfirmModal;
