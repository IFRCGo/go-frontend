import React from 'react';
import { _cs } from '@togglecorp/fujs';
import {
  IoShareSocialOutline,
  IoClose,
} from 'react-icons/io5';

import Button from '#components/Button';
import SelectInput from '#components/SelectInput';
import Backdrop from '#components/backdrop';
import Container from '#components/Container';
import useBooleanState from '#hooks/useBooleanState';
import useInputState from '#hooks/useInputState';
import useAlert from '#hooks/useAlert';
import {
  useRequest,
  useLazyRequest,
  ListResponse,
} from '#utils/restRequest';

import styles from './styles.module.scss';

interface Donor {
  id: number;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  organization_name: string | null;
  position: string | null;
}

interface DonorGroup {
  id: number;
  name: string;
}

interface SharePostOptions {
  flash_update: number;
  donors: number[] | undefined;
  donor_groups: number[] | undefined;
}

interface Props {
  flashUpdateId: number;
  className?: string;
}

function ShareButton(props: Props) {
  const {
    className,
    flashUpdateId,
  } = props;

  const alert = useAlert();

  const [
    showShareModal,
    setShowShareModalTrue,
    setShowShareModalFalse,
  ] = useBooleanState(false);

  const [donors, setDonors] = useInputState<number[] | undefined>(undefined);
  const [donorGroups, setDonorGroups] = useInputState<number[] | undefined>(undefined);

  const {
    response: donorResponse,
  } = useRequest<ListResponse<Donor>>({
    skip: !showShareModal,
    url: 'api/v2/donor/',
  });

  const {
    response: donorGroupResponse,
  } = useRequest<ListResponse<DonorGroup>>({
    skip: !showShareModal,
    url: 'api/v2/donor-group/',
  });

  const {
    pending: shareRequestPending,
    trigger: postShareRequest,
  } = useLazyRequest<unknown, SharePostOptions>({
    method: 'POST',
    body: ctx => ctx,
    url: 'api/v2/share-flash-update/',
    onSuccess: () => {
      alert.show('Flash Update shared successfully!', {variant: 'success'});
      setShowShareModalFalse();
    },
    onFailure: ({ value: { messageForNotification } }) => {
      alert.show(
        `Failed to share the flash update: ${messageForNotification}!`,
        {variant: 'danger'},
      );
    },
  });

  const donorOptions = React.useMemo(() => (
    donorResponse?.results?.map((d) => ({
      label: d.organization_name ?? '??',
      value: d.id,
    })) ?? []
  ), [donorResponse]);

  const donorGroupOptions = React.useMemo(() => (
    donorGroupResponse?.results?.map((d) => ({
      label: d.name,
      value: d.id,
    })) ?? []
  ), [donorGroupResponse]);

  const hasDonorOrDonorGroup = (donors && donors.length > 0)
    || (donorGroups && donorGroups.length > 0);

  const handleShareNowButtonClick = React.useCallback(() => {
    if (hasDonorOrDonorGroup) {
      postShareRequest({
        flash_update: flashUpdateId,
        donors,
        donor_groups: donorGroups,
      });
    }
    // TODO: handle error
  }, [hasDonorOrDonorGroup, postShareRequest, donors, donorGroups, flashUpdateId]);

  return (
    <>
      <Button
        variant="secondary"
        className={_cs(styles.shareButton, className)}
        name={undefined}
        icons={<IoShareSocialOutline />}
        onClick={setShowShareModalTrue}
      >
        Share
      </Button>
      {showShareModal && (
        <Backdrop className={styles.backdrop}>
          <Container
            sub
            className={styles.shareModal}
            heading="Share Flash Update"
            contentClassName={styles.body}
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
                onClick={handleShareNowButtonClick}
                disabled={!hasDonorOrDonorGroup || shareRequestPending}
              >
                Share Now
              </Button>
            )}
          >
            <SelectInput<undefined, number>
              label="Select Donors"
              value={donors}
              onChange={setDonors}
              options={donorOptions}
              name={undefined}
              isMulti
            />
            <SelectInput<undefined, number>
              label="Select Donor Groups"
              value={donorGroups}
              onChange={setDonorGroups}
              options={donorGroupOptions}
              name={undefined}
              isMulti
            />
          </Container>
        </Backdrop>
      )}
    </>
  );
}

export default ShareButton;
