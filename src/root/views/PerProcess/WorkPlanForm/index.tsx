import React from 'react';
import { randomString, _cs } from '@togglecorp/fujs';
import {
  EntriesAsList,
  PartialForm,
  Error,
  SetBaseValueArg,
  createSubmitHandler,
  useForm,
} from '@togglecorp/toggle-form';
import { IoAdd, IoTrash } from 'react-icons/io5';

import Container from '#components/Container';
import LanguageContext from '#root/languageContext';
import DateInput from '#components/DateInput';
import SelectInput from '#components/SelectInput';
import Button from '#components/Button';
import { WorkPlanComponent } from '../common';
import TextArea from '#components/TextArea';

import styles from './styles.module.scss';
import usePerProcessOptions, { workplanSchema } from '../usePerProcessOptions';
import { useLazyRequest } from '#utils/restRequest';
import useAlertContext from '#hooks/useAlert';

type Value = PartialForm<WorkPlanComponent>;

interface Props {
  className?: string;
  error?: Error<Value> | undefined;
  onRemove?: (index: number) => void;
  index?: number;
  onValueSet: (value: SetBaseValueArg<Value>) => void;
  perId?: string;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
}

function WorkPlanForm(props: Props) {
  const {
    className,
    onRemove,
    onValueChange,
    index,
    perId,
    onValueSet,
  } = props;

  const {
    value,
    error: formError,
    validate,
    setFieldValue,
    setError: onErrorSet,
  } = useForm(workplanSchema, { value: {} as PartialForm<WorkPlanComponent> });

  const {
    workPlanStatusOptions,
  } = usePerProcessOptions(value);

  const { strings } = React.useContext(LanguageContext);
  const alert = useAlertContext();

  const {
    pending: perSubmitPending,
    trigger: submitRequest,
  } = useLazyRequest<WorkPlanComponent, Partial<WorkPlanComponent>>({
    url: perId ? `api/v2/per-prioritization/${perId}/` : 'api/v2/per-prioritization/',
    method: perId ? 'PUT' : 'POST',
    body: ctx => ctx,
    onSuccess: (response) => {
      alert.show(
        strings.perFormSaveRequestSuccessMessage,
        { variant: 'success' },
      );

      // if (!perId) {
      //   window.setTimeout(
      //     () => history.push(`/new-per/${response?.id}/edit/`),
      //     250,
      //   );
      // }
      //  else {
      //   handlePerLoad(response);
      // }
    },
    onFailure: ({
      value: {
        messageForNotification,
        formErrors,
      },
      debugMessage,
    }) => {
      // setError(formErrors);
      // if (formErrors.modified_at === 'OBSOLETE_PAYLOAD') {
      //   // There was a save conflict due to obsolete payload
      //   setShowObsoletePayloadResolutionModal(true);
      // }

      alert.show(
        <p>
          {strings.perFormSaveRequestFailureMessage}
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

  const handleSubmit = React.useCallback((finalValues) => {
    console.warn('finalValues', finalValues);
    onValueSet(finalValues);
    submitRequest(finalValues);
  }, [onValueSet, submitRequest]);

  const handleAddCustomActivity = React.useCallback(() => {
    const newList: PartialForm<WorkPlanComponent> = {
      id: randomString(),
    };

    onValueChange(
      (oldValue: PartialForm<WorkPlanComponent>) => (
        [...(oldValue ?? []), newList]
      ),
      'component' as const,
    );
  }, [onValueChange]);

  console.warn('value', value);

  return (
    <form
      onSubmit={createSubmitHandler(validate, onErrorSet, handleSubmit)}
    >
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
                {strings.perWorkPlanActions}
              </th>
              <th>
                {strings.perWorkPlanDueDate}
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
                <TextArea
                  name="actions"
                  value={value?.actions}
                  onChange={setFieldValue}
                  placeholder="List the actions"
                >
                </TextArea>
              </td>
              <td>
                <DateInput
                  name="due_date"
                  value={value?.due_date}
                  onChange={setFieldValue}
                >
                </DateInput>
              </td>
              <td>
                <SelectInput
                  name='status'
                  options={workPlanStatusOptions}
                  onChange={setFieldValue}
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
              {value?.component?.map((c, i) => (
                <td>
                  <Button
                    key={i}
                    className={styles.removeButton}
                    name="select"
                    onRemove={onRemove}
                    variant="action"
                  >
                    <IoTrash />
                  </Button>
                </td>
              ))}
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
    </form>
  );
}

export default WorkPlanForm;
