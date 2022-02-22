import React from 'react';
import BlockLoading from '#components/block-loading';

function PendingMessage() {
  return (
    <BlockLoading />
  );
}

export interface Props {
  className?: string;
  empty?: boolean;
  pending?: boolean;
  errored?: boolean;
  messageHidden?: boolean;
  message?: React.ReactNode;
  pendingMessage?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  erroredMessage?: React.ReactNode;
}

function Message(props: Props) {
  const {
    empty,
    pending,
    errored,
    message: messageFromProps,
    emptyMessage = 'No data available',
    erroredMessage = 'Oops! We ran into an issue',
    messageHidden = false,
  } = props;

  let message: React.ReactNode = messageFromProps;

  if (pending) {
    return (
      <PendingMessage />
    );
  }

  if (empty) {
    message = emptyMessage;
  }

  if (errored) {
    message = erroredMessage;
  }

  return (
    <div>
      {!messageHidden && (
        <div>
          {message}
        </div>
      )}
    </div>
  );
}

export default Message;
