import React from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';

import {
  Page as PDFPage,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  PDFViewer,
  Font,
} from '@react-pdf/renderer';

import Page from '#components/Page';

import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';

import ifrcLogo from './ifrc_logo.png';
import openSansRegularFont from './OpenSans-Regular.ttf';
import openSansBoldFont from './OpenSans-Bold.ttf';
import montserratFont from './Montserrat-Bold.ttf';

import styles from './styles.module.scss';

Font.register({
  family: 'OpenSans',
  src: openSansRegularFont,
  fontWeight: 'regular',
});

Font.register({
  family: 'OpenSans',
  src: openSansBoldFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'Montserrat',
  src: montserratFont,
  fontWeight: 'bold',
});

const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'OpenSans',
    fontSize: 12,
  },
  section: {
    padding: 16,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    flexDirection: 'row',
  },
  compactSection: {
    display: 'flex',
    justifyItem: 'stretch',
    alignItems: 'stretch',
    flexDirection: 'row',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Montserrat',
    color: '#f5333f',
  },
  heading: {
    fontSize: 16,
    fontFamily: 'Montserrat',
    color: '#f5333f',
  },
  subHeading: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  label: {
    fontFamily: 'OpenSans',
  },
  value: {
    fontFamily: 'OpenSans',
    fontWeight: 'bold',
  },
  textOutput: {
    backgroundColor: '#f0f0f0',
    margin: 1,
    padding: 10,
  },
  oneByThree: {
    width: '33%',
  },
  twoByThree: {
    width: '66%',
  },
  threeByThree: {
    width: '99%',
  },
  oneByTwo: {
    width: '50%',
  },
});

function TextOutput(props: {
  label: string;
  value?: string;
  columns?: '1/3' | '2/3' | '3/3' | '1/2';
}) {
  const {
    label,
    value,
    columns = '1/3',
  } = props;

  const styleMap = {
    '1/3': pdfStyles.oneByThree,
    '2/3': pdfStyles.twoByThree,
    '3/3': pdfStyles.threeByThree,
    '1/2': pdfStyles.oneByTwo,
  };

  return (
    <View
      style={[
        pdfStyles.textOutput,
        styleMap[columns] ?? pdfStyles.oneByThree,
      ]}
    >
      <Text style={pdfStyles.label}>
        {label}
      </Text>
      <Text style={pdfStyles.value}>
        {value}
      </Text>
    </View>
  );
}

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
}

function DrefPdfExport(props: Props) {
  const {
    className,
    match,
  } = props;

  const { drefId } = match.params;

  const {
    pending: fetchingDref,
    response: dref,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
  });

  return (
    <Page
      className={className}
      heading="DREF Export"
    >
      <PDFViewer className={styles.pdfPreview}>
        <Document>
          <PDFPage
            size="A4"
            style={pdfStyles.page}
          >
            <View style={pdfStyles.section}>
              <Image
                style={pdfStyles.logo}
                src={ifrcLogo}
              />
              <Text style={pdfStyles.title}>
                DREF Application
              </Text>
            </View>
            <View
              style={[
                pdfStyles.section,
                { alignSelf: 'flex-end' }
              ]}
            >
              <Text>
                Country, region | Emergency Name
              </Text>
            </View>
            <View
              style={[
                pdfStyles.section,
                {
                  width: 560,
                  justifyContent: 'center',
                  alignSelf: 'center',
                  backgroundColor: '#f0f0f0',
                },
              ]}
            >
              <Image
                style={{ width: 400, height: 300, objectFit: 'contain', objectPosition: 'center' }}
                src={ifrcLogo}
              />
            </View>
            <View
              style={{
                width: '100%',
                padding: 16,
              }}
            >
              <View style={pdfStyles.compactSection}>
                <TextOutput
                  label="Appeal No:"
                  value={dref?.appeal_code}
                />
                <TextOutput
                  label="DREF allocated:"
                  value={`CHF ${dref?.amount_requested ?? '-'}`}
                  columns="2/3"
                />
              </View>
              <View style={pdfStyles.compactSection}>
                <TextOutput
                  label="Glide No:"
                  value={dref?.glide_code}
                />
                <View style={pdfStyles.twoByThree}>
                  <View style={pdfStyles.compactSection}>
                    <View style={[pdfStyles.compactSection, { width: '100%' }]}>
                      <TextOutput
                        label="People (affected / at risk):"
                        value={`${dref?.num_affected} ${dref?.num_affected ? 'people' : ''}`}
                        columns="1/2"
                      />
                      <TextOutput
                        label="People to be assisted:"
                        value={`${dref?.num_assisted} ${dref?.num_assisted ? 'people' : ''}`}
                        columns="1/2"
                      />
                    </View>
                  </View>
                  <View style={pdfStyles.compactSection}>
                    <View style={pdfStyles.compactSection}>
                      <TextOutput
                        label="DREF launched"
                        value={dref?.date_of_approval}
                        columns="1/2"
                      />
                      <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                        <TextOutput
                          label="DREF ends"
                          value={dref?.end_date}
                          columns="1/2"
                        />
                        <TextOutput
                          label="Operation timeframe"
                          value={`${dref?.operation_timeframe} months`}
                          columns="1/2"
                        />
                      </View>
                    </View>
                  </View>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label="Affected areas"
                      columns="3/3"
                    />
                  </View>
                </View>
              </View>
            </View>
          </PDFPage>
          <PDFPage
            size="A4"
            style={pdfStyles.page}
          >
            <View style={pdfStyles.section}>
              <View style={[pdfStyles.section, { alignItems: 'flex-start' }]}>
                <View
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f0f0f0',
                    width: 260,
                    height: 360,
                  }}
                >
                  <Text>
                    Image
                  </Text>
                </View>
                <View
                  style={{
                    padding: 10,
                  }}
                >
                  <View>
                    <Text style={pdfStyles.heading}>
                      Description of the Event
                    </Text>
                    <Text style={pdfStyles.subHeading}>
                      What happened, where and when?
                    </Text>
                  </View>
                  <View>
                    <Text style={pdfStyles.subHeading}>
                      Scope and Scale
                    </Text>
                    <Text>
                      lorem ipsum
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </PDFPage>
          <PDFPage
            size="A4"
            style={pdfStyles.page}
          >
            <Text style={pdfStyles.heading}>
              Previous Operations
            </Text>
          </PDFPage>
        </Document>
      </PDFViewer>
    </Page>
  );
}

export default DrefPdfExport;
