import React from 'react';
import { isDefined } from '@togglecorp/fujs';

import { useRequest } from '#utils/restRequest';
import Modal from '#components/BasicModal';
import Button from '#components/Button';
import BlockLoading from '#components/block-loading';
import { DrefOperationalUpdateApiFields } from '../common';

import styles from './styles.module.scss';

function getUserName(user: DrefOperationalUpdateApiFields['modified_by_details'] | undefined) {
  if (!user) {
    return 'Unknown User';
  }

  if (user.first_name) {
    return [
      user.first_name,
      user.last_name,
    ].filter(isDefined).join(' ');
  }

  if (!user.username) {
    return 'Unknown User';
  }

  return user.username;
}

interface Props {
  opsUpdateId: number;
  onOverwriteButtonClick: (newModifiedAt: string | undefined) => void;
  onCancelButtonClick: () => void;
}

function ObsoletePayloadResolutionModal(props: Props) {
  const {
    opsUpdateId,
    onOverwriteButtonClick,
    onCancelButtonClick,
  } = props;

  const {
    pending: drefPending,
    response: drefResponse,
  } = useRequest<DrefOperationalUpdateApiFields>({
    skip: !opsUpdateId,
    url: `api/v2/dref-op-update/${opsUpdateId}/`,
  });

  return (
    <Modal
      heading="Conflict while saving"
      headingSize="large"
      hideCloseButton
      className={styles.obsoletePayloadResolutionModal}
      footerActions={(
        <>
          <Button
            name={undefined}
            variant="secondary"
            onClick={onCancelButtonClick}
          >
            Cancel
          </Button>
          <Button
            name={drefResponse?.modified_at}
            disabled={drefPending}
            onClick={onOverwriteButtonClick}
          >
            Overwrite
          </Button>
        </>
      )}
    >
      {drefPending && (
        <BlockLoading />
      )}
      {!drefPending && (
        <>
          <div>
            There's a newer version of current Operational Update which was modified by &nbsp;
            <strong>
              {getUserName(drefResponse?.modified_by_details)}
            </strong>
          </div>
          <div>
            If you continue saving, the previous changes will be overwritten by your changes.
          </div>
          <br />
          <div>
            <strong>
              Note:
            </strong>
            &nbsp;You can open this Operational Update form in a new tab and verify / merge the changes manually.
          </div>
        </>
      )}
    </Modal>
  );
}

export default ObsoletePayloadResolutionModal;
