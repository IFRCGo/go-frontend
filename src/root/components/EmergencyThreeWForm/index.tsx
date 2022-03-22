import React from 'react';
import {
  _cs,
  listToMap,
  isDefined,
  isNotDefined,
  mapToMap,
  listToGroupList,
  mapToList,
  randomString,
  unique,
} from '@togglecorp/fujs';
import {
  useForm,
  PartialForm,
  getErrorObject,
  useFormArray,
} from '@togglecorp/toggle-form';
import {
  IoClose,
  IoEllipse,
  IoCheckmarkDone,
} from 'react-icons/io5';

import Backdrop from '#components/backdrop';
import TextOutput from '#components/TextOutput';
import NonFieldError from '#components/NonFieldError';
import Container from '#components/Container';
import BlockLoading from '#components/block-loading';
import Translate from '#components/Translate';
import Button from '#components/Button';
import InputSection from '#components/InputSection';
import Checklist from '#components/Checklist';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import SegmentInput from '#components/SegmentInput';
import DateInput from '#components/DateInput';
import {
  useLazyRequest,
  useRequest,
} from '#utils/restRequest';
import useAlert from '#hooks/useAlert';
import useBooleanState from '#hooks/useBooleanState';
import {
  EmergencyProjectResponse,
  EventMini,
} from '#types';
import {
  schema,
  useEmergencyThreeWoptions,
  EmergencyThreeWFormFields,
  ACTIVITY_LEADER_ERU,
  ACTIVITY_LEADER_NS,
  STATUS_COMPLETE,
  STATUS_ONGOING,
  STATUS_PLANNED,
  Sector,
  ActivityBase,
  Point,
} from './useEmergencyThreeWOptions';
import ERUInput from './ERUInput';
import EmergencyEventInput from './EmergencyEventInput';
import SectorInput from './SectorInput';

import styles from './styles.module.scss';

const labelSelector = (d: { label: string }) => d.label;
const numericValueSelector = (d: { value: number }) => d.value;
const stringValueSelector = (d: { value: string }) => d.value;

type ActivityPayload = Partial<Omit<ActivityBase, 'points'> & {
  client_id: string;
  sector: number;
  action: number | null;
  points: Partial<Point>[];
  custom_activity: string;
  supplies: Partial<Record<number, number | string>>;
  custom_supplies: Partial<Record<string, number | string>>;
}>

function transformFormValueToActivityPayload(
  formValues: PartialForm<EmergencyThreeWFormFields>,
  forError = false,
) {
  let activities: ActivityPayload[] = [];
  formValues.sectors && formValues.sectors.forEach((sector) => {
    if (sector.activities) {
      sector.activities.forEach((activity) => {
        activities.push({
          sector: sector.sector,
          ...activity,
          supplies: listToMap(activity.supplies, d => d.item as number, d => d.count),
          custom_supplies: listToMap(
            activity.custom_supplies,
            d => (forError ? d.client_id : d.item)  as string,
            d => forError ? d.item : d.count,
          ),
        });
      });
    }

    if (sector.custom_activities) {
      sector.custom_activities.forEach((customActivity) => {
        activities.push({
          sector: sector.sector,
          ...customActivity,
          custom_supplies: listToMap(
            customActivity.custom_supplies,
            d => (forError ? d.client_id : d.item)  as string,
            d => forError ? d.item : d.count,
          ),
        });
      });
    }
  });

  return activities;
}


const defaultFormValues: PartialForm<EmergencyThreeWFormFields> = {
  status: STATUS_COMPLETE,
  activity_lead: ACTIVITY_LEADER_NS,
};

function transformResponseToFormFields(response: EmergencyProjectResponse) {
  const formValues: PartialForm<EmergencyThreeWFormFields> = {
    title: response.title,
    country: response.country,
    districts: response.districts,
    status: response.status,
    event: response.event,
    start_date: response.start_date,
    end_date: response.end_date,
    activity_lead: response.activity_lead,
    deployed_eru: response.deployed_eru,
    reporting_ns: response.reporting_ns,
    reporting_ns_contact_email: response.reporting_ns_contact_email,
    reporting_ns_contact_role: response.reporting_ns_contact_role,
    reporting_ns_contact_name: response.reporting_ns_contact_name,
  };

  const sectorGroupedActivities = listToGroupList(
    response.activities,
    a => a.sector,
    a => a,
  );

  const sectorKeys = Object.keys(sectorGroupedActivities);

  const sectors: (typeof formValues)['sectors'] = sectorKeys.map((sk) => {
    const allActivities = sectorGroupedActivities[sk];
    const activities = allActivities.filter(a => isDefined(a.action)).map(
      a => ({
        ...a,
        sector: +sk,
        supplies: mapToList(
          a.supplies,
          (k, v) => ({
            client_id: v,
            item: +v,
            count: k,
          }),
        ),
        custom_supplies: mapToList(
          a.custom_supplies,
          (k, v) => ({
            client_id: randomString(),
            item: v,
            count: k,
          }),
        ),
      }),
    );
    const custom_activities = allActivities.filter(a => isNotDefined(a.action)).map(
      a => ({
        ...a,
        client_id: String(a.id),
        sector: +sk,
        custom_supplies: mapToList(
          a.custom_supplies,
          (k, v) => ({
            client_id: randomString(),
            item: v,
            count: k,
          }),
        ),
      }),
    );

    return {
      sector: +sk,
      activities,
      custom_activities,
    };
  }, []);

  formValues['sectors'] = sectors;
  return formValues;
}

function scrollToTop () {
  window.setTimeout(() => {
    window.scrollTo({
      top: Math.min(145, window.scrollY),
      left: 0,
      behavior: 'smooth',
    });
  }, 0);
}

function calculateStatus (
  startDate: string | undefined,
  endDate: string | undefined | null,
) {
  if (isNotDefined(startDate)) {
    return undefined;
  }

  const start = new Date(startDate);
  const now = new Date();

  if (start.getTime() > now.getTime()) {
    return STATUS_PLANNED;
  }

  if (isDefined(endDate)) {
    const end = new Date(endDate);
    if (end.getTime() < now.getTime()) {
      return STATUS_COMPLETE;
    }
  }

  return STATUS_ONGOING;
}


interface Props {
  projectId?: number;
  className?: string;
  onSubmitSuccess?: (result: EmergencyProjectResponse) => void;
  initialValue?: EmergencyProjectResponse;
}

function EmergencyThreeWForm(props: Props) {
  const {
    projectId,
    className,
    onSubmitSuccess,
    initialValue,
  } = props;

  const alert = useAlert();
  const [
    showSubmitConfirmation,
    setShowSubmitConfirmationTrue,
    setShowSubmitConfirmationFalse,
  ] = useBooleanState(false);

  const [finalValue, setFinalValue] = React.useState<PartialForm<EmergencyThreeWFormFields> | undefined>();

  const {
    value,
    error: formError,
    setFieldValue,
    validate,
    setError,
    setValue,
  } = useForm(
    schema,
    {
      value: {
        ...defaultFormValues,
        ...(initialValue ? transformResponseToFormFields(initialValue) : undefined),
      }
    },
  );

  React.useEffect(() => {
    const status = calculateStatus(value?.start_date, value?.end_date);
    setFieldValue(status, 'status');
  }, [setFieldValue, value?.start_date, value?.end_date]);

  const error = React.useMemo(() => getErrorObject(formError), [formError]);
  const [
    selectedEventDetails,
    setSelectedEventDetails,
  ] = React.useState<Pick<EventMini, 'id' | 'name'> | undefined>(initialValue?.event_details);
  const [fetchedEvents, setFetchedEvents] = React.useState<Pick<EventMini, 'id' | 'name'>[]>([]);

  React.useEffect(() => {
    if (selectedEventDetails) {
      setFetchedEvents((oldEvents) => {
        const newEvents = unique(
          [
            ...oldEvents,
            selectedEventDetails,
          ],
          d => d.id
        ) ?? [];

        return newEvents;
      });
    }
  }, [selectedEventDetails]);

  const {
    pending: projectResponsePending,
  } = useRequest<EmergencyProjectResponse>({
    skip: isNotDefined(projectId),
    url: `api/v2/emergency-project/${projectId}/`,
    onSuccess: (response) => {
      setSelectedEventDetails(response.event_details);
      const formValues = transformResponseToFormFields(response);
      setValue(formValues);
    },
  });

  const {
    trigger: postEmergencyThreeW,
    pending: postEmergencyPending,
  } = useLazyRequest<EmergencyProjectResponse>({
    method: isDefined(projectId) ? 'PUT' : 'POST',
    url: isDefined(projectId) ? `api/v2/emergency-project/${projectId}` : 'api/v2/emergency-project/',
    body: ctx => ctx,
    onSuccess: onSubmitSuccess,
    onFailure: ({
      value: {
        formErrors: formErrorsFromResponse,
        messageForNotification,
      },
      debugMessage,
    }) => {
      type CustomSupplyError = Record<string, string[]>;
      type SupplyError = Record<string, string[]>
      type PointError = Record<string, string[]>;

      type ActivityError = Record<string, string[]> & {
        custom_supplies: CustomSupplyError;
        supplies: SupplyError;
        points: PointError[];
      };

      type ErrorObj = {
        title?: string[];
        country?: string[];
        districts?: string[];
        status?: string[];
        event?: string[];
        start_date?: string[];
        activity_lead?: string[]
        reporting_ns?: string[];
        reporting_ns_contact_name?: string[];
        reporting_ns_contact_role?: string[];
        reporting_ns_contact_email?: string[];
        deployed_eru?: string[];
        activities?: ActivityError[];
      }
      if (formErrorsFromResponse) {
        const activities = transformFormValueToActivityPayload(value, true);
        const formErrorsWithType = formErrorsFromResponse as unknown as ErrorObj;

        const transformedError: typeof error = {
          title: formErrorsWithType?.title?.join(', '),
          country: formErrorsWithType?.country?.join(', '),
          districts: formErrorsWithType?.districts?.join(', '),
          status: formErrorsWithType?.status?.join(', '),
          event: formErrorsWithType?.event?.join(', '),
          start_date: formErrorsWithType?.start_date?.join(', '),
          activity_lead: formErrorsWithType?.activity_lead?.join(', '),
          reporting_ns: formErrorsWithType?.reporting_ns?.join(', '),
          reporting_ns_contact_name: formErrorsWithType?.reporting_ns_contact_name?.join(', '),
          reporting_ns_contact_role: formErrorsWithType?.reporting_ns_contact_role?.join(', '),
          reporting_ns_contact_email: formErrorsWithType?.reporting_ns_contact_email?.join(', '),
          deployed_eru: formErrorsWithType?.deployed_eru?.join(', '),
          sectors: activities.reduce((acc, activity, i) => {
            const err = formErrorsWithType?.activities?.[i];
            if (!err) {
              return acc;
            }

            if (!activity.sector) {
              return acc;
            }

            if (!acc[activity.sector]) {
              acc[activity.sector] = {};
            }

            if (!acc[activity.sector]?.['activities']) {
              acc[activity.sector]['activities'] = {};
            }

            if (!acc[activity.sector]['custom_activities']) {
              acc[activity.sector]['custom_activities'] = {};
            }

            let baseActivityError: Record<string, string | string[] | {} | undefined> = {};
            const baseActivityKeys = [
              'is_simplified_report',
              'beneficiaries_count',
              'amount',

              'people_households',
              'household_count',
              'people_count',
              'male_count',
              'female_count',
              'point_count',

              'female_0_1_count',
              'female_1_5_count',
              'female_6_12_count',
              'female_13_17_count',
              'female_18_59_count',
              'female_50_plus_count',
              'female_unknown_age_count',

              'male_0_1_count',
              'male_1_5_count',
              'male_6_12_count',
              'male_13_17_count',
              'male_18_59_count',
              'male_50_plus_count',
              'male_unknown_age_count',

              'other_0_1_count',
              'other_1_5_count',
              'other_6_12_count',
              'other_13_17_count',
              'other_18_59_count',
              'other_50_plus_count',
              'other_unknown_age_count',

              'is_disaggregated_for_disabled',

              'disabled_female_0_1_count',
              'disabled_female_1_5_count',
              'disabled_female_6_12_count',
              'disabled_female_13_17_count',
              'disabled_female_18_59_count',
              'disabled_female_50_plus_count',
              'disabled_female_unknown_age_count',

              'disabled_male_0_1_count',
              'disabled_male_1_5_count',
              'disabled_male_6_12_count',
              'disabled_male_13_17_count',
              'disabled_male_18_59_count',
              'disabled_male_50_plus_count',
              'disabled_male_unknown_age_count',

              'disabled_other_0_1_count',
              'disabled_other_1_5_count',
              'disabled_other_6_12_count',
              'disabled_other_13_17_count',
              'disabled_other_18_59_count',
              'disabled_other_50_plus_count',
              'disabled_other_unknown_age_count',

              'details',
            ] as const;

            baseActivityKeys.forEach((bak) => {
              if (err[bak]) {
                baseActivityError[bak] = err[bak].join(', ');
              }
            });

            if (err.points) {
              baseActivityError['points'] = listToMap(
                activity.points ?? [],
                (p) => p.client_id as string,
                (_, __, pi) => {
                  const pointErr = err.points[pi] as Record<string, string[]>;
                  let finalPointError: {
                    description?: string;
                    latitude?: string;
                    longitude?: string;
                  } = {};

                  if (pointErr.description) {
                    finalPointError['description'] = pointErr.description.join(', ');
                  }

                  if (pointErr.latitude) {
                    finalPointError['latitude'] = pointErr.latitude.join(', ');
                  }

                  if (pointErr.longitude) {
                    finalPointError['longitude'] = pointErr.longitude.join(', ');
                  }

                  return finalPointError;
                }
              );
            }

            if (err.custom_supplies) {
              baseActivityError['custom_supplies'] = mapToMap(
                activity.custom_supplies,
                (k) => k,
                (v) => ({ count: err.custom_supplies[v as number]?.join(', ') }),
              );
            }

            if (isDefined(activity.action)) {
              if (!acc[activity.sector]['activities'][activity.action]) {
                acc[activity.sector]['activities'][activity.action] = {};
              }

              if (err.supplies) {
                baseActivityError['supplies'] = err.supplies;
              }

              acc[activity.sector]['activities'][activity.action] = baseActivityError;
            } else {
              if (activity.client_id) {
                if (!acc[activity.sector]['custom_activities'][activity.client_id]) {
                  acc[activity.sector]['custom_activities'][activity.client_id] = {};
                }

                acc[activity.sector]['custom_activities'][activity.client_id] = baseActivityError;
              }
            }

            return acc;
          }, {} as Record<string, any>),
        };

        setError(transformedError);
        scrollToTop();
      }
      alert.show(
        (
          <Translate
            stringId="projectFormFailedToSubmit"
            params={{ message: (
              <strong>
                {messageForNotification}
              </strong>
            )}}
          />
        ),
        {
          variant: 'danger',
          debugMessage,
        },
      );
    },
  });

  const validateAndConfirmSubmission = React.useCallback(() => {
    const result = validate();
    if (result.errored || !result.value) {
      setError(result.error);
      scrollToTop();
      return;
    }

    setShowSubmitConfirmationTrue();
    setFinalValue(result.value);

  }, [validate, setError, setShowSubmitConfirmationTrue]);

  const submitForm = React.useCallback(() => {
    if (finalValue) {
      const activities: ActivityPayload[] = transformFormValueToActivityPayload(finalValue);
      const payload = { ...finalValue };
      delete payload.sectors;

      postEmergencyThreeW({
        ...payload,
        activities,
      });

      setShowSubmitConfirmationFalse();
    } else {
      // Should never happen
      console.error('Unknown error occured');
    }
  }, [finalValue, postEmergencyThreeW, setShowSubmitConfirmationFalse]);

  const {
    activityLeaderOptions,
    nationalSocietyOptions,
    eruOptions,
    sectorOptions,
    activityOptionListBySector,
    sectorIdToLabelMap,
    supplyOptionListByActivity,
    countryOptions,
    districtOptions,
    fetchingOptions,
    averageHouseholdSizeForSelectedCountry,
    statusMap,
  } = useEmergencyThreeWoptions(value);

  const handleSectorChange = React.useCallback((newSectorList: number[] | undefined) => {
    setFieldValue(
      (oldValue: PartialForm<Sector>[] | undefined) => {
        const sectorsMap = listToMap(
          oldValue,
          (s) => s.sector as number,
          (s) => s,
        );

        const newValue = newSectorList?.map((s) => (
          sectorsMap?.[s] ?? { sector: s }
        ));

        return newValue;
      },
      'sectors',
    );
  }, [setFieldValue]);

  const sectorValue = React.useMemo(() => (
    value?.sectors?.map(s => s.sector).filter(isDefined)
  ), [value?.sectors]);

  const { setValue: setSector } = useFormArray<'sectors', PartialForm<Sector>>(
    'sectors',
    setFieldValue,
  );

  const handleSelectAllRegionClick = React.useCallback(() => {
    setFieldValue(
      districtOptions?.map(d => d.value),
      'districts',
    );
  }, [districtOptions, setFieldValue]);

  const inputsDisabled = postEmergencyPending;

  return (
    <div
      className={_cs(styles.emergencyThreeWForm, className)}
    >
      {(fetchingOptions || projectResponsePending) ? (
        <BlockLoading />
      ) : (
        <>
          <NonFieldError
            className={styles.nonFieldError}
            error={error}
            message="Please correct all errors below before submission"
          />
          <Container
            sub
            contentClassName={styles.operationDetailContent}
            visibleOverflow
            heading="Operation Details"
          >
            <InputSection
              title="Current IFRC Operation"
              description="If operation does not appear in the dropdown, the operation does not yet exist in GO. In that case, please submit a new Field Report to generate the operation, then come back to this form"
            >
              <EmergencyEventInput
                name={"event" as const}
                value={value?.event}
                onChange={setFieldValue}
                error={error?.event}
                fetchedEvents={fetchedEvents}
                setFetchedEvents={setFetchedEvents}
            />
            </InputSection>
            <InputSection
              title="Country and Province/Region"
              description="Select areas where activities reported in this form are occuring "
            >
              <SelectInput
                label="Country"
                name={"country" as const}
                options={countryOptions}
                value={value?.country}
                onChange={setFieldValue}
                error={error?.country}
                placeholder={isDefined(value?.event) ? 'Select a country' : 'Please select an IFRC Operation first'}
                disabled={inputsDisabled || isNotDefined(value?.event)}
              />
              <SelectInput
                label="Region/Province"
                name={"districts" as const}
                options={districtOptions}
                value={value?.districts}
                onChange={setFieldValue}
                error={error?.districts}
                placeholder={isDefined(value?.country) ? 'Select one or more region' : 'Select a country first'}
                disabled={inputsDisabled || isNotDefined(value?.country)}
                isMulti
                actions={(
                  <Button
                    variant="action"
                    name={undefined}
                    title="Select all"
                    onClick={handleSelectAllRegionClick}
                  >
                    <IoCheckmarkDone />
                  </Button>
                )}
            />
            </InputSection>
            <InputSection
              title="Estimated Start and End Dates"
              description={(
                <>
                  <p>
                    Select the date when the work on the activity begins.
                  </p>
                  <p>
                    The project status (planned and ongoing) is automatically defined by the entered dates. If there is no End Date, it can be left empty
                  </p>
                </>
              )}
              twoColumn
              multiRow
            >
              <DateInput
                name="start_date"
                label="Start date"
                value={value?.start_date}
                error={error?.start_date}
                onChange={setFieldValue}
              />
              <DateInput
                name="end_date"
                label="End date"
                value={value?.end_date}
                error={error?.end_date}
                onChange={setFieldValue}
              />
              <TextOutput
                className={styles.statusDisplay}
                label="Project Status"
                value={isDefined(value?.status) ? statusMap[value?.status] : '--'}
                strongValue
              />
            </InputSection>
            <InputSection
              title="Activity Description"
            >
              <TextInput
                name="title"
                value={value?.title}
                error={error?.title}
                onChange={setFieldValue}
                placeholder="Enter brief description"
              />
            </InputSection>
            <InputSection title="Who is Leading the Activity?">
              <SegmentInput
                name={"activity_lead" as const}
                onChange={setFieldValue}
                options={activityLeaderOptions}
                labelSelector={labelSelector}
                keySelector={stringValueSelector}
                value={value?.activity_lead}
                error={error?.activity_lead}
              />
            </InputSection>
            {value?.activity_lead === ACTIVITY_LEADER_NS && (
              <>
                <InputSection
                  title="National Society"
                  description="Which National Society is conducting the activity?"
                >
                  <SelectInput
                    name={"reporting_ns" as const}
                    options={nationalSocietyOptions}
                    onChange={setFieldValue}
                    value={value?.reporting_ns}
                    error={error?.reporting_ns}
                  />
                </InputSection>
                <InputSection
                  title="Contact Information"
                  description="Who should be contacted for any coordination matters related to this response activity?"
                >
                  <TextInput
                    name="reporting_ns_contact_name"
                    label="Name"
                    value={value?.reporting_ns_contact_name}
                    onChange={setFieldValue}
                    error={error?.reporting_ns_contact_name}
                  />
                  <TextInput
                    name="reporting_ns_contact_role"
                    label="Role"
                    value={value?.reporting_ns_contact_role}
                    onChange={setFieldValue}
                    error={error?.reporting_ns_contact_role}
                  />
                  <TextInput
                    name="reporting_ns_contact_email"
                    label="Email"
                    value={value?.reporting_ns_contact_email}
                    onChange={setFieldValue}
                    error={error?.reporting_ns_contact_email}
                  />
                </InputSection>
              </>
            )}
            {value?.activity_lead === ACTIVITY_LEADER_ERU && (
              <InputSection
                title="ERU"
                description="Which ERU is conducting the response activity?"
              >
                <ERUInput
                  name={"deployed_eru" as const}
                  value={value?.deployed_eru}
                  onChange={setFieldValue}
                  options={eruOptions}
                  error={error?.deployed_eru}
                />
              </InputSection>
            )}
          </Container>
          <Container
            heading="Activity Reporting"
            sub
            visibleOverflow
            contentClassName={styles.activityReportingContent}
          >
            <InputSection
              title="Types of Actions Taken"
              description="Select the actions that are being across all of the locations tagged above"
              multiRow
              oneColumn
            >
              <NonFieldError error={getErrorObject(error?.sectors)} />
              <Checklist
                name="sectors"
                options={sectorOptions}
                onChange={handleSectorChange}
                value={sectorValue}
                keySelector={numericValueSelector}
                labelSelector={labelSelector}
              />
            </InputSection>
            {value?.sectors?.map((s, i) => {
              if (isDefined(s.sector)) {
                return (
                  <SectorInput
                    key={s.sector}
                    index={i}
                    sectorTitle={sectorIdToLabelMap?.[s.sector] ?? ''}
                    actionOptions={activityOptionListBySector[s.sector]}
                    onChange={setSector}
                    value={s}
                    supplyOptionListByActivity={supplyOptionListByActivity}
                    error={getErrorObject(error?.sectors)}
                    averageHouseholdSizeForSelectedCountry={averageHouseholdSizeForSelectedCountry}
                  />
                );
              }

              return null;
            })}
            <NonFieldError
              className={styles.nonFieldError}
              error={error}
              message="Please correct all errors above before submission"
            />
            <div className={styles.actions}>
              <Button
                name={undefined}
                onClick={validateAndConfirmSubmission}
                disabled={postEmergencyPending}
              >
                {postEmergencyPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </Container>
        </>
      )}
      {showSubmitConfirmation && (
        <Backdrop className={styles.submitConfirmationBackdrop}>
          <Container
            className={styles.submitConfirmation}
            heading="3W Monitoring Form"
            sub
            actions={(
              <Button
                name={undefined}
                variant="action"
                onClick={setShowSubmitConfirmationFalse}
              >
                <IoClose />
              </Button>
            )}
            contentClassName={styles.content}
            footer={(
              <div className={styles.footer}>
                <div className={styles.actions}>
                  <Button
                    name={undefined}
                    variant="primary"
                    onClick={submitForm}
                  >
                    Submit
                  </Button>
                </div>
                <div className={styles.note}>
                  If you have any questions, contact the IM team &nbsp;
                  <a
                    href="mailto:im@ifrc.org"
                    target="_blank"
                    className={styles.link}
                  >
                    im@ifrc.org
                  </a>
                </div>
              </div>
            )}
          >
            <div className={styles.message}>
              You are about to submit your entry for 3W for &nbsp;
              <span className={styles.eventName}>
                {fetchedEvents.find(e => e.id === value?.event)?.name}
              </span> emergency. Please review your selections below before submission.
            </div>
            <div className={styles.meta}>
              <TextOutput
                labelContainerClassName={styles.metaLabel}
                label="Country"
                value={countryOptions.find(c => c.value === value?.country)?.label}
                strongValue
              />
              <TextOutput
                labelContainerClassName={styles.metaLabel}
                label="Start date"
                value={value?.start_date}
                valueType="date"
                strongValue
              />
              <TextOutput
                labelContainerClassName={styles.metaLabel}
                label="Who is leading the Activity?"
                strongValue
                value={(value?.activity_lead === ACTIVITY_LEADER_ERU) ? (
                  eruOptions.find((e) => e.id === value?.deployed_eru)?.eru_owner?.national_society_country?.society_name
                ) : (
                  nationalSocietyOptions.find((ns) => ns.value === value?.reporting_ns)?.label
                )}
              />
              <TextOutput
                labelContainerClassName={styles.metaLabel}
                className={styles.actionsOutput}
                label="Actions Taken"
                valueContainerClassName={styles.actions}
                value={value?.sectors?.map(
                  (sector) => {
                    if (!sector || !sector.sector) {
                      return null;
                    }

                    return (
                      <div
                        className={styles.sectorOutput}
                        key={sector.sector}
                      >
                        <div className={styles.title}>
                          {sectorIdToLabelMap?.[sector.sector]}
                        </div>
                        <div className={styles.activityList}>
                          {sector.activities?.map((activity) => {
                            if (!sector || !sector.sector) {
                              return null;
                            }

                            const activityDisplay = activityOptionListBySector[sector.sector].find(
                              (a) => a.value === activity.action
                            )?.label;

                            return (
                              <div
                                key={activity.action}
                                className={styles.listItem}
                              >
                                <IoEllipse className={styles.icon} />
                                <div className={styles.label}>
                                  {activityDisplay}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className={styles.customActivityList}>
                          {sector.custom_activities?.map((customActivity) => {
                            return (
                              <div
                                key={customActivity.client_id}
                                className={styles.listItem}
                              >
                                <IoEllipse className={styles.icon} />
                                <div className={styles.label}>
                                  {customActivity?.custom_action}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                )}
              />
            </div>
          </Container>
        </Backdrop>
      )}
    </div>
  );
}

export default EmergencyThreeWForm;
