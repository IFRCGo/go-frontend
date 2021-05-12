import React from 'react';
import Page from '#components/draft/Page';
// import { _cs } from '@togglecorp/fujs';

import BreadCrumb from '#components/breadcrumb';
import Container from '#components/draft/Container';
import RadioInput from '#components/draft/RadioInput';

import LanguageContext from '#root/languageContext';

// import styles from './styles.module.scss';

interface Props {
  className?: string;
  history: {
    push: (url: string) => void;
  };
  location: {
    pathname: string;
  };
}

function NewFieldReportForm(props: Props) {
  const {
    className,
    location,
  } = props;
  const { strings } = React.useContext(LanguageContext);

  const crumbs = React.useMemo(() => [
    {link: location?.pathname, name: 'Create new field report'},
    {link: '/', name: strings.breadCrumbHome},
  ], [strings.breadCrumbHome, location]);

  return (
    <Page
      className={className}
      title="IFRC GO - New Field Report"
      heading="Create Field Report"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        <RadioInput
          label="Woo hoo"
          options={[
            { key: 'whee', label: 'Wheee' },
            { key: 'shwee', label: 'Sheee' },
          ]}
          value='whee'
          radioKeySelector={d => d.key}
          radioLabelSelector={d => d.label}
        />
        Wew
      </Container>
    </Page>
  );
}

export default NewFieldReportForm;
