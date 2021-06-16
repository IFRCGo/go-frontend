import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';

import BlockLoading from '#components/block-loading';
import BasicModal from '#components/BasicModal';
import Header from '#components/Header';
import Button, { Props as ButtonProps } from '#components/Button';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';
import { useRequest } from '#utils/restRequest';
import { Project } from '#types';

import styles from './styles.module.scss';

function FieldOutput(props: TextOutputProps) {
  const {
    className,
    ...otherProps
  } = props;

  return (
    <TextOutput
      className={_cs(styles.fieldOutput, className)}
      labelContainerClassName={styles.label}
      valueContainerClassName={styles.value}
      {...otherProps}
    />
  );
}

interface RowProps {
  className?: string;
  children?: React.ReactNode;
}
function Row(props: RowProps) {
  const {
    className,
    children,
  } = props;

  return (
    <div
      className={_cs(
        styles.row,
        className,
      )}
    >
      { children }
    </div>
  );
}

interface Props {
  className?: string;
  projectId: number;
  headerActions?: React.ReactNode;
  onCloseButtonClick?: ButtonProps<void>['onClick'];
}

function ProjectDetail(props: Props) {
  const {
    className,
    projectId,
    headerActions,
    onCloseButtonClick,
  } = props;

  const {
    pending: projectPending,
    response: projectResponse,
  } = useRequest<Project>({
    skip: isNotDefined(projectId),
    url: `api/v2/project/${projectId}`,
  });

  if (isNotDefined(projectId)) {
    return null;
  }

  return (
    <BasicModal
      className={_cs(styles.projectDetail, className)}
      hideCloseButton
    >
      <Header
        className={styles.header}
        headingSize="extraLarge"
        heading={projectResponse?.name}
        actions={(
          <>
            { headerActions }
            <Button
              variant="secondary"
              onClick={onCloseButtonClick}
            >
              Close
            </Button>
          </>
        )}
        descriptionClassName={styles.headerDescription}
        description={(
          <TextOutput
            label="Last Modified on"
            value={projectResponse?.modified_at}
            valueType="date"
          />
        )}
      />
      {projectPending ? (
        <BlockLoading />
      ) : (
        <div className={styles.content}>
          <Row>
            <FieldOutput
              label="Reporting National Society"
              value={projectResponse?.reporting_ns_detail?.name}
            />
            <FieldOutput
              label="Country and Region/Province"
              value={(
                <>
                  <div>
                    {projectResponse?.project_country_detail?.name}
                  </div>
                  <div>
                    {projectResponse?.project_districts_detail?.map(d => d.name).join(', ')}
                  </div>
                </>
              )}
            />
          </Row>
          <Row>
            <FieldOutput
              label="Project Type"
              value={projectResponse?.operation_type_display}
            />
            <FieldOutput
              label="Programme Type"
              value={projectResponse?.programme_type_display}
            />
          </Row>
          <Row>
            <FieldOutput
              label="Linked Operation"
              value={projectResponse?.event_detail?.name}
            />
            <FieldOutput
              label="Disaster Type"
              value={projectResponse?.dtype_detail?.name}
            />
          </Row>
          <Row>
            <FieldOutput
              label="Project Sector"
              value={projectResponse?.primary_sector_display}
            />
            <FieldOutput
              label="Tags"
              value={projectResponse?.secondary_sectors_display?.join(', ')}
            />
          </Row>
          <Row>
            <FieldOutput
              label="Start Date"
              value={projectResponse?.start_date}
              valueType="date"
            />
            <FieldOutput
              label="End Date"
              value={projectResponse?.end_date}
              valueType="date"
            />
          </Row>
          <Row>
            <FieldOutput
              label="Status"
              value={projectResponse?.status_display}
            />
            <FieldOutput
              label="Budget"
              value={projectResponse?.budget_amount}
              valueType="number"
            />
          </Row>
          <Row>
            <FieldOutput
              label="People Targeted"
              value={(
                <Row>
                  <FieldOutput
                    label="Male"
                    value={projectResponse?.target_male}
                    valueType="number"
                  />
                  <FieldOutput
                    label="Female"
                    value={projectResponse?.target_female}
                    valueType="number"
                  />
                  <FieldOutput
                    label="Other"
                    value={projectResponse?.target_other}
                    valueType="number"
                  />
                  <FieldOutput
                    label="Total"
                    value={projectResponse?.target_total}
                    valueType="number"
                  />
                </Row>
              )}
            />
          </Row>
          <Row>
            <FieldOutput
              label="People Reached"
              value={(
                <Row>
                  <FieldOutput
                    label="Male"
                    value={projectResponse?.reached_male}
                    valueType="number"
                  />
                  <FieldOutput
                    label="Female"
                    value={projectResponse?.reached_female}
                    valueType="number"
                  />
                  <FieldOutput
                    label="Other"
                    value={projectResponse?.reached_other}
                    valueType="number"
                  />
                  <FieldOutput
                    label="Total"
                    value={projectResponse?.reached_total}
                    valueType="number"
                  />
                </Row>
              )}
            />
          </Row>
        </div>
      )}
    </BasicModal>
  );
}

export default ProjectDetail;
