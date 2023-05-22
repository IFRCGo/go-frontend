import React from 'react';
import { IoClose } from 'react-icons/io5';

import useBooleanState from '#hooks/useBooleanState';
import Button from '#components/Button';
import Backdrop from '#components/backdrop';
import Container from '#components/Container';
import SelectInput from '#components/SelectInput';
import { ListResponse, useRequest } from '#utils/restRequest';

import styles from './styles.module.scss';
import { AddLineIcon } from '@ifrc-go/icons';

interface Props {
  className?: string;
  id: number;
}

interface UserListItem {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
}

function ShareUserModal(props: Props) {
  const {
    className,
    id,
  } = props;
  const [user, setUser] = React.useState<number[] | undefined>(undefined);

  const [
  showShareModal,
  setShowShareModalTrue,
  setShowShareModalFalse,
] = useBooleanState(false);

  const {
    response: userResponse,
  } = useRequest<ListResponse<UserListItem>>({
    url: 'api/v2/users/'
  });

  const userOptions = React.useMemo(
    () => userResponse?.results.map((u) => ({
      label: `${u.first_name} ${u.last_name}`,
      value: u.id,
    })) ?? [], [userResponse]);

  console.log("share mmodal", id, showShareModal);

  return(
    <>
      <Button
        variant='transparent'
        name={undefined}
        onClick={setShowShareModalTrue}
      >
        share user
      </Button>
      {showShareModal && (
        <Backdrop className={styles.backdrop}>
          <Container
            sub
            className={styles.shareModal}
            contentClassName={styles.body}
            headerClassName={styles.header}
            heading={
              <div className={styles.headingContent}>
                <div className={styles.heading}>Share this application</div>
                <div className={styles.description}>You can share this application by adding the collaborators to it. Please note that anyone who is added can edit the file. </div>
              </div>
            }
            actions={(
              <Button
                name={undefined}
                onClick={setShowShareModalFalse}
                variant="action"
              >
                <IoClose />
              </Button>
            )}
            footerActions={(
              <Button
                name={undefined}
                variant='secondary'
              >
                <AddLineIcon/> Add Collaborator
              </Button>
            )}
            description='Watching this application'
          >
            <SelectInput<undefined, number>
              value={user}
              onChange={setUser}
              options={userOptions}
              name={undefined}
              isMulti
            />
          </Container>
        </Backdrop>
      )}
    </>
  );
}

export default ShareUserModal;

