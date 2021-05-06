import React from 'react';
import Page from '#components/draft/Page';

import BreadCrumb from '#components/breadcrumb';
import Container from '#components/draft/Container';
import ThreeWForm from '#components/ThreeWForm';

import LanguageContext from '#root/languageContext';

function NewThreeW(props) {
  const { strings } = React.useContext(LanguageContext);

  // FIXME: use strings
  const crumbs= React.useMemo(() => [
    {link: props.location?.pathname, name: 'New 3W'},
    {link: '/', name: strings.breadCrumbHome}
  ]);
  return (
    <Page
      title="IFRC Go - New 3W"
      heading="Create 3W"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        <ThreeWForm />
      </Container>
    </Page>
  );
}

export default NewThreeW;
