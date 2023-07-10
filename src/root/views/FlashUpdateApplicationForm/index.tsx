import React from 'react';
import {
  isDefined,
  listToMap,
  randomString,
  mapToMap,
  isNotDefined,
} from '@togglecorp/fujs';
import type { match as Match } from 'react-router-dom';
import type {
  History,
  Location
} from 'history';
import {
  getErrorObject,
  PartialForm,
  useForm,
  analyzeErrors,
} from '@togglecorp/toggle-form';

import Page from '#components/Page';
import Button from '#components/Button';
import LanguageContext from '#root/languageContext';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import Tabs from '#components/Tabs';
import Container from '#components/Container';
import NonFieldError from '#components/NonFieldError';
import TabPanel from '#components/Tabs/TabPanel';
import useAlert from '#hooks/useAlert';
import { useLazyRequest, useRequest } from '#utils/restRequest';
import BlockLoading from '#components/block-loading';
import useReduxState from '#hooks/useReduxState';
import { checkLanguageMismatch, isIfrcUser } from '#utils/common';
import FourHundredFour from '#views/FourHundredFour';
import Translate from '#components/Translate';
import { languageOptions } from '#utils/lang';

import Context from './Context';
import FocalPoints from './FocalPoint';
import ActionsInput from './ActionsInput';
import {
  FlashUpdateFields,
  FlashUpdateAPIFields,
  FlashUpdateAPIResponseFields,
  OrganizationType,
  transformFormFieldsToAPIFields,
  contextFields,
  actionsFields,
  focalFields
} from './common';
import useFlashUpdateFormOptions, {
  schema
} from './useFlashUpdateFormOptions';
import styles from './styles.module.scss';

interface Props {
  className?: string;
  match: Match<{ id?: string }>;
  history: History;
  location: Location;
}

type ActionWithoutSummary = Omit<FlashUpdateFields['actions_taken'][number], 'summary'>;
const defaultActionsTaken: ActionWithoutSummary[] = [
  { client_id: randomString(), organization: 'NTLS', actions: [] },
  { client_id: randomString(), organization: 'PNS', actions: [] },
  { client_id: randomString(), organization: 'FDRN', actions: [] },
  { client_id: randomString(), organization: 'GOV', actions: [] },
];

function scrollToTop() {
  window.setTimeout(() => {
    window.scrollTo({
      top: Math.min(145, window.scrollY),
      left: 0,
      behavior: 'smooth',
    });
  }, 0);
}

type StepTypes = 'context' | 'action' | 'focal';
const stepTypesToFieldsMap: {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in StepTypes]: (keyof FlashUpdateFields)[];
} = {
  context: contextFields,
  action: actionsFields,
  focal: focalFields
};

const defaultFormValues: PartialForm<FlashUpdateFields> = {
  country_district: [{
    client_id: randomString(),
  }],
  actions_taken: defaultActionsTaken,
};

function FlashUpdateForm(props: Props) {
  const {
    className,
    history,
    match,
  } = props;
  const alert = useAlert();
  const { id } = match.params;

  const { strings } = React.useContext(LanguageContext);
  const user = useReduxState('me');
  const {
    value,
    error,
    setFieldValue,
    validate,
    setError,
    setValue,
  } = useForm(schema, { value: defaultFormValues });

  const {
    actionOptionsMap,
    countryOptions,
    disasterTypeOptions,
    districtOptions,
    fetchingActions,
    fetchingCountries,
    fetchingDisasterTypes,
    fetchingDistricts,
    fetchingShareWithOptions,
    shareWithOptions,
  } = useFlashUpdateFormOptions(value);

  const [currentStep, setCurrentStep] = React.useState<StepTypes>('context');
  const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
  const submitButtonLabel = currentStep === 'focal' ? strings.flashUpdateSubmitButtonLabel : strings.flashUpdateContinueButtonLabel;
  const shouldDisabledBackButton = currentStep === 'context';
  const bypassTitleGeneration = React.useRef<boolean>(false);
  const { current: currentLanguage } = useReduxState('lang');

  const {
    pending: flashUpdatePending,
    response: flashUpdateResponse
  } = useRequest<FlashUpdateAPIResponseFields>({
    skip: !id,
    url: `api/v2/flash-update/${id}`,
    onSuccess: (response) => {
      if (!response) {
        alert.show(
          <p>
            {strings.flashUpdateFormLoadRequestFailureMessage}
            &nbsp;
            <strong>
              Empty response from server
            </strong>
          </p>,
          { variant: 'danger' },
        );

        return;
      }

      const defaultActionsMapByOrganization = listToMap(
        defaultActionsTaken,
        d => d.organization as string,
        d => d
      );

      const actionMapByOrganization: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in OrganizationType]: PartialForm<FlashUpdateFields['actions_taken'][number]>
      } = listToMap(
        response.actions_taken ?? [],
        d => d.organization,
        d => d,
      );

      const allActionOrgs = Object.keys(defaultActionsMapByOrganization) as OrganizationType[];
      allActionOrgs.forEach((org) => {
        if (!actionMapByOrganization[org]) {
          actionMapByOrganization[org] = defaultActionsMapByOrganization[org];
        }
      });

      setValue({
        ...response,
        country_district: response.country_district?.map((cd) => ({
          ...cd,
          client_id: cd.client_id ?? String(cd.id)
        })),
        references: response.references?.map((ref) => ({
          ...ref,
          client_id: ref.client_id ?? String(ref.id)
        })),
        graphics_files: response.graphics_files.map((gf) => ({
          id: gf.id,
          client_id: gf.client_id ?? String(gf.id),
          caption: gf.caption ?? '',
        })),
        map_files: response.map_files.map((mf) => ({
          id: mf.id,
          client_id: mf.client_id ?? String(mf.id),
          caption: mf.caption ?? '',
        })),
        actions_taken: (Object.values(actionMapByOrganization)).map((at) => ({
          ...at,
          client_id: at.client_id ?? at.organization,
        })),
      });

      bypassTitleGeneration.current = true;

      setFileIdToUrlMap((prevValue) => ({
        ...prevValue,
        ...listToMap(response.graphics_files ?? [], d => d.id, d => d.file),
        ...listToMap(response.map_files ?? [], d => d.id, d => d.file),
        ...listToMap(response.references ?? [], d => d.document, d => d.document_details?.file),
      }));

    },

    onFailure: ({
      value: { messageForNotification },
      debugMessage,
    }) => {
      alert.show(
        <p>
          {strings.flashUpdateFormLoadRequestFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    }
  });

  const languageMismatch = checkLanguageMismatch(
    id,
    flashUpdateResponse?.translation_module_original_language,
    currentLanguage,
  );

  const erroredTabs = React.useMemo(() => {
    const safeErrors = getErrorObject(error) ?? {};

    const tabs: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      [key in StepTypes]: boolean;
    } = {
      context: false,
      action: false,
      focal: false,
    };

    return mapToMap(
      tabs,
      (key) => key,
      (_, tabKey) => {
        const currentFields = stepTypesToFieldsMap[tabKey as StepTypes];
        const currentFieldsMap = listToMap(
          currentFields,
          d => d,
          d => true,
        );

        const partialErrors: typeof error = mapToMap(
          safeErrors,
          (key) => key,
          (value, key) => currentFieldsMap[key as keyof FlashUpdateFields] ? value : undefined,
        );

        return analyzeErrors(partialErrors);
      }
    );
  }, [error]);

  const handleTabChange = React.useCallback((newStep: StepTypes) => {
    scrollToTop();
    setCurrentStep(newStep);
  }, []);

  type ErrorObj = {
    country_district?: {
      district?: string[];
      country?: string[];
    }[],
    hazard_type?: string[];
    title?: string[];
    situational_overview?: string[];
    map_files?: {
      id: string[],
      caption: string[]
    }[],
    graphics_files?: {
      id: string[],
      caption: string[]
    }[],
    references?: {
      date?: string[],
      source_description?: string[],
      url?: string[],
      document?: string[],
    }[],
    actions_taken?: {
      actions?: string[],
      organization?: string[],
      summary?: string[],
    }[],
    originator_name?: string[];
    originator_title?: string[];
    originator_email?: string[];
    originator_phone?: string[];
    ifrc_name?: string[];
    ifrc_title?: string[];
    ifrc_email?: string[];
    ifrc_phone?: string[];
    share_with?: string[];
  };

  const {
    pending: flashUpdateSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<FlashUpdateAPIResponseFields, Partial<FlashUpdateAPIFields>>({
    // FIXME: update URL
    url: id ? `api/v2/flash-update/${id}/` : 'api/v2/flash-update/',
    method: id ? 'PUT' : 'POST',
    body: ctx => ctx,
    useCurrentLanguage: true,
    onSuccess: (response) => {
      alert.show(
        strings.flashUpdateFormRedirectMessage,
        { variant: 'success' },
      );
      window.setTimeout(
        () => history.push(`/flash-update/${response?.id}/`),
        250,
      );
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      const formErrorWithTyping = formErrors as unknown as ErrorObj;
      const transformedError: typeof error = {
        country_district: listToMap(
          value?.country_district ?? [],
          (d) => d.client_id as string,
          (_, __, i) => {
            const err = formErrorWithTyping?.country_district?.[i];
            if (!err) {
              return undefined;
            }

            let finalErr: {
              country?: string;
              district?: string;
            } = {};

            if (err.country) {
              finalErr['country'] = err.country.join(' ,');
            }

            if (err.district) {
              finalErr['district'] = err.district.join(' ,');
            }

            return finalErr;
          },
        ),
        hazard_type: formErrorWithTyping?.hazard_type?.join(', '),
        title: formErrorWithTyping?.title?.join(', '),
        situational_overview: formErrorWithTyping?.situational_overview?.join(', '),
        map_files: listToMap(
          value?.map_files ?? [],
          (d) => d.client_id as string,
          (_, __, i) => {
            const err = formErrorWithTyping?.map_files?.[i];
            if (!err) {
              return undefined;
            }

            let finalErr: {
              id?: string;
              caption?: string;
            } = {};

            if (err.id) {
              finalErr['id'] = err.id.join(' ,');
            }

            if (err.caption) {
              finalErr['caption'] = err.caption.join(' ,');
            }

            return finalErr;
          },
        ),
        graphics_files: listToMap(
          value?.graphics_files ?? [],
          (d) => d.client_id as string,
          (_, __, i) => {
            const err = formErrorWithTyping?.graphics_files?.[i];
            if (!err) {
              return undefined;
            }

            let finalErr: {
              id?: string;
              caption?: string;
            } = {};

            if (err.id) {
              finalErr['id'] = err.id.join(' ,');
            }

            if (err.caption) {
              finalErr['caption'] = err.caption.join(' ,');
            }

            return finalErr;
          },
        ),
        references: listToMap(
          value?.references ?? [],
          (d) => d.client_id as string,
          (_, __, i) => {
            const err = formErrorWithTyping?.references?.[i];
            if (!err) {
              return undefined;
            }

            let finalErr: {
              date?: string;
              source_description?: string;
              url?: string;
              document?: string;
            } = {};

            if (err.date) {
              finalErr['date'] = err.date.join(' ,');
            }

            if (err.source_description) {
              finalErr['source_description'] = err.source_description.join(' ,');
            }

            if (err.url) {
              finalErr['url'] = err.url.join(' ,');
            }

            if (err.document) {
              finalErr['document'] = err.document.join(' ,');
            }

            return finalErr;
          },
        ),
        actions_taken: listToMap(
          value?.actions_taken ?? [],
          (d) => d.client_id as string,
          (_, __, i) => {
            const err = formErrorWithTyping?.actions_taken?.[i];
            if (!err) {
              return undefined;
            }

            let finalErr: {
              actions?: string;
              organization?: string;
              summary?: string;
            } = {};

            if (err.actions) {
              finalErr['actions'] = err.actions.join(' ,');
            }

            if (err.organization) {
              finalErr['organization'] = err.organization.join(' ,');
            }

            if (err.summary) {
              finalErr['summary'] = err.summary.join(' ,');
            }

            return finalErr;
          },
        ),
        originator_name: formErrorWithTyping?.originator_name?.join(', '),
        originator_title: formErrorWithTyping?.originator_title?.join(', '),
        originator_email: formErrorWithTyping?.originator_email?.join(', '),
        originator_phone: formErrorWithTyping?.originator_phone?.join(', '),
        ifrc_name: formErrorWithTyping?.ifrc_name?.join(', '),
        ifrc_title: formErrorWithTyping?.ifrc_title?.join(', '),
        ifrc_email: formErrorWithTyping?.ifrc_email?.join(', '),
        ifrc_phone: formErrorWithTyping?.ifrc_phone?.join(', '),
        share_with: formErrorWithTyping?.share_with?.join(', '),
      };

      setError(transformedError);

      alert.show(
        <p>
          {strings.flashUpdateFormSaveRequestFailureMessage}
          &nbsp;
          <strong>
            {messageForNotification}
          </strong>
        </p>,
        {
          variant: 'danger',
          debugMessage,
        },
      );
    },
  });

  const submitFlashUpdate = React.useCallback(() => {
    const result = validate();

    if (result.errored) {
      setError(result.error);
    } else {
      const finalValue = transformFormFieldsToAPIFields(result.value as FlashUpdateFields);
      submitRequest(finalValue);
    }

  }, [validate, setError, submitRequest]);

  const handleSubmitButtonClick = React.useCallback(() => {
    scrollToTop();
    if (currentStep === 'focal') {
      submitFlashUpdate();
    } else {
      const nextStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'focal'>]: Exclude<StepTypes, 'context'>;
      } = {
        context: 'action',
        action: 'focal',
      };

      handleTabChange(nextStepMap[currentStep]);
    }
  }, [currentStep, handleTabChange, submitFlashUpdate]);

  const handleBackButtonClick = React.useCallback(() => {
    if (currentStep !== 'context') {
      const prevStepMap: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        [key in Exclude<StepTypes, 'context'>]: Exclude<StepTypes, 'focal'>;
      } = {
        action: 'context',
        focal: 'action',
      };

      handleTabChange(prevStepMap[currentStep]);
    }
  }, [handleTabChange, currentStep]);

  // Auto generate title
  React.useEffect(() => {
    // Wait untill disasterTypeOptions and countryOptions are loaded
    if (disasterTypeOptions.length === 0 || countryOptions.length === 0) {
      return;
    }

    // Bypass title generation when initial data is loaded from server
    if (bypassTitleGeneration.current) {
      bypassTitleGeneration.current = false;
      return;
    }

    if (isNotDefined(value?.country_district) || isNotDefined(value?.hazard_type)) {
      return;
    }

    const countryTitleMap = listToMap(
      countryOptions,
      d => d.value,
      d => d.label,
    );

    const countryTitle = value.country_district
      .map(d => isDefined(d.country) && countryTitleMap[d.country])
      .filter(Boolean)
      .join(' - ');

    if (!countryTitle) {
      return;
    }

    const selectedHazard = disasterTypeOptions.find(
      (d) => d.value === value?.hazard_type,
    );

    if (!selectedHazard) {
      return;
    }

    const now = new Date();
    const mm = (now.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = now.getFullYear().toString();

    const date = `${mm}/${yyyy}`;
    const title = `${countryTitle} - ${selectedHazard.label}  ${date}`;

    setFieldValue(title, 'title' as const);
  }, [
    value?.country_district,
    value?.hazard_type,
    disasterTypeOptions,
    countryOptions,
    setFieldValue,
  ]);

  const pending = fetchingCountries
    || fetchingDistricts
    || fetchingDisasterTypes
    || fetchingActions
    || fetchingShareWithOptions
    || flashUpdateSubmitPending
    || flashUpdatePending;

  const failedToLoadFlashUpdate = !pending && isDefined(id) && !flashUpdateResponse;

  const ifrcUser = React.useMemo(() => isIfrcUser(user?.data), [user]);
  if (!ifrcUser) {
    return (
      <FourHundredFour />
    );
  }
  return (
    <Tabs
      disabled={failedToLoadFlashUpdate}
      onChange={handleTabChange}
      value={currentStep}
      variant="step"
    >
      <Page
        className={className}
        actions={(
          <Button
            name={undefined}
            onClick={submitFlashUpdate}
            type="submit"
          >
            {strings.flashUpdateFormSaveButtonLabel}
          </Button>
        )}
        title={strings.flashUpdateFormPageTitle}
        heading={strings.flashUpdateFormPageHeading}
        description={strings.flashUpdateFormPageDescription}
        info={(
          <TabList className={styles.tableList}>
            <Tab
              name="context"
              step={1}
              errored={erroredTabs['context']}
            >
              {strings.flashUpdateTabContextLabel}
            </Tab>
            <Tab
              name="action"
              step={2}
              errored={erroredTabs['action']}
            >
              {strings.flashUpdateTabActionLabel}
            </Tab>
            <Tab
              name="focal"
              step={3}
              errored={erroredTabs['focal']}
            >
              {strings.flashUpdateTabFocalLabel}
            </Tab>
          </TabList>
        )}
      >
        {pending ? (
          <Container>
            <BlockLoading />
          </Container>
        ) :
          failedToLoadFlashUpdate ? (
            <Container
              contentClassName={styles.errorMessage}
            >
              <h3>
                {strings.flashUpdateFormLoadErrorTitle}
              </h3>
              <p>
                {strings.flashUpdateFormLoadErrorDescription}
              </p>
              <p>
                {strings.flashUpdateFormLoadErrorHelpText}
              </p>
            </Container>

          ) : (
            <>
              <Container>
                <NonFieldError
                  error={error}
                  message={strings.flashUpdateFormFieldGeneralError}
                />
              </Container>
              {languageMismatch && flashUpdateResponse && (
                <Container contentClassName={styles.languageMismatch}>
                  <Translate
                    stringId="translationErrorEdit"
                    params={{ originalLanguage: <strong>{languageOptions[flashUpdateResponse.translation_module_original_language]}</strong> }}
                  />
                </Container>
              )}
              {!languageMismatch && (
                <>
                  <TabPanel name="context">
                    <Context
                      error={error}
                      onValueChange={setFieldValue}
                      value={value}
                      disasterTypeOptions={disasterTypeOptions}
                      countryOptions={countryOptions}
                      fetchingCountries={fetchingCountries}
                      fetchingDisasterTypes={fetchingDisasterTypes}
                      fileIdToUrlMap={fileIdToUrlMap}
                      setFileIdToUrlMap={setFileIdToUrlMap}
                      onCreateAndShareButtonClick={submitFlashUpdate}
                      fetchingDistricts={fetchingDistricts}
                      districtOptions={districtOptions}
                    />
                  </TabPanel>
                  <TabPanel name="action">
                    <ActionsInput
                      error={error}
                      onValueChange={setFieldValue}
                      value={value}
                      actionOptionsMap={actionOptionsMap}
                    />
                  </TabPanel>
                  <TabPanel name="focal">
                    <FocalPoints
                      error={error}
                      onValueChange={setFieldValue}
                      value={value}
                      shareWithOptions={shareWithOptions}
                    />
                  </TabPanel>
                  <div className={styles.actions}>
                    <Button
                      name={undefined}
                      variant="secondary"
                      onClick={handleBackButtonClick}
                      disabled={shouldDisabledBackButton}
                    >
                      {strings.flashUpdateBackButtonLabel}
                    </Button>
                    <Button
                      name={undefined}
                      variant="secondary"
                      onClick={handleSubmitButtonClick}
                      type="submit"
                      disabled={flashUpdateSubmitPending}
                    >
                      {submitButtonLabel}
                    </Button>
                  </div>
                </>
              )}
            </>
          )
        }
      </Page>
    </Tabs>
  );
}

export default FlashUpdateForm;
