import React from 'react';
import { _cs } from '@togglecorp/fujs';

import Page from '#components/Page';
import BreadCrumb from '#components/breadcrumb';
import Container from '#components/Container';
import ThreeWForm from '#components/ThreeWForm';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

function NewThreeW(props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    history,
  } = props;

  const handleSubmitSuccess = React.useCallback((result) => {
    if (history?.push) {
      const {
        project_country: countryId,
      } = result;

      history.push(`/countries/${countryId}#3w`);
    }
  }, [history]);

  // FIXME: use strings
  const crumbs= React.useMemo(() => [
    {link: props.location?.pathname, name: 'Create new 3W activity'},
    {link: '/', name: strings.breadCrumbHome}
  ], [strings.breadCrumbHome, props.location]);
  return (
    <Page
      className={_cs(styles.newThreeW, className)}
      title="IFRC Go - New 3W project"
      heading="Create 3W project"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        <ThreeWForm onSubmitSuccess={handleSubmitSuccess} />
      </Container>
    </Page>
  );
}

export default NewThreeW;
