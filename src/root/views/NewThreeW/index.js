import React from 'react';
import Page from '#components/draft/Page';

import BreadCrumb from '#components/breadcrumb';
import Container from '#components/draft/Container';
import ThreeWForm from '#components/ThreeWForm';

import LanguageContext from '#root/languageContext';

function NewThreeW(props) {
  const { strings } = React.useContext(LanguageContext);

  const handleSubmitSuccess = React.useCallback((result) => {
    if (props.history?.push) {
      const {
        project_country: countryId,
      } = result;

      props.history.push(`/countries/${countryId}#3w`);
    }
  }, [props.history]);

  // FIXME: use strings
  const crumbs= React.useMemo(() => [
    {link: props.location?.pathname, name: 'Create new 3W activity'},
    {link: '/', name: strings.breadCrumbHome}
  ], [strings.breadCrumbHome, props.location]);
  return (
    <Page
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
