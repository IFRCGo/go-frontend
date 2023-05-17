import React from 'react';
import {
  _cs,
  isDefined,
} from '@togglecorp/fujs';
import type { History, Location } from 'history';
import { match as Match } from 'react-router-dom';

import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import ThreeWForm from '#components/ThreeWForm';
import useAlert from '#hooks/useAlert';
import LanguageContext from '#root/languageContext';

import { Project } from '#types';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ projectId?: string }>;
  history: History;
  location: Location;
}

function ThreeWEdit(props: Props) {
  const {
    className,
    location,
    match: {
      params: {
        projectId,
      },
    },
    history,
  } = props;

  const alert = useAlert();
  const { strings } = React.useContext(LanguageContext);
  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: strings.breadCrumbEditProject},
    {link: '/three-w/all/', name: strings.breadCrumbThreeW},
    {link: '/', name: strings.breadCrumbHome},
  ], [
    strings.breadCrumbHome,
    strings.breadCrumbThreeW,
    strings.breadCrumbEditProject,
    location,
  ]);

  const handleSubmitSuccess = React.useCallback((project: Project) => {
    alert.show(
      strings.threeWUpdateMessage,
      { variant: 'success' },
    );
    window.setTimeout(
      () => history.push(`/three-w/${project.id}/`),
      250,
    );
  }, [alert, history, strings.threeWUpdateMessage]);

  return (
    <Page
      className={_cs(styles.threeWDetails, className)}
      title={strings.threeWEditPageTitle}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        {isDefined(projectId) && (
          <ThreeWForm
            projectId={+projectId}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
      </Container>
    </Page>
  );
}

export default ThreeWEdit;
