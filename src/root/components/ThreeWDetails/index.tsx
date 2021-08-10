import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import BlockLoading from '#components/block-loading';
import Header from '#components/Header';
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
  onProjectLoad?: (project: Project) => void;
  hideHeader?: boolean;
}

function ProjectDetail(props: Props) {
  const {
    className,
    projectId,
    headerActions,
    onProjectLoad,
    hideHeader,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const {
    pending: projectPending,
    response: projectResponse,
  } = useRequest<Project>({
    skip: isNotDefined(projectId),
    url: `api/v2/project/${projectId}/`,
    onSuccess: onProjectLoad,
  });

  if (isNotDefined(projectId)) {
    return null;
  }

  return (
    <div className={_cs(styles.projectDetail, className)}>
      {!hideHeader && (
        <Header
          className={styles.header}
          headingSize="extraLarge"
          heading={projectResponse?.name}
          actions={headerActions}
          descriptionClassName={styles.headerDescription}
          description={(
            <TextOutput
              label={strings.threeWLastModifiedOn}
              value={projectResponse?.modified_at}
              valueType="date"
            //  description={`By ${projectResponse?.modified_by_detail?.username}`}
            />
          )}
        />
      )}
      {projectPending ? (
        <BlockLoading />
      ) : (
        <div className={styles.content}>
          <Row>
            <FieldOutput
              label={strings.threeWNationalSociety}
              value={projectResponse?.reporting_ns_detail?.name}
            />
            <FieldOutput
              label={strings.threeWCountryAndRegion}
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
              label={strings.threeWProjectType}
              value={projectResponse?.operation_type_display}
            />
            <FieldOutput
              label={strings.threeWProgrammeType}
              value={projectResponse?.programme_type_display}
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWLinkedOperation}
              value={projectResponse?.event_detail?.name}
            />
            <FieldOutput
              label={strings.threeWDisasterType}
              value={projectResponse?.dtype_detail?.name}
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWPrimarySector}
              value={projectResponse?.primary_sector_display}
            />
            <FieldOutput
              label={strings.threeWTagging}
              value={projectResponse?.secondary_sectors_display?.join(', ')}
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWStartDate}
              value={projectResponse?.start_date}
              valueType="date"
            />
            <FieldOutput
              label={strings.threeWEndDate}
              value={projectResponse?.end_date}
              valueType="date"
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWStatus}
              value={projectResponse?.status_display}
            />
            <FieldOutput
              label={strings.threeWBudgetAmount}
              value={projectResponse?.budget_amount}
              valueType="number"
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWPeopleTargeted}
              value={(
                <Row>
                  <FieldOutput
                    label={strings.threeWMale}
                    value={projectResponse?.target_male}
                    valueType="number"
                  />
                  <FieldOutput
                    label={strings.threeWFemale}
                    value={projectResponse?.target_female}
                    valueType="number"
                  />
                  <FieldOutput
                    label={strings.threeWOther}
                    value={projectResponse?.target_other}
                    valueType="number"
                  />
                  <FieldOutput
                    label={strings.threeWTotal}
                    value={projectResponse?.target_total}
                    valueType="number"
                  />
                </Row>
              )}
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWPeopleReached}
              value={(
                <Row>
                  <FieldOutput
                    label={strings.threeWMale}
                    value={projectResponse?.reached_male}
                    valueType="number"
                  />
                  <FieldOutput
                    label={strings.threeWFemale}
                    value={projectResponse?.reached_female}
                    valueType="number"
                  />
                  <FieldOutput
                    label={strings.threeWOther}
                    value={projectResponse?.reached_other}
                    valueType="number"
                  />
                  <FieldOutput
                    label={strings.threeWTotal}
                    value={projectResponse?.reached_total}
                    valueType="number"
                  />
                </Row>
              )}
            />
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
