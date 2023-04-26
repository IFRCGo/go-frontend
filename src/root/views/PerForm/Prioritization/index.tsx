import React from 'react';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';
import ExpandableContainer from '#components/ExpandableContainer';
import Container from '#components/Container';
import TextArea from '#components/TextArea';
import SelectInput from '#components/SelectInput';
import { _cs } from '@togglecorp/fujs';
import Table from '#components/Table';
import { createStringColumn } from '#components/Table/predefinedColumns';
import TextInput from '#components/TextInput';

interface Props {
  className?: string;
}

function Prioritization(props: Props) {
  const {
    className,
  } = props;

  const { strings } = React.useContext(LanguageContext);

  return (
    <Container>
      <div className={styles.componentTitle}>
        <h5>Component</h5>
        <h5>Ranking</h5>
        <h5>Justification</h5>
      </div>
      <ExpandableContainer
        className={_cs(styles.customActivity, styles.errored)}
        componentRef={undefined}
        heading="prioritization"
        headingSize="small"
        sub
        actions={
          <>
            <div>
              Needs Improvement
            </div>
            <TextInput
              className={styles.improvementSelect}
              name="improvement"
              onChange={undefined}
              value={""}
              placeholder="Enter"
            />
            <div>
              Show Benchmarks
            </div>
          </>
        }
      >
        <Container
          description="NS DRM strategy reflects the NS mandate, analysis of country context, trends, operational objectives, success indicators."
          className={styles.inputSection}
          contentClassName={styles.questionContent}
        >
          <TextArea
            className={styles.noteSection}
            name="details"
            label="Notes"
            placeholder='This is placeholder'
            value={undefined}
            onChange={undefined}
            error={undefined}
            rows={2}
            disabled
          />
          <div
            className={styles.answers}
          >
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
          </div>
          {/* <RadioInput
        options={yesNoOptions}
        value={undefined}
        onChange={onValueChange}
      /> */}
        </Container>
      </ExpandableContainer>
    </Container>
  );
}

export default Prioritization;
