import React from 'react';
import { AddLineIcon } from '@ifrc-go/icons';
import { IoTrash } from 'react-icons/io5';
import { PartialForm } from '@togglecorp/toggle-form';
import { isNotDefined } from '@togglecorp/fujs';

import Button from '#components/Button';
import {
  ListResponse,
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import BasicModal from '#components/BasicModal';
import languageContext from '#root/languageContext';
import  useAlert from '#hooks/useAlert';
import UserSearchSelectInput from '#components/UserSearchSelectInput';

import styles from './styles.module.scss';

interface Props {
  id?: number;
  onClose: () =>void;
}

interface ShareUsers {
  users: number[];
  dref: number;
  id: number;
  users_details: UserDetail[];
}

interface UserDetail {
  client_id: string;
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

function ShareUserModal(props: Props) {
  const {
    id,
    onClose,
  } = props;

  const alert = useAlert();
  const {strings} = React.useContext(languageContext);
  const [users, setUsers] = React.useState<number[]>([]);
  const [userDetails, setUserDetails] = React.useState<PartialForm<UserDetail[]>>();
  const [toggleInput, setToggleInput] = React.useState<boolean>(false);
  const [searchUser, setSearchUser] = React.useState<string | undefined>(undefined);

  const {
    retrigger: refetchShareUser,
  } = useRequest<ListResponse<ShareUsers>>({
    url: `api/v2/dref-share-user/`,
    query: {id},
    onSuccess: (response) => {
      setUsers(response.results[0].users);
      setUserDetails(response.results[0].users_details);
    }
  });

  const {
    trigger: submitShare,
  } = useLazyRequest<ShareUsers>({
    url: '/api/v2/dref-share/',
    method: 'POST',
    body: ctx => ctx,
    onSuccess: () => {
      setToggleInput(false);
      refetchShareUser();
    },
    onFailure: ({
      value: {
        messageForNotification,
      },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefFormSaveRequestFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    },
  });

  const handleSubmit = React.useCallback(
    (finalUsers) => {
      let body = {
        users: finalUsers,
        dref: id,
      };
      submitShare(body);
    },[submitShare, id]
  );

  const handleUserDelete = React.useCallback(
    (value) => {
      const filterDeleteUser = users?.filter(
        (u) => u !== value );
      handleSubmit(filterDeleteUser);

    },[users, handleSubmit]
  );

  const handleToggleInput = React.useCallback(
    () => setToggleInput(true), []
  );

  React.useMemo(() => {
    if(isNotDefined(searchUser)) {
      return;
    }

    let userList = [...users, searchUser];
    handleSubmit(userList);
    setSearchUser(undefined);
  },[users, handleSubmit, searchUser]);

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
      footerContent={(
        <>
          {!toggleInput && (
            <Button
              name={undefined}
              variant='secondary'
              onClick={handleToggleInput}
            >
              <AddLineIcon/> Add Collaborator
            </Button>
          )}
        </>
      )}
    >
      {userDetails?.map(
        (item) => (
          <div key={item.id} className={styles.userList}>
            <div>{item.first_name}</div>
            <Button
              name={item.id}
              variant='transparent'
              onClick={handleUserDelete}
            >
              <IoTrash />
            </Button>
          </div>
        )
      )}
      {toggleInput && (
        <UserSearchSelectInput
          name={undefined}
          initialOptions={[]}
          value={searchUser}
          onChange={setSearchUser}
          isMulti={false}
        />
      )}
    </BasicModal>
  );
}

export default ShareUserModal;

