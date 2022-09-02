import React from 'react';
import {
  _cs,
  isNotDefined,
} from '@togglecorp/fujs';

import LanguageContext from '#root/languageContext';
import BlockLoading from '#components/block-loading';
import Header from '#components/Header';
import Translate from '#components/Translate';
import TextOutput, { Props as TextOutputProps } from '#components/TextOutput';
import { useRequest } from '#utils/restRequest';
import { Project } from '#types';
import Tooltip from '#components/common/tooltip';

import styles from './styles.module.scss';
import RichTextOutput from "#components/RichTextOutput";
import {get} from "#utils/utils";

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

  const displayName = React.useMemo(() => {
    if (!projectResponse?.modified_by_detail) {
      return undefined;
    }

    const {
      username,
      firstName,
      lastName,
    } = projectResponse.modified_by_detail;

    if (firstName) {
      return `${firstName} ${lastName}`;
    }

    return username;
  }, [projectResponse?.modified_by_detail]);


  if (isNotDefined(projectId)) {
    return null;
  }

  // RemoveMeLater console.info('projectResponse', projectResponse);

  return (
    <div className={_cs(styles.projectDetail, className)}>
      {!hideHeader && (
        <Header
          className={styles.header}
          headingSize="extraLarge"
          heading={projectResponse?.name}
          actions={headerActions}
          descriptionClassName={styles.headerDescription}
          description={ projectResponse ? (
            <TextOutput
              label={strings.threeWLastModifiedOn}
              value={projectResponse?.modified_at}
              valueType="date"
              description={displayName ? (
                <Translate
                  stringId="threeWLastModifiedBy"
                  params={{ user: displayName }}
                />
              ) : undefined}
            />
          ) : undefined }
        />
      )}
      { projectResponse?.description
          ? <RichTextOutput
              className='rich-text-section'
              value={get(projectResponse, 'description', false)}
              style={{backgroundColor: '#faf9f9', padding: '1.5rem'}}
          /> : null }

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
          { projectResponse?.reporting_ns_contact_name === null ? '' :
          <Row>
            <FieldOutput
              label={strings.threeWNationalSocietyContact1}
              value={projectResponse?.reporting_ns_contact_name + ', ' +
                     projectResponse?.reporting_ns_contact_role}
            />
            <FieldOutput
              label={strings.threeWNationalSocietyContact2}
              value={projectResponse?.reporting_ns_contact_email}
            />
          </Row>
          }
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
          {projectResponse !== undefined && projectResponse?.annual_split_detail.length > 0 ?
              <Row>
                <table>
                  <thead>
                    <tr className={styles.annualSplit}>
                      <th>{strings.threeWYear}:</th>
                      <th>{strings.threeWBudgetAmount}:</th>
                      <th>{strings.threeWTargetMale}:</th>
                      <th>{strings.threeWTargetFemale}:</th>
                      <th>{strings.threeWTargetOther}:</th>
                      <th>{strings.threeWTargetTotal}:</th>
                      <th>{strings.threeWReachedMale}:</th>
                      <th>{strings.threeWReachedFemale}:</th>
                      <th>{strings.threeWReachedOther}:</th>
                      <th>{strings.threeWReachedTotal}:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectResponse?.annual_split_detail.map(split => {
                      return (
                          <tr key={split.year} className={styles.center}>
                            <td className={styles.bold}>{split.year}</td>
                            <td>{split.budget_amount}</td>
                            <td>{split.target_male}</td>
                            <td>{split.target_female}</td>
                            <td>{split.target_other}</td>
                            <td>{split.target_total}</td>
                            <td>{split.reached_male}</td>
                            <td>{split.reached_female}</td>
                            <td>{split.reached_other}</td>
                            <td>{split.reached_total}</td>
                          </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Row> :
              <>
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
                      label={strings.threeWPeopleReached1}
                      value={(
                          <Row>
                            <Tooltip title={strings.threeWTablePeopleReached2}
                                     description={strings.threeWTablePeopleReached2HelpText}/>
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
              </>
          }
        </div>
      )}
    </div>
  );
}

export default ProjectDetail;
