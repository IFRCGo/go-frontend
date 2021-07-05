import React from 'react';
import { _cs } from '@togglecorp/fujs';
import type { Location, History } from 'history';

import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import ThreeWForm from '#components/ThreeWForm';
import LanguageContext from '#root/languageContext';
import { Project } from '#types';

import styles from './styles.module.scss';

interface Props {
  className?: string;
  history: History;
  location: Location,
}

function NewThreeW(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    history,
    location,
  } = props;

  const handleSubmitSuccess = React.useCallback((result: Project) => {
    if (history?.push) {
      const {
        project_country: countryId,
      } = result;

      history.push(`/countries/${countryId}#3w`);
    }
  }, [history]);

  const crumbs= React.useMemo(() => [
    {link: location?.pathname, name: strings.breadCrumbNewThreeW},
    {link: '/', name: strings.breadCrumbHome},
  ], [strings.breadCrumbHome, strings.breadCrumbNewThreeW, location]);
  return (
    <Page
      className={_cs(styles.newThreeW, className)}
      title={strings.newThreeWPageTitle}
      heading={strings.newThreeWPageHeading}
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        <ThreeWForm onSubmitSuccess={handleSubmitSuccess} />
      </Container>
    </Page>
  );
}

export default NewThreeW;
