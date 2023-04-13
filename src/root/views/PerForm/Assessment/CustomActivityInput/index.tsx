import React from 'react';
import { _cs } from '@togglecorp/fujs';
import { EntriesAsList } from '@togglecorp/toggle-form';

import { BooleanValueOption } from '#types';
import ExpandableContainer from '#components/ExpandableContainer';
import Container from '#components/Container';
import TextArea from '#components/TextArea';

import RadioInput from '#components/RadioInput';
import { AssessmentQuestion } from '#views/PerForm/usePerFormOptions';

import styles from './styles.module.scss';

export interface Area {
  id: string;
  title: string;
  title_en: string;
  title_es: string;
  title_fr: string;
  title_ar: string | null;
  area_num: number;
}
export interface Component {
  area: Area[];
  title: string;
  component: string;
  component_letter: string | null;
  description: string;
  id: string;
}

export interface Answer {
  id: string;
  text: string;
  text_en: string;
  text_es: string | null;
  text_fr: string | null;
  text_ar: string | null;
}

interface Props {
  yesNoOptions: BooleanValueOption[];
  onValueChange: (...entries: EntriesAsList<null>) => void;
  id: number;
  data?: AssessmentQuestion;
}

function CustomActivityInput(props: Props) {

  const {
    yesNoOptions,
    onValueChange,
    data,
  } = props;
  console.warn("hghjkhjk", data);

  return (
    <>
      <ExpandableContainer
        className={_cs(styles.customActivity && styles.errored)}
        componentRef={undefined}
        heading={data?.component.title}
        headingSize="small"
        sub
      >
        <Container
          description="NS DRM strategy reflects the NS mandate, analysis of country context, trends, operational objectives, success indicators."
          className={styles.inputSection}
        >
          <TextArea
            name="details"
            label="Notes"
            placeholder='This is placeholder'
            value={undefined}
            onChange={undefined}
            error={undefined}
            rows={2}
          />
          <label>
            <input
              type="radio"
              name="yes-no-na"
              value="no"
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="yes-no-na"
              value="no"
            />
            No
          </label>
          <label>
            <input
              type="radio"
              name="yes-no-na"
              value="no"
            />
            Not Revised
          </label>
          <RadioInput
            options={yesNoOptions}
            value={undefined}
            onChange={onValueChange}
          />
        </Container>
      </ExpandableContainer>
    </>
  );
}

export default CustomActivityInput;
