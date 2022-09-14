import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';
import type { Location } from 'history';
import {
  Link,
  match as Match,
} from 'react-router-dom';
import { IoPencil } from 'react-icons/io5';

import { useRequest } from '#utils/restRequest';
import { EmergencyProjectResponse } from '#types';

import TextOutput from '#components/TextOutput';
import Page from '#components/Page';
import { useButtonFeatures } from '#components/Button';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import EmergencyThreeWDetails from '#components/EmergencyThreeWDetails';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ projectId?: string }>;
  location: Location;
}

function EmergencyThreeW(props: Props) {
  const {
    className,
    location,
    match: {
      params: {
        projectId,
      },
    },
  } = props;

  const {
    response: projectResponse,
  } = useRequest<EmergencyProjectResponse>({
    skip: isNotDefined(projectId),
    url: `api/v2/emergency-project/${projectId}/`,
  });

  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: projectResponse?.title},
    {link: '/emergency-three-w/all/', name: 'Emergency 3W'},
    {link: '/', name: 'Home'},
  ], [
    projectResponse?.title,
    location,
  ]);

  const editProjectLinkProps = useButtonFeatures({
    variant: 'secondary',
    icons: <IoPencil />,
    children: 'Edit',
  });

  return (
    <Page
      className={_cs(styles.threeWDetails, className)}
      title="Emergency 3W Response"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
      heading={projectResponse?.title ?? '--'}
      description={projectResponse ? (
        <TextOutput
          className={styles.lastModified}
          label="Last modified on"
          value={projectResponse?.modified_at}
          valueType="date"
          description={' by ' +
              (projectResponse.modified_by_details?.username !== null ?
               projectResponse.modified_by_details?.username :
               projectResponse.created_by_details.username)}
        />
      ) : undefined }
      actions={(
        <Link
          to={`/emergency-three-w/${projectId}/edit/`}
          {...editProjectLinkProps}
        />
      )}
    >
      <Container>
        {projectResponse && (
          <EmergencyThreeWDetails
            className={styles.content}
            project={projectResponse}
          />
        )}
      </Container>
    </Page>
  );
}

export default EmergencyThreeW;
