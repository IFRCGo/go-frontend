import React from 'react';
import { AddLineIcon } from '@ifrc-go/icons';
import { IoTrash } from 'react-icons/io5';
import { PartialForm } from '@togglecorp/toggle-form';

import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import {
  ListResponse,
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import BasicModal from '#components/BasicModal';
import { NumericValueOption } from '#types/common';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import languageContext from '#root/languageContext';
import  useAlert from '#hooks/useAlert';

import styles from './styles.module.scss';

interface Props {
  id?: number;
  onClose: () =>void;
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
  const lastModifiedAtRef = React.useRef<string | undefined>();
  const [users, setUsers] = React.useState<number[] | undefined>(undefined);
  const [userDetails, setUserDetails] = React.useState<PartialForm<UserDetail[]>>();
  const [toggleInput, setToggleInput] = React.useState<boolean>(false);

  const {
    pending: fetchingUserList,
    response: userListResponse,
  } = useRequest<ListResponse<UserDetail>>({
    url: 'api/v2/users/'
  });

  const {
    pending: drefApplicationPending,
    response: drefResponse,
  } = useRequest<DrefApiFields>({
    skip: !id,
    url: `api/v2/dref/${id}/`,
    onSuccess: (response) => {
      setUsers(response.users);
      setUserDetails(response.users_details);
      lastModifiedAtRef.current = response?.modified_at;
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefFormLoadRequestFailureMessage}
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
    }
  });

  const {
    pending: drefSubmitting,
    trigger: submitRequest,
  } = useLazyRequest<DrefApiFields, Partial<DrefApiFields>>({
    url: id ? `api/v2/dref/${id}` : 'api/v2/dref/',
    method: id ? 'PATCH' : 'POST',
    body : ctx => ctx,
    onSuccess: (response) => {
      console.log('this is patch response', response);
    },
    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.drefFormLoadRequestFailureMessage}
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
    }
  });

  const submitDref = React.useCallback((modifiedAt?: string) => {
    const body = {
      ...drefResponse,
      users: users,
      modified_at: modifiedAt ?? lastModifiedAtRef.current,
      disability_people_per: 0,
      people_per_local: 0,
      people_per_urban: 0,
    };

    submitRequest(body as DrefApiFields);
  }, [submitRequest, drefResponse, users]);


  const userOptions = React.useMemo(
    () => userListResponse?.results.map((u) => ({
      label: `${u.first_name} ${u.last_name} - ${u.email}`,
      value: u.id,
    })) as NumericValueOption[],
    [userListResponse]);


  const handleUserChange = React.useCallback(
    (val) => {
      setUsers(val);
    }, []
  );

  const handleToggleInput = React.useCallback(
    () => setToggleInput(true), []
  );

  const handleUserDelete = React.useCallback(
    (value) => {
      const filterOutUser = users?.filter(
        (u) => u !== value );
      setUsers(filterOutUser);
    },[users]
  );

  const pending = fetchingUserList || drefApplicationPending || drefSubmitting;

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
          {toggleInput && (
            <Button
              name={undefined}
              variant='secondary'
              onClick={submitDref}
            >
              save
            </Button>
          )}
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
          <div className={styles.userList}>
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
        <SelectInput<'users', number>
          name={'users' as const}
          options={userOptions}
          value={users}
          onChange={handleUserChange}
          disabled={pending}
          isMulti
          isClearable
        />
      )}
    </BasicModal>
  );
}

export default ShareUserModal;

