import React, { useContext } from 'react';
import {
  EntriesAsList,
  PartialForm,
  Error,
  useFormArray,
  getErrorObject,
} from '@togglecorp/toggle-form';

import Container from '#components/Container';
import InputSection from '#components/InputSection';
import languageContext from '#root/languageContext';

import {
  InformalUpdateFields,
  OrganizationType,
  ActionOptionItem,
  Action,
} from '../common';

import ActionInput from './ActionInput';

type Value = PartialForm<InformalUpdateFields>;
interface Props {
  error: Error<Value> | undefined;
  onValueChange: (...entries: EntriesAsList<Value>) => void;
  value: Value;
  actionOptionsMap: Record<OrganizationType, ActionOptionItem[]>;
}

function ActionsInput(props: Props) {
  const { strings } = useContext(languageContext);
  const {
    error: formError,
    onValueChange,
    value,
    actionOptionsMap,
  } = props;

  const {
    setValue,
    removeValue,
  } = useFormArray<'actions_taken', PartialForm<Action>>(
    'actions_taken',
    onValueChange,
  );

  const error = getErrorObject(formError);

  const [
    placeholder,
    title,
    description,
  ] = React.useMemo(() => ([
    {
      NTLS: strings.informalUpdateFormActionTakenByNationalSocietyPlaceholder,
      PNS: strings.informalUpdateFormActionTakenByIfrcPlaceholder,
      FDRN: strings.informalUpdateFormActionTakenByRcrcPlaceholder,
      GOV: strings.informalUpdateFormActionTakenByGovernmentPlaceholder,
    },
    {
      NTLS: strings.informalUpdateFormActionTakenByNationalSocietyLabel,
      PNS: strings.informalUpdateFormActionTakenByIfrcLabel,
      FDRN: strings.informalUpdateFormActionTakenByRcrcLabel,
      GOV: strings.informalUpdateFormActionTakenByGovernmentLabel,
    },
    {
      NTLS: strings.informalUpdateFormActionTakenByNationalSocietyDescription,
      PNS: strings.informalUpdateFormActionTakenByIfrcDescription,
      FDRN: strings.informalUpdateFormActionTakenByRcrcDescription,
      GOV: strings.informalUpdateFormActionTakenByGovernmentDescription,
    },
  ] as const), [strings]);

  return (
    <Container
      heading={strings.informalUpdateFormActionTakenTitle}
    >
      {value?.actions_taken?.map((a, i) => (
        <InputSection
          key={a.client_id}
          title={title[a.organization as OrganizationType]}
          description={description[a.organization as OrganizationType]}
        >
          <ActionInput
            error={getErrorObject(error?.actions_taken)}
            index={i}
            placeholder={placeholder[a.organization as OrganizationType]}
            value={a}
            onChange={setValue}
            onRemove={removeValue}
            actionOptions={actionOptionsMap[a.organization as OrganizationType]}
          />
        </InputSection>
      ))}
    </Container>
  );
}

export default ActionsInput;
