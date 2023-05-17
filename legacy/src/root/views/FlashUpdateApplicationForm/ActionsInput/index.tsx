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
  FlashUpdateFields,
  OrganizationType,
  ActionOptionItem,
  Action,
} from '../common';

import ActionInput from './ActionInput';

type Value = PartialForm<FlashUpdateFields>;
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
      NTLS: strings.flashUpdateFormActionTakenByNationalSocietyPlaceholder,
      PNS: strings.flashUpdateFormActionTakenByRcrcPlaceholder,
      FDRN: strings.flashUpdateFormActionTakenByIfrcPlaceholder,
      GOV: strings.flashUpdateFormActionTakenByGovernmentPlaceholder,
    },
    {
      NTLS: strings.flashUpdateFormActionTakenByNationalSocietyLabel,
      PNS: strings.flashUpdateFormActionTakenByRcrcLabel,
      FDRN: strings.flashUpdateFormActionTakenByIfrcLabel,
      GOV: strings.flashUpdateFormActionTakenByGovernmentLabel,
    },
    {
      NTLS: strings.flashUpdateFormActionTakenByNationalSocietyDescription,
      PNS: strings.flashUpdateFormActionTakenByRcrcDescription,
      FDRN: strings.flashUpdateFormActionTakenByIfrcDescription,
      GOV: strings.flashUpdateFormActionTakenByGovernmentDescription,
    },
  ] as const), [strings]);

  return (
    <Container
      heading={strings.flashUpdateFormActionTakenTitle}
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
