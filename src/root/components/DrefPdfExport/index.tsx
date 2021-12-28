import React from 'react';
import type { History, Location } from 'history';
import type { match as Match } from 'react-router-dom';
import {
  Page as PDFPage,
  Text,
  Link,
  View,
  Document,
  Image as PDFImage,
  PDFViewer,
  Font,
} from '@react-pdf/renderer';
import {
  addSeparator,
  listToMap,
} from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import Page from '#components/Page';
import { useRequest } from '#utils/restRequest';
import { DrefApiFields } from '#views/DrefApplicationForm/common';
import LanguageContext from '#root/languageContext';

import montserratFont from './resources/montserrat.bold.ttf';
import opensansFont from './resources/open-sans.regular.ttf';
import opensansBoldFont from './resources/open-sans.bold.ttf';

import {
  NumericKeyValuePair,
  StringKeyValuePair,
} from '#types';

import pdfStyles from './pdfStyles';
import styles from './styles.module.scss';

const pendingRecords: Record<string, boolean> = {};

function usePendingCounts() {
  const set = React.useCallback((key: string) => {
    pendingRecords[key] = true;
  }, []);

  const resolve = React.useCallback((key: string) => {
    pendingRecords[key] = false;
  }, []);

  const isPending = Object.values(pendingRecords).some(d => d === true);

  return {
    isPending,
    setPending: set,
    resolvePending:resolve 
  };
}

Font.register({
  family: 'Montserrat',
  src: montserratFont,
  fontWeight: 'bold',
});

Font.register({
  family: 'OpenSans',
  src: opensansFont,
  fontWeight: 'medium',
});

Font.register({
  family: 'OpenSans',
  src: opensansBoldFont,
  fontWeight: 'bold',
});

function loadImage(src: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.height = img.height;
      canvas.width = img.width;

      if (ctx) {
        ctx.drawImage(img, 0, 0);
      }

      resolve(canvas.toDataURL());
    };

    img.src = src;
  });
}

interface NationalSocietyActionsProps {
  data: DrefApiFields['national_society_actions'][number];
  nsaMap?: Record<string, string>;
}

function NationalSocietyActions(props: NationalSocietyActionsProps) {
  const {
    data,
    nsaMap = {},
  } = props;

  return (
    <View style={pdfStyles.nsaOutput}>
      <Text>
        {'\u2022'} {nsaMap[data.title]}
      </Text>
    </View>
  );
}

interface NeedIdentifiedProps {
  data: DrefApiFields['needs_identified'][number];
  niMap?: Record<string, string>;
}

function NeedIdentified(props: NeedIdentifiedProps) {
  const {
    data,
    niMap = {},
  } = props;

  return (
    <View style={pdfStyles.niOutput}>
      <View style={pdfStyles.niHeaderCell}>
        <Text>
          {niMap[data.title]}
        </Text>
      </View>
      <View style={pdfStyles.niContentCell}>
        <Text>
          {data.description}
        </Text>
      </View>
    </View>
  );
}

interface PlannedInterventionProps {
  data: DrefApiFields['planned_interventions'][number];
  piMap?: Record<string, string>;
}

function PlannedInterventionOutput(props: PlannedInterventionProps) {
  const { strings } = React.useContext(LanguageContext);
  const {
    data,
    piMap = {},
  } = props;

  const { setPending, resolvePending } = usePendingCounts();
  const [icon, setIcon] = React.useState<string | undefined>();
  React.useEffect(() => {
    const key = data?.id;
    if (key && data?.image_url) {
      setPending(`pi-${key}`);
      loadImage(data.image_url).then((img) => {
        setIcon(img);
        resolvePending(`pi-${key}`);
      });
    }

    return () => {
        resolvePending(`pi-${key}`);
    };
  }, [setPending, resolvePending, data?.image_url, data?.id]);

  return (
    <View style={pdfStyles.piOutput}>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell}>
          {icon && (
            <PDFImage
              style={pdfStyles.piIcon}
              src={icon}
            />
          )}
        </View>
        <View style={pdfStyles.piHeaderCell}>
          <Text style={{ color: '#011e41' }}>
            {piMap[data.title]}
          </Text>
        </View>
        <View style={[pdfStyles.piContentCell, { flexDirection: 'column' }]}>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefFormPdfBudget}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              CHF {data.budget}
            </Text>
          </View>
          <View style={pdfStyles.piSubRow}>
            <Text style={pdfStyles.piSubHeadingCell}>
              {strings.drefFormPdfTargetPersons}
            </Text>
            <Text style={pdfStyles.piSubContentCell}>
              {data.person_targeted}
            </Text>
          </View>
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell} />
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.drefFormPdfIndicators}
          </Text>
        </View>
        <View style={pdfStyles.piContentCell}>
          <Text style={pdfStyles.piBorderCell}>
            {data.indicator}
          </Text>
        </View>
      </View>
      <View style={pdfStyles.piRow}>
        <View style={pdfStyles.piIconCell} />
        <View style={pdfStyles.piHeaderCell}>
          <Text>
            {strings.drefFormPdfPriorityActions}
          </Text>
        </View>
        <View style={pdfStyles.piContentCell}>
          <Text style={pdfStyles.piBorderCell}>
            {data.description}
          </Text>
        </View>
      </View>
    </View>
  );
}

function booleanToYesNo(value: boolean | undefined | null) {
  if (value === true) {
    return 'Yes';
  }

  if (value === false) {
    return 'No';
  }

  return '-';
}

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
      <Text>
        {label}
      </Text>
      <Text style={pdfStyles.value}>
        {value}
      </Text>
    </View>
  );
}

interface DrefOptions {
  disaster_category: NumericKeyValuePair[];
  national_society_actions: StringKeyValuePair[];
  needs_identified: StringKeyValuePair[];
  planned_interventions: StringKeyValuePair[];
  status: NumericKeyValuePair[];
  type_of_onset: NumericKeyValuePair[];
  users: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
  }[];
}

interface Props {
  className?: string;
  match: Match<{ drefId?: string }>;
  history: History;
  location: Location;
  isImminentOnset: boolean;
}

function DrefPdfExport(props: Props) {
  const { strings } = React.useContext(LanguageContext);
  const {
    className,
    match,
  } = props;

  const {
    isPending: imageResourcesPending,
    setPending,
    resolvePending,
  } = usePendingCounts();

  const [coverImage, setCoverImage] = React.useState<string | undefined>();
  const [mapImage, setMapImage] = React.useState<string | undefined>();
  const [budgetOverview, setBudgetOverview] = React.useState<string | undefined>();
  const [ifrcLogo, setIfrcLogo] = React.useState<string | undefined>();

  const { drefId } = match.params;

  const {
    pending: fetchingDref,
    response: dref,
  } = useRequest<DrefApiFields>({
    skip: !drefId,
    url: `api/v2/dref/${drefId}/`,
  });

  const {
    pending: fetchingDrefOptions,
    response: drefOptions,
  } = useRequest<DrefOptions>({
    url: 'api/v2/dref-options/',
  });

  const pending = fetchingDref || fetchingDrefOptions;

  const [
    piMap,
    niMap,
    nsaMap,
  ] = React.useMemo(() => {
    if (!drefOptions) {
      return [
        {},
        {}
      ];
    }

    return [
      listToMap(drefOptions.planned_interventions, d => d.key, d => d.value),
      listToMap(drefOptions.needs_identified, d => d.key, d => d.value),
      listToMap(drefOptions.national_society_actions, d => d.key, d => d.value),
    ];
  }, [drefOptions]);

  React.useEffect(() => {
    const key = dref?.budget_file;

    if (key && dref?.budget_file_preview) {
      setPending(`dref-budget-${key}`);
      loadImage(dref.budget_file_preview).then((img) => {
        setBudgetOverview(img);
        resolvePending(`dref-budget-${key}`);
      });
    }

    return () => {
      resolvePending(`dref-budget-${key}`);
    };
  }, [dref?.budget_file_preview, dref?.budget_file, setPending, resolvePending]);

  React.useEffect(() => {
    const key = dref?.event_map;

    if (key && dref?.event_map_details) {
      setPending(`event-map-${key}`);
      loadImage(dref.event_map_details.file).then((img) => {
        setMapImage(img);
        resolvePending(`event-map-${key}`);
      });
    }

    return () => {
      resolvePending(`event-map-${key}`);
    };
  }, [dref?.event_map_details, dref?.event_map, setPending, resolvePending]);

  React.useEffect(() => {
    const key = dref?.cover_image;
    if (dref?.cover_image_details) {
      setPending(`cover-image-${key}`);
      loadImage(dref.cover_image_details.file).then((img) => {
        setCoverImage(img);
        resolvePending(`cover-image-${key}`);
      });
    }
    return () => {
      resolvePending(`cover-image-${key}`);
    };
  }, [dref?.cover_image_details, dref?.cover_image, setPending, resolvePending]);

  const affectedAreas = React.useMemo(() => {
    if (dref?.country_district) {
      let areas = '';
      const districts = dref.country_district.map(d => d.district_details);

      districts.forEach(d => {
        const names = d.map(dd => dd.name);
        areas += names.join(', ');
      });

      return areas;
    }

    return undefined;
  }, [dref?.country_district]);

  React.useEffect(() => {
    loadImage('/assets/graphics/layout/go-logo-2020.png').then((img) => {
      setIfrcLogo(img);
    });
  }, []);


  return (
    <Page
      className={className}
      heading="DREF Export"
    >
      {pending && imageResourcesPending ? (
        <BlockLoading />
      ) : (
        <PDFViewer className={styles.pdfPreview}>
          <Document>
            <PDFPage
              size="A4"
              style={pdfStyles.page}
            >
              <View style={pdfStyles.section}>
                {ifrcLogo && (
                  <PDFImage
                    style={pdfStyles.logo}
                    src={ifrcLogo}
                  />
                )}
                <View style={[ { alignSelf: 'flex-end' } ]} >
                  <Text style={pdfStyles.title}>
                    {strings.drefFormPdfTitle}
                  </Text>
                  <Text style={pdfStyles.subHeading}>
                    {[
                      dref?.country_district.map(d => d.country_details?.name).join(', '),
                      dref?.title
                    ].join(' | ')}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.section}>
                {(coverImage || ifrcLogo) && (
                  <PDFImage
                    style={pdfStyles.bannerImage}
                    src={coverImage ?? ifrcLogo}
                  />
                )}
              </View>
              <View style={pdfStyles.section}>
                <View style={pdfStyles.basicInfoTable}>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label={strings.drefFormPdfAppealNum}
                      value={dref?.appeal_code}
                    />
                    <TextOutput
                      label={strings.drefFormPdfDrefAllocated}
                      value={`CHF ${addSeparator(dref?.amount_requested ?? '') ?? '-'}`}
                      columns="2/3"
                    />
                  </View>
                  <View style={pdfStyles.compactSection}>
                    <TextOutput
                      label={strings.drefFormPdfGlideNum}
                      value={dref?.glide_code}
                    />
                    <View style={pdfStyles.twoByThree}>
                      <View style={pdfStyles.compactSection}>
                        <View style={pdfStyles.compactSection}>
                          <TextOutput
                            label={strings.drefFormPdfPeopleAffected}
                            value={`${dref?.num_affected} ${dref?.num_affected ? 'people' : ''}`}
                            columns="1/2"
                          />
                          <TextOutput
                            label={strings.drefFormPdfPeopleAssisted}
                            value={`${dref?.num_assisted} ${dref?.num_assisted ? 'people' : ''}`}
                            columns="1/2"
                          />
                        </View>
                      </View>
                      <View style={pdfStyles.compactSection}>
                        <View style={pdfStyles.compactSection}>
                          <TextOutput
                            label={strings.drefFormPdfDrefLaunched}
                            value={dref?.date_of_approval}
                            columns="1/2"
                          />
                          <View style={[pdfStyles.compactSection, pdfStyles.oneByTwo]}>
                            <TextOutput
                              label={strings.drefFormPdfDrefEnds}
                              value={dref?.end_date}
                              columns="1/2"
                            />
                            <TextOutput
                              label={strings.drefFormPdfOperationTimeframeSubmission}
                              value={`${dref?.operation_timeframe} months`}
                              columns="1/2"
                            />
                          </View>
                        </View>
                      </View>
                      <View style={pdfStyles.compactSection}>
                        <TextOutput
                          label={strings.drefFormPdfAffectedAreas}
                          value={affectedAreas}
                          columns="3/3"
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </PDFPage>
            <PDFPage
              size="A4"
              style={pdfStyles.page}
            >
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfDrescriptionOfTheEvent}
                </Text>
              </View>
              <View style={pdfStyles.verticalSection}>
                {mapImage && (
                  <PDFImage
                    style={pdfStyles.mapImage}
                    src={mapImage}
                  />
                )}
              </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.subHeading}>
                  {dref?.anticipatory_actions == null ? strings.drefFormPdfWhatWhereWhen : strings.drefFormPdfImmientDisaster}
                </Text>
                <Text>
                  {dref?.event_description}
                </Text>
              </View>
              {dref?.anticipatory_actions != null &&
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.subHeading}>
                  {strings.drefFormPdfTargetCommunities}
                </Text>
                <Text>
                  {dref?.anticipatory_actions}
                </Text>
              </View>
              }
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.subHeading}>
                  {strings.drefFormPdfScopeAndScale}
                </Text>
                <Text>
                  {dref?.event_scope}
                </Text>
              </View>
            </PDFPage>
            <PDFPage
              size="A4"
              style={pdfStyles.page}
            >
              <View>
                <View style={[pdfStyles.section, pdfStyles.table]}>
                  <Text style={pdfStyles.heading}>
                    {strings.drefFormPdfPreviousOperations}
                  </Text>
                  <View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormPdfAffectSameArea}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.affect_same_area)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormPdfAffectedthePopulationTitle}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.affect_same_population)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormPdfNsRespond}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.ns_respond)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormPdfNsRequest}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{booleanToYesNo(dref?.ns_request_fund)}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormPdfNsFundingDetail}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{dref?.ns_request_text ?? '-'}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text> {strings.drefFormPdfRecurrentText}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{dref?.dref_recurrent_text}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.row}>
                      <View style={pdfStyles.cell}>
                        <Text>{strings.drefFormPdfLessonsLearnedTitle}</Text>
                        <Text>{strings.drefFormPdfLessonsLearnedDescription}</Text>
                      </View>
                      <View style={pdfStyles.cell}>
                        <Text>{dref?.lessons_learned}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfCurrentNationalSocietyAction}
                </Text>
                {dref?.national_society_actions.map((nsa) => (
                  <NationalSocietyActions
                    key={nsa.id}
                    data={nsa}
                    nsaMap={nsaMap} />
                ))}
              </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfMovementPartnersActions}
                </Text>
              </View>
              <View style={pdfStyles.verticalSection}>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.niHeaderCell}>
                    <Text>{strings.drefFormPdfIfrc}</Text>
                  </View>
                  <View style={pdfStyles.niContentCell}>
                    <Text>{dref?.ifrc}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.niHeaderCell}>
                    <Text>{strings.drefFormPdfIcrc}</Text>
                  </View>
                  <View style={pdfStyles.niContentCell}>
                    <Text>{dref?.icrc}</Text>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.niHeaderCell}>
                    <Text>{strings.drefFormPdfPartnerNationalSociety}</Text>
                  </View>
                  <View style={pdfStyles.niContentCell}>
                    <Text>{dref?.partner_national_society}</Text>
                  </View>
                </View>
              </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfNationalOtherActors}
                </Text>
                <View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.niHeaderCell}>
                      <Text>{strings.drefFormPdfInternationalAssistance}</Text>
                    </View>
                    <View style={pdfStyles.niContentCell}>
                      <Text>{booleanToYesNo(dref?.government_requested_assistance)}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.niHeaderCell}>
                      <Text>{strings.drefFormPdfNationalAuthorities}</Text>
                    </View>
                    <View style={pdfStyles.niContentCell}>
                      <Text>{dref?.national_authorities}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.niHeaderCell}>
                      <Text>{strings.drefFormPdfUNorOtherActors}</Text>
                    </View>
                    <View style={pdfStyles.niContentCell}>
                      <Text>{dref?.un_or_other_actor}</Text>
                    </View>
                  </View>
                  <View style={pdfStyles.row}>
                    <View style={pdfStyles.niHeaderCell}>
                      <Text>{strings.drefFormPdfCoordinationMechanism}</Text>
                    </View>
                    <View style={pdfStyles.niContentCell}>
                      <Text>{dref?.major_coordination_mechanism}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={pdfStyles.niSection}>
                <View style={pdfStyles.heading}>
                  <Text>{strings.drefFormPdfNeedsGapsIdentified}</Text>
                </View>
                {dref?.needs_identified.map((ni) => (
                  <NeedIdentified
                    key={ni.id}
                    data={ni}
                    niMap={niMap}
                  />
                ))}
              </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfTargetingStrategy}
                </Text>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormPdfPeopleAssistedthroughOperation}
                </Text>
                <Text>{dref?.people_assisted}</Text>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormPdfSelectionCriteriaRisk}
                </Text>
                <Text> {dref?.selection_criteria} </Text>
                <Text style={pdfStyles.textLabelSection}>
                  {strings.drefFormPdfProtectionGenderAndInclusion}
                </Text>
                <Text>{dref?.entity_affected} </Text>
              </View>
              <View style={[pdfStyles.section, pdfStyles.tpSection]}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfAssistedPopulation}
                </Text>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.tpHeaderCell}>
                    <Text>{strings.drefFormPdfTargetedPopulation}</Text>
                  </View>
                  <View style={pdfStyles.tpContentCell}>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfWomen}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.women}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfMen}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.men}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfGirls}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.girls}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfBoys}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.boys}</Text>
                      </View>
                    </View>
                    <View style={[pdfStyles.tpSubRow, { flexBasis: '100%' }]}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfTotal}</Text>
                      </View>
                      <View style={[pdfStyles.tpSubCell, { flexBasis: '75%' }]}>
                        <Text>{dref?.total_targated_population}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={pdfStyles.row}>
                  <View style={pdfStyles.tpHeaderCell}>
                    <Text>{strings.drefFormPdfEstimateResponse}</Text>
                  </View>
                  <View style={pdfStyles.tpContentCell}>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>
                          {strings.drefFormPdfEstimatePeopleDisability}
                        </Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.disability_people_per}</Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfEstimatedPercentage}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.people_per_urban}/{dref?.people_per_local} </Text>
                      </View>
                    </View>
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPdfEstimatedDisplacedPeople}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.displaced_people}</Text>
                      </View>
                    </View>
                    {dref?.anticipatory_actions != null &&
                    <View style={pdfStyles.tpSubRow}>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{strings.drefFormPeoplePdfTargetedWithEarlyActions}</Text>
                      </View>
                      <View style={pdfStyles.tpSubCell}>
                        <Text>{dref?.people_targeted_with_early_actions}</Text>
                      </View>
                    </View>
                    }
                  </View>
                </View>
              </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfObjectiveOperation}
                </Text>
                <Text>{dref?.operation_objective}</Text>
              </View>
                <View style={pdfStyles.verticalSection}>
                  <Text style={pdfStyles.heading}>
                    {strings.drefFormPdfResponseRationale}
                  </Text>
                  <Text>{dref?.response_strategy}</Text>
                </View>
              <View style={pdfStyles.verticalSection}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfSupportServices}
                </Text>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPdfHumanResourceDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.human_resource}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPdfSurgePersonnelDeployed}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.surge_personnel_deployed}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPdfLogisticCapacityOfNs}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.logistic_capacity_of_ns}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPdfSafetyConcerns}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.safety_concerns}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPdfPmerDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.pmer}
                  </Text>
                </View>
                <View style={pdfStyles.qna}>
                  <Text style={pdfStyles.textLabelSection}>
                    {strings.drefFormPdfCommunicationDescription}
                  </Text>
                  <Text style={pdfStyles.answer}>
                    {dref?.communication}
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.piSection}>
                <View style={pdfStyles.heading}>
                  <Text>
                    {strings.drefFormPdfPlannedIntervention}
                  </Text>
                </View>
                {dref?.planned_interventions.map((pi) => (
                  <PlannedInterventionOutput
                    key={pi.id}
                    data={pi}
                    piMap={piMap}
                  />
                ))}
              </View>
              {budgetOverview && (
                <View>
                  <PDFImage
                    src={budgetOverview}
                  />
                </View>
              )}
              <View style={[pdfStyles.section, pdfStyles.contactSection]}>
                <Text style={pdfStyles.heading}>
                  {strings.drefFormPdfContactInformation}
                </Text>
                <Text style={pdfStyles.subHeading}>
                  {strings.drefFormPdfContactDescription}
                </Text>

                <View style={pdfStyles.contactList}>
                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormPdfNationalSocietyContact}
                    </Text>
                    <Text>{dref?.national_society_contact_name}, </Text>
                    <Text>{dref?.national_society_contact_title}, </Text>
                    <Text>{dref?.national_society_contact_email}, </Text>
                    <Text>{dref?.national_society_contact_phone_number}</Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormPdfAppealManager}
                    </Text>
                    <Text>{dref?.ifrc_appeal_manager_name}, </Text>
                    <Text>{dref?.ifrc_appeal_manager_title}, </Text>
                    <Text>{dref?.ifrc_appeal_manager_email}, </Text>
                    <Text>{dref?.ifrc_appeal_manager_phone_number}</Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormPdfProjectManager}
                    </Text>
                    <Text>{dref?.ifrc_project_manager_name}, </Text>
                    <Text>{dref?.ifrc_project_manager_title}, </Text>
                    <Text>{dref?.ifrc_project_manager_email}, </Text>
                    <Text>{dref?.ifrc_project_manager_phone_number} </Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormPdfIfrcEmergency}
                    </Text>
                    <Text>{dref?.ifrc_emergency_name}, </Text>
                    <Text>{dref?.ifrc_emergency_title}, </Text>
                    <Text>{dref?.ifrc_emergency_email}, </Text>
                    <Text>{dref?.ifrc_emergency_phone_number}</Text>
                  </View>

                  <View style={pdfStyles.ciRow}>
                    <Text style={pdfStyles.contactType}>
                      {'\u2022'} {strings.drefFormPdfMediaContact}
                    </Text>
                    <Text>{dref?.media_contact_name}, </Text>
                    <Text>{dref?.media_contact_title}, </Text>
                    <Text>{dref?.media_contact_email}, </Text>
                    <Text>{dref?.media_contact_phone_number}</Text>
                  </View>
                </View>
              </View>
              <View style={pdfStyles.section}>
                <Link src="https://go.ifrc.org/emergencies">
                  {strings.drefFormPdfReference}
                </Link>
              </View>
            </PDFPage>
          </Document>
        </PDFViewer>
      )}
    </Page>
  );
}
export default DrefPdfExport;
