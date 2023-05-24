import React from 'react';
import { AddLineIcon } from '@ifrc-go/icons';

import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import {
  ListResponse,
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import BasicModal from '#components/BasicModal';
import { NumericValueOption } from '#types/common';

import styles from './styles.module.scss';

interface Props {
  id?: number;
  onClose: () =>void;
}

interface UserDetail {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

interface ShareUsers {
  users: number[];
  dref: number;
  id: number;
  users_details: UserDetail[];
}

function ShareUserModal(props: Props) {
  const {
    id,
    onClose,
  } = props;

  const [user, setUser] = React.useState<number | undefined>(undefined);
  const [toggleInput, setToggleInput] = React.useState<boolean>(false);

  const {
    pending: fetchingUserList,
    response: userListResponse,
  } = useRequest<ListResponse<UserDetail>>({
    url: 'api/v2/users/'
  });

  const {
    pending: fetchingSharedUser,
    response: shareUserResponse,
    retrigger: refetchShareUser,
  } = useRequest<ListResponse<ShareUsers>>({
    url: `api/v2/dref-share-user/`,
    query: {id},
  });

  const {
    pending: submitPending,
    trigger: submitShare,
  } = useLazyRequest<ShareUsers>({
    url: '/api/v2/dref-share/',
    method: 'POST',
    body: ctx => ctx,
    onSuccess: () => {
      refetchShareUser();
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      console.log(formErrors, messageForNotification, debugMessage);
    }
  });

  const userOptions = React.useMemo(
    () => userListResponse?.results.map((u) => ({
      label: `${u.first_name} ${u.last_name}`,
      value: u.id,
    })) as NumericValueOption[],
    [userListResponse]);

  const handleUserChange = React.useCallback(
    (value) => {
      submitShare({
        users:[value],
        dref: id
      });
      setToggleInput(false);
    }, [id, submitShare]
  );

  const handleToggleInput = React.useCallback(
    () => setToggleInput(true), []
  );

  const pending = fetchingUserList || fetchingSharedUser || submitPending;

  return(
    <BasicModal
      className={styles.shareModal}
      bodyClassName={styles.body}
      onCloseButtonClick={onClose}
      heading={
        <div className={styles.headingContent}>
          <div className={styles.heading}>Share this application</div>
          <div className={styles.description}>You can share this application by adding the collaborators to it. Please note that anyone who is added can edit the file. </div>
          <hr/>
        </div>
      }
      footerActions={!toggleInput &&(
        <Button
          name={undefined}
          variant='secondary'
          onClick={handleToggleInput}
        >
          <AddLineIcon/> Add Collaborator
        </Button>
      )}
    >
      {shareUserResponse?.results[0].users_details.map(
        (detail) => <div>{detail.username}</div>
      )}
      {toggleInput && (
        <SelectInput
          name={undefined}
          options={userOptions}
          value={user}
          onChange={handleUserChange}
          disabled={pending}
        />
      )}
    </BasicModal>
  );
}

export default ShareUserModal;

