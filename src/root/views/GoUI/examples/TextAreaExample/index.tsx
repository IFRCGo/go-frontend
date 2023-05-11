import React, { useCallback, useState } from "react";
import TextArea from "#goui/components/TextArea";
import Heading from "#goui/components/Heading";
import styles from './styles.module.scss';

function TextAreaExample() {
  const [textGroup, setTextGroup] = useState('');

  const handleTextChange = useCallback((val) => {
    setTextGroup(val);
  }, [setTextGroup]);

  return (
    <div className={styles.textBox}>
      <Heading level={5}>Simple Text Area</Heading>
      <TextArea
        className={styles.textExample}
        name="anonymous"
        labelClassName={styles.textLabel}
        label="Write some random stuff"
        value={textGroup}
        onChange={handleTextChange}
        rows={5}
      />
      <Heading level={5}>Text Area Disabled</Heading>
      <TextArea
        className={styles.textExample}
        name="anonymous"
        labelClassName={styles.textLabel}
        label="An example of disabled text box"
        value={textGroup}
        onChange={handleTextChange}
        rows={5}
        disabled
      />
      <Heading level={5}>Text Area with error</Heading>
      <TextArea
        className={styles.textExample}
        name="anonymous"
        labelClassName={styles.textLabel}
        label="An example of error text box"
        value={textGroup}
        onChange={handleTextChange}
        rows={5}
        error="Please enter the right text"
      />
    </div>
  );
}
export default TextAreaExample;