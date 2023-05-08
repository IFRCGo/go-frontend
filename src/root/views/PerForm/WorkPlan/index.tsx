import React from 'react';
import { randomString, _cs } from '@togglecorp/fujs';

import Container from '#components/Container';
import Table from '#components/Table';
import LanguageContext from '#root/languageContext';
import {
  createDateColumn,
  createLinkColumn,
  createStringColumn,
} from '#components/Table/predefinedColumns';

import styles from './styles.module.scss';
import TextArea from '#components/TextArea';
import DateInput from '#components/DateInput';
import TextInput from '#components/TextInput';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import { IoAdd, IoTrash } from 'react-icons/io5';
import { PartialForm } from '@togglecorp/toggle-form';
import { PerOverviewFields } from '../common';

interface Props {
  className?: string;
  onRemove?: (index: number) => void;
  index?: number;
}

function WorkPlan(props: Props) {
  const {
    className,
    onRemove,
    index,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  const handleAddCustomActivity = React.useCallback(() => {
    const id = randomString();
    const newCustomActivity : PartialForm<PerOverviewFields> = {
      id,
    };
  }, []);

  return (
    <Container
      className={_cs(styles.strategicPrioritiesTable, className)}
      contentClassName={styles.content}
    >
      <table>
        <thead>
          <tr>
            <th>
              {strings.perWorkPlanComponents}
            </th>
            <th>
              {strings.perWorkPlanArea}
            </th>
            <th>
              {strings.perWorkPlanActions}
            </th>
            <th>
              {strings.perWorkPlanDueDate}
            </th>
            <th>
              {strings.perWorkPlanResponsible}
            </th>
            <th>
              {strings.perWorkPlanSupportedBy}
            </th>
            <th>
              {strings.perWorkPlanStatus}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Component 1:
            </td>
            <td>
              1: Policy Strategy and Standards
            </td>
            <td>
              <TextArea
                name={undefined}
                value={undefined}
                placeholder="List the actions"
              >
              </TextArea>
            </td>
            <td>
              <DateInput
                name={undefined}
                value={undefined}
              >
              </DateInput>
            </td>
            <td>
              <div className={styles.responsibilitySection}>
                <TextInput
                  name={undefined}
                  value={undefined}
                  placeholder="Name"
                >
                </TextInput>
                <TextInput
                  name={undefined}
                  value={undefined}
                  placeholder="Email"
                >
                </TextInput>
              </div>
            </td>
            <td>
              <SelectInput
                name={undefined}
                onChange={undefined}
                value={undefined}
              >
              </SelectInput>
            </td>
            <td>
              <SelectInput
                name={undefined}
                onChange={undefined}
                value={undefined}
              >
              </SelectInput>
            </td>
            <td>
              <Button
                className={styles.removeButton}
                name="select"
                onClick={onRemove}
                variant="action"
              >
                <IoTrash />
              </Button>
            </td>
          </tr>
        </tbody>
        <Button
          name={undefined}
          variant="secondary"
          onClick={handleAddCustomActivity}
          icons={<IoAdd />}
        >
           Add row
        </Button>
      </table>
    </Container>
  );
}

export default WorkPlan;
