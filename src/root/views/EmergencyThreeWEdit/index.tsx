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
import EmergencyThreeWForm from '#components/EmergencyThreeWForm';
import useAlert from '#hooks/useAlert';
import LanguageContext from '#root/languageContext';

import { EmergencyProjectResponse } from '#types';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ projectId?: string }>;
  history: History;
  location: Location;
}

function EmergencyThreeWEdit(props: Props) {
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

  const handleSubmitSuccess = React.useCallback((project: EmergencyProjectResponse) => {
    alert.show(
      strings.threeWUpdateMessage,
      { variant: 'success' },
    );
    window.setTimeout(
      () => history.push(`/emergency/${project.event}/#activities`),
      250,
    );
  }, [alert, history, strings.threeWUpdateMessage]);

  return (
    <Page
      className={_cs(styles.emergencyThreeWEdit, className)}
      title={strings.threeWEditPageTitle}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        {isDefined(projectId) && (
          <EmergencyThreeWForm
            projectId={+projectId}
            onSubmitSuccess={handleSubmitSuccess}
          />
        )}
      </Container>
    </Page>
  );
}

export default EmergencyThreeWEdit;
