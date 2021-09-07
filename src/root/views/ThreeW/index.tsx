import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import type { Location } from 'history';
import {
  Link,
  match as Match,
} from 'react-router-dom';
import { IoPencil } from 'react-icons/io5';

import Translate from '#components/Translate';
import TextOutput from '#components/TextOutput';
import Page from '#components/Page';
import { useButtonFeatures } from '#components/Button';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import ThreeWDetails from '#components/ThreeWDetails';
import LanguageContext from '#root/languageContext';

import { Project } from '#types';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ projectId?: string }>;
  location: Location;
}

function ThreeW(props: Props) {
  const {
    className,
    location,
    match: {
      params: {
        projectId,
      },
    },
  } = props;

  const [projectDetails, setProjectDetails] = React.useState<Project | undefined>();
  const { strings } = React.useContext(LanguageContext);
  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: projectDetails?.name },
    {link: '/three-w/all/', name: strings.breadCrumbThreeW},
    {link: '/', name: strings.breadCrumbHome},
  ], [
    strings.breadCrumbHome,
    strings.breadCrumbThreeW,
    projectDetails?.name,
    location,
  ]);

  const handleProjectLoad = React.useCallback((project: Project) => {
    setProjectDetails(project);
  }, []);

  const editProjectLinkProps = useButtonFeatures({
    variant: 'secondary',
    icons: <IoPencil />,
    children: strings.threeWEditProject,
  });

  const displayName = React.useMemo(() => {
    if (!projectDetails?.modified_by_detail) {
      return undefined;
    }

    const {
      username,
      firstName,
      lastName,
    } = projectDetails.modified_by_detail;

    if (firstName) {
      return `${firstName} ${lastName}`;
    }

    return username;
  }, [projectDetails?.modified_by_detail]);

  return (
    <Page
      className={_cs(styles.threeWDetails, className)}
      title={strings.threeWPageTitle}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
      heading={projectDetails?.name ?? '--'}
      withMainContentBackground
      description={projectDetails ? (
        <TextOutput
          className={styles.lastModified}
          label={strings.threeWLastModifiedOn}
          value={projectDetails?.modified_at}
          valueType="date"
          description={displayName ? (
            <Translate
              stringId="threeWLastModifiedBy"
              params={{ user: displayName }}
            />
          ) : undefined}
        />
      ) : undefined }
      actions={(
        <Link
          to={`/three-w/${projectId}/edit/`}
          {...editProjectLinkProps}
        />
      )}
    >
      <Container>
        {isDefined(projectId) && (
          <ThreeWDetails
            className={styles.content}
            projectId={+projectId}
            onProjectLoad={handleProjectLoad}
            hideHeader
          />
        )}
      </Container>
    </Page>
  );
}

export default ThreeW;
