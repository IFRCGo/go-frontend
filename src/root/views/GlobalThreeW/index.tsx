import React from 'react';
import Page from '#components/Page';
import Heading, { Props as HeadingProps } from '#components/Heading';
import Description from '#components/Description';
import { _cs } from '@togglecorp/fujs';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';
import Container from '#components/Container';
import PageHeader from '#components/PageHeader';
import ThreeWForm from '#components/ThreeWForm';
import BreadCrumb from '#components/breadcrumb';

interface Props {
  className?: string;
  location: Location;
}

function GlobalThreeW(props: Props) {
  const {
    className,
    location
  } = props;
  const { strings } = React.useContext(LanguageContext);

  const crumbs = React.useMemo(() => [
    // FIXME: use translations
    { link: location?.pathname, name: 'GlobalThreeW' },

    { link: '/', name: strings.breadCrumbHome },
  ], [strings.breadCrumbHome, strings.breadCrumbNewFieldReport, location]);


  return (
    <Page
      title="IFRC Go -Global 3W Response"
      heading="Global 3W Response"
      breadCrumbs={<BreadCrumb crumbs={crumbs} compact />}
    >
      <Container>
        Hello World
        </Container>
    </Page>
  );
}
export default GlobalThreeW;
