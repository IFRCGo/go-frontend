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
      hideLabelColon={true}
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

  if (!projectPending && projectResponse?.id === undefined) {
    return null; // in case of using a nonexistent id
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
      {projectResponse?.description
          ? <RichTextOutput
              className={_cs('rich-text-section', styles.richTextOutput)}
              value={get(projectResponse, 'description', false)}
          /> : null }
      {projectPending ? (
        <BlockLoading />
      ) : (
        <div className={styles.content}>
          <Row>
            <FieldOutput
              label={strings.threeWNationalSociety}
              value={
                <a className={styles.link}
                   href={'/countries/' + projectResponse?.reporting_ns_detail?.id + '#3w'}
                >
                  <span>{projectResponse?.reporting_ns_detail?.society_name }</span>
                  <span className="icon-about-ref collecticon-chevron-right"></span>
                </a>
              }
            />
            <FieldOutput
              label={strings.threeWCountryAndRegion}
              value={(
                <>
                  <div>
                    <a className={styles.link}
                       href={'/countries/' + projectResponse?.project_country_detail?.id}
                    >
                      <span>{projectResponse?.project_country_detail?.name }</span>
                      <span className="icon-about-ref collecticon-chevron-right"></span>
                    </a>
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
              label={<div style={{whiteSpace:"nowrap"}}
              >{strings.threeWProgrammeType} <Tooltip
                  title={strings.threeWProgrammeType}
                  description={strings.threeWProgrammeTypeTooltip}
              /></div>}
              value={projectResponse?.programme_type_display + ' '}
            />
          </Row>
          <Row>
            <FieldOutput
              label={strings.threeWLinkedOperation}
              value={projectResponse?.event_detail ?
                  <a className={styles.link}
                     href={'/emergencies/' + projectResponse?.event_detail?.id}
                  >
                    <span>{projectResponse?.event_detail?.name}</span>
                    <span className="icon-about-ref collecticon-chevron-right"></span>
                  </a>

                  : ''}
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
              label={<>{strings.threeWTags} <Tooltip title={strings.threeWTags} description={strings.threeWTagsTooltip}/></>}
              value={projectResponse?.secondary_sectors_display?.join(', ') + ' '}
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
            <hr/>
          </Row>
          {projectResponse !== undefined && projectResponse?.annual_split_detail?.length > 0 ?
             <table>
                 {projectResponse?.annual_split_detail?.map(split => { return (
                 <tbody>
                 <tr>
                     <td colSpan={6} className={styles.year}>
                     <FieldOutput
                         label={strings.threeWYear}
                         value={split.year}
                     />
                     </td>
                 </tr>
                 <tr>
                     <td>
                     <FieldOutput
                         label={strings.threeWBudgetAmount}
                         value={split.budget_amount}
                         valueType="number"
                     />
                     </td>
                     <td className={styles.peopleLabel}>
                       {strings.threeWPeopleTargeted}
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWMale}
                         value={split.target_male}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWFemale}
                         value={split.target_female}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWOther}
                         value={split.target_other}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWTotal}
                         value={split.target_total}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                 </tr>
                 <tr>
                     <td>
                     &nbsp;
                     </td>
                     <td className={styles.peopleLabel}>
                       {strings.threeWPeopleReached1}
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWMale}
                         value={split.reached_male}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWFemale}
                         value={split.reached_female}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWOther}
                         value={split.reached_other}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                     <td>
                     <FieldOutput
                         label={strings.threeWTotal}
                         value={split.reached_total}
                         valueType="number"
                         className={styles.grey}
                     />
                     </td>
                 </tr>
                 <tr>
                   <td colSpan={6} className={styles.narrow}>
                     &nbsp;
                   </td>
                 </tr>
                 </tbody>
               );
             })}
             </table>
             :
             <>
               <Row>
                 <FieldOutput
                     label={strings.threeWPeopleTargeted}
                     value={(
                         <Row className={styles.greyRow}>
                           <FieldOutput
                               className={styles.padded}
                               label={strings.threeWMale}
                               value={projectResponse?.target_male}
                               valueType="number"
                           />
                           <FieldOutput
                               className={styles.padded}
                               label={strings.threeWFemale}
                               value={projectResponse?.target_female}
                               valueType="number"
                           />
                           <FieldOutput
                               className={styles.padded}
                               label={strings.threeWOther}
                               value={projectResponse?.target_other}
                               valueType="number"
                           />
                           <FieldOutput
                               className={styles.padded}
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
                     label={<>
                       {strings.threeWPeopleReached1}<Tooltip title={strings.threeWTablePeopleReached2} description={strings.threeWTablePeopleReached2HelpText}/>
                     </>}
                     value={(
                         <Row className={styles.greyRow}>
                           <FieldOutput
                               className={styles.padded}
                               label={strings.threeWMale}
                               value={projectResponse?.reached_male}
                               valueType="number"
                           />
                           <FieldOutput
                               className={styles.padded}
                               label={strings.threeWFemale}
                               value={projectResponse?.reached_female}
                               valueType="number"
                           />
                           <FieldOutput
                               className={styles.padded}
                               label={strings.threeWOther}
                               value={projectResponse?.reached_other}
                               valueType="number"
                           />
                           <FieldOutput
                               className={styles.padded}
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
