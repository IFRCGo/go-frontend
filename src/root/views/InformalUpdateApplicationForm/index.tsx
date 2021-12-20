import React from 'react';
import { isDefined, listToMap } from '@togglecorp/fujs';
import type { match as Match } from 'react-router-dom';
import type { History, Location } from 'history';
import { Link } from 'react-router-dom';
import { accumulateErrors, analyzeErrors, PartialForm, useForm } from '@togglecorp/toggle-form';
import { actionsFields, contextFields, focalFields, InformalUpdateFields, numericOptionKeySelector, ONSET_IMMINENT, optionLabelSelector } from './common';
import useInformalUpdateFormOptions, { schema } from './useInformalUpdateFormOptions';
import Page from '#components/Page';
import Button, { useButtonFeatures } from '#components/Button';
import LanguageContext from '#root/languageContext';
import TabList from '#components/Tabs/TabList';
import Tab from '#components/Tabs/Tab';
import Tabs from '#components/Tabs';

import styles from './styles.module.scss';
import Container from '#components/Container';
import NonFieldError from '#components/NonFieldError';
import TabPanel from '#components/Tabs/TabPanel';
import ContextOverview from './ContextOverview';
import FocalPoints from './FocalPoint';
import ActionsOverview from './ActionOverview';

interface Props {
    className?: string;
    match: Match<{ drefId?: string }>;
    history: History;
    location: Location;
}
function scrollToTop() {
    window.setTimeout(() => {
        window.scrollTo({
            top: Math.min(145, window.scrollY),
            left: 0,
            behavior: 'smooth',
        });
    }, 0);
}

/*export const schema: FormSchema = {
    fields: (value): FormSchemaFields => ({
        field_report: [],
    })
};*/

type StepTypes = 'context' | 'action' | 'focal';
const stepTypesToFieldsMap: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    [key in StepTypes]: (keyof InformalUpdateFields)[];
} = {
    context: contextFields,
    action: actionsFields,
    focal: focalFields,
};
const defaultFormValues: PartialForm<InformalUpdateFields> = {
    /*
    country_district: [
        { clientId: randomString() },
    ],
     */
    country_district: [],
    users: [],
};

function InformalUpdateForm(props: Props) {
    const {
        className,
        // location,
        history,
        match,
    } = props;
    const { drefId } = match.params;

    const { strings } = React.useContext(LanguageContext);

    const {
        value,
        error,
        onValueChange,
        validate,
        onErrorSet,
        onValueSet,
    } = useForm(defaultFormValues, schema);

    const {
        countryOptions,
        disasterTypeOptions,
        fetchingCountries,
        fetchingDistricts,
        districtOptions,
        fetchingDisasterTypes,
        nationalSocietyOptions,
        yesNoOptions,
        userDetails,
        shareWithOptions,
        orgGroupedActionForCurrentReport,
    } = useInformalUpdateFormOptions(value);

    const [currentStep, setCurrentStep] = React.useState<StepTypes>('context');
    const [fileIdToUrlMap, setFileIdToUrlMap] = React.useState<Record<number, string>>({});
    const submitButtonLabel = currentStep === 'focal' ? strings.drefFormSaveButtonLabel : strings.drefFormContinueButtonLabel;
    const shouldDisabledBackButton = currentStep === 'context';

    const erroredTabs = React.useMemo(() => {
        const tabs: {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            [key in StepTypes]: boolean;
        } = {
            context: false,
            action: false,
            focal: false,
        };

        const tabKeys = (Object.keys(tabs)) as StepTypes[];
        tabKeys.forEach((tabKey) => {
            const currentFields = stepTypesToFieldsMap[tabKey];
            const currentFieldsMap = listToMap(currentFields, d => d, d => true);

            const erroredFields = Object.keys(error?.fields ?? {}) as (keyof InformalUpdateFields)[];
            const hasError = erroredFields.some(d => currentFieldsMap[d]);
            tabs[tabKey] = hasError;
        });

        return tabs;
    }, [error]);

    const validateCurrentTab = React.useCallback((exceptions: (keyof InformalUpdateFields)[] = []) => {
        const validationError = accumulateErrors(value, schema);
        const currentFields = stepTypesToFieldsMap[currentStep];
        const exceptionsMap = listToMap(exceptions, d => d, d => true);

        if (!validationError) {
            return true;
        }

        const currentTabFieldErrors = listToMap(
            currentFields.filter(field => (
                !exceptionsMap[field] && analyzeErrors(validationError.fields?.[field]
                ))),
            field => field,
            field => validationError.fields?.[field]
        ) as NonNullable<NonNullable<(typeof error)>['fields']>;

        const newError: typeof error = {
            ...error,
            fields: {
                ...error?.fields,
                ...validationError.fields,
                ...currentTabFieldErrors,
            }
        };

        onErrorSet(newError);

        const hasError = Object.keys(currentTabFieldErrors).some(d => !!d);
        return !hasError;
    }, [value, currentStep, onErrorSet, error]);

    const handleTabChange = React.useCallback((newStep: StepTypes) => {
        scrollToTop();
        const isCurrentTabValid = validateCurrentTab(['map_image']);

        if (!isCurrentTabValid) {
            return;
        }

        setCurrentStep(newStep);
    }, [validateCurrentTab]);

    const exportLinkProps = useButtonFeatures({
        variant: 'secondary',
        children: strings.informalUpdateFormExportLabel,
    });

    const submitInformalUpdate = React.useCallback(() => {
        const {
            errored,
            error,
            value: finalValues,
        } = validate();

        onErrorSet(error);

        if (errored) {
            return;
        }

        if (finalValues && userDetails && userDetails.id) {
            const body = {
                user: userDetails.id,
                ...finalValues,
            };
            // submitRequest(body as InformalUpdateApiFields);
        }
    }, [validate, userDetails, onErrorSet]);

    const submitDref = React.useCallback(() => {
        const {
            errored,
            error,
            value: finalValues,
        } = validate();

        onErrorSet(error);

        if (errored) {
            return;
        }

        if (finalValues && userDetails && userDetails.id) {
            const body = {
                user: userDetails.id,
                ...finalValues,
            };
            // submitRequest(body as DrefApiFields);
        }
    }, [validate, userDetails, onErrorSet]);

    const handleSubmitButtonClick = React.useCallback(() => {
        scrollToTop();

        const isCurrentTabValid = validateCurrentTab([
            'map_image'
        ]);

        if (!isCurrentTabValid) {
            return;
        }

        if (currentStep === 'focal') {
            submitDref();
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
    }, [validateCurrentTab, currentStep, handleTabChange, submitDref]);

    const handleBackButtonClick = React.useCallback(() => {
        if (currentStep !== 'context') {
            const prevStepMap: {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                [key in Exclude<StepTypes, 'context'>]: Exclude<StepTypes, 'submission'>;
            } = {
                action: 'context',
                focal: 'action',
            };

            handleTabChange(prevStepMap[currentStep]);
        }
    }, [handleTabChange, currentStep]);

    return (
        <Tabs
            disabled={false}
            onChange={handleTabChange}
            value={currentStep}
            variant="step"
        >
            <Page
                className={className}
                actions={(
                    <>
                        {isDefined(drefId) && (
                            <Link
                                to={`/dref-application/${drefId}/export/`}
                                {...exportLinkProps}
                            />
                        )}
                        <Button
                            name={undefined}
                            //onClick={submitInformalUpdate}
                            type="submit"
                            onClick={() => history.push('/informal-update-report/')}
                        >
                            {strings.informalUpdateFormSaveButtonLabel}
                        </Button>
                    </>
                )}
                title={strings.informalUpdateFormPageTitle}
                heading={strings.informalUpdateFormPageHeading}
                info={(
                    <TabList className={styles.tableList}>
                        <Tab
                            name="context"
                            step={1}
                            errored={erroredTabs['context']}
                        >
                            {strings.informalUpdateTabContextLabel}
                        </Tab>
                        <Tab
                            name="action"
                            step={2}
                            errored={erroredTabs['action']}
                        >
                            {strings.informalUpdateTabActionLabel}
                        </Tab>
                        <Tab
                            name="focal"
                            step={3}
                            errored={erroredTabs['focal']}
                        >
                            {strings.informalUpdateTabFocalLabel}
                        </Tab>
                    </TabList>
                )}
            >
                <Container>
                    <NonFieldError
                        error={error}
                        message={strings.drefFormFieldGeneralError}
                    />
                </Container>
                <TabPanel name="context">
                    <ContextOverview
                        error={error}
                        onValueChange={onValueChange}
                        value={value}
                        disasterTypeOptions={disasterTypeOptions}
                        countryOptions={countryOptions}
                        fetchingCountries={fetchingCountries}
                        fetchingDisasterTypes={fetchingDisasterTypes}
                        fileIdToUrlMap={fileIdToUrlMap}
                        setFileIdToUrlMap={setFileIdToUrlMap}
                        onValueSet={onValueSet}
                        onCreateAndShareButtonClick={submitDref}
                        fetchingDistricts={fetchingDistricts}
                        districtOptions={districtOptions}
                    />
                </TabPanel>
                <TabPanel name="action">
                    <ActionsOverview
                        error={error}
                        onValueChange={onValueChange}
                        value={value}
                        yesNoOptions={yesNoOptions}
                        onValueSet={onValueSet}
                        actionOptions={orgGroupedActionForCurrentReport}
                    />
                </TabPanel>
                <TabPanel name="focal">
                    <FocalPoints
                        error={error}
                        onValueChange={onValueChange}
                        value={value}
                        yesNoOptions={yesNoOptions}
                        onValueSet={onValueSet}
                        shareWithOptions={shareWithOptions}
                    />
                </TabPanel>

                {/*<TabPanel name="submission">
                    <Submission
                        error={error}
                        onValueChange={onValueChange}
                        value={value}
                    />
                </TabPanel>*/}
                <div className={styles.actions}>
                    <Button
                        name={undefined}
                        variant="secondary"
                        onClick={handleBackButtonClick}
                        disabled={shouldDisabledBackButton}
                    >
                        {strings.drefFormBackButtonLabel}
                    </Button>
                    <Button
                        name={undefined}
                        variant="secondary"
                        onClick={handleSubmitButtonClick}
                        type="submit"
                    >
                        {submitButtonLabel}
                    </Button>
                </div>

            </Page>

        </Tabs>
    );
}

export default InformalUpdateForm;
