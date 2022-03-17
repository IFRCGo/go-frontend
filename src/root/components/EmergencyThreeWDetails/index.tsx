import React from 'react';
import {
  _cs,
  isDefined,
  listToMap,
} from '@togglecorp/fujs';

import { useRequest } from '#utils/restRequest';

import Container from '#components/Container';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';
import {
  ACTIVITY_LEADER_ERU,
  ACTIVITY_LEADER_NS,
  EmergencyThreeWOptionsResponse,
} from '#components/EmergencyThreeWForm/useEmergencyThreeWOptions';
import { EmergencyProjectResponse } from '#types';

import styles from './styles.module.scss';

function Field(props: TextOutputProps) {
  const {
    className,
    ...otherProps
  } = props;

  return (
    <TextOutput
      className={_cs(styles.field, className)}
      labelContainerClassName={styles.label}
      valueContainerClassName={styles.value}
      {...otherProps}
    />
  );
}

interface Props {
  className?: string;
  project: EmergencyProjectResponse;
}

function EmergencyThreeWDetails(props: Props) {
  const {
    className,
    project,
  } = props;

  const { response: optionsResponse } = useRequest<EmergencyThreeWOptionsResponse>({
    url: 'api/v2/emergency-project/options',
  });

  const supplyIdToTitleMap = React.useMemo(() => (
    listToMap(
      optionsResponse?.actions?.map(d => d.supplies_details)?.flat(1),
      d => d.id,
      d => d.title,
    )
  ), [optionsResponse]);

  return (
    <div className={_cs(styles.emergencyThreeWDetails, className)}>
      <div className={styles.operationDetails}>
        <Field
          label="Current IFRC Operation"
          value={project?.event_details?.name}
        />
        <Field
          label="Country"
          value={project?.country_details?.name}
        />
        <Field
          label="Province / Region"
          value={project?.districts_details?.map(d => d.name)?.join(', ')}
        />
        <Field
          label="Start Date"
          value={project?.start_date}
          valueType="date"
        />
        <Field
          label="Status"
          value={project?.status_display}
        />
        <Field
          label="Activity Lead"
          value={project?.activity_lead_display}
        />
        {project?.activity_lead === ACTIVITY_LEADER_ERU && (
          <Field
            label="ERU"
            value={project?.deployed_eru_details?.eru_owner_details?.national_society_country_details?.society_name}
          />
        )}
        {project?.activity_lead === ACTIVITY_LEADER_NS && (
          <>
            <Field
              label="National Society"
              value={project?.reporting_ns_details.society_name}
            />
          </>
        )}
      </div>
      <Container
        className={styles.activities}
        heading="Activities"
        sub
      >
        {project?.activities?.map((a) => (
          <Container
            key={a.id}
            heading={a?.action_details?.title}
            sub
            headingSize="small"
            hideHeaderBorder
          >
            <TextOutput
              label="Sector"
              value={a?.sector_details?.title}
            />
            {a?.is_simplified_report ? (
              <div className={styles.simplified}>
                {a?.people_households === 'people' && (
                  <>
                    {(isDefined(a?.male_count) || isDefined(a?.female_count)) && (
                      <>
                        <TextOutput
                          label="Male"
                          value={a?.male_count}
                        />
                        <TextOutput
                          label="Female"
                          value={a?.female_count}
                        />
                      </>
                    )}
                    <TextOutput
                      label="Total People"
                      value={a?.people_count}
                    />
                  </>
                )}
                {a?.people_households === 'households' && (
                  <TextOutput
                    label="Total Households"
                    value={a?.household_count}
                  />
                )}
              </div>
            ) : (
              <div className={styles.disaggregated}>
                {/* TODO */}
              </div>
            )}
            {Object.keys(a?.supplies).length > 0 && (
              <Container
                sub
                heading="Supplies"
                headingSize="small"
                hideHeaderBorder
              >
                {(Object.keys(a?.supplies) as unknown as number[]).map((k) => (
                  <TextOutput
                    key={k}
                    label={supplyIdToTitleMap?.[k]}
                    value={a?.supplies?.[k]}
                  />
                ))}
              </Container>
            )}
            {Object.keys(a?.custom_supplies).length > 0 && (
              <Container
                sub
                heading="Custom supplies"
                headingSize="small"
                hideHeaderBorder
              >
                {(Object.keys(a?.custom_supplies) as unknown as number[]).map((k) => (
                  <TextOutput
                    key={k}
                    label={k}
                    value={a?.custom_supplies?.[k]}
                  />
                ))}
              </Container>
            )}
          </Container>
        ))}
      </Container>
    </div>
  );
}

export default EmergencyThreeWDetails;
