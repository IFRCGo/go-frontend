import React, { useCallback, useState } from "react";
import TextInput from '#goui/components/TextInput';
import styles from './styles.module.scss';

function TextInputExample() {
    const [textGroup, setTextGroup] = useState('');

    const handleTextChange = useCallback((val) => {
        setTextGroup(val);
    }, [setTextGroup]);

    return (
    <div className={styles.textInputs}>
      <TextInput
        className={styles.textInput}
        name="Candidate"
        label="Candidate Name"
        hint="This is hint"
        value={textGroup}
        onChange={handleTextChange}
      />
      <TextInput
        variant="general"
        className={styles.textInput}
        name="Candidate"
        label="Candidate Name"
        hint="This is hint"
        value={textGroup}
        required
        onChange={handleTextChange}
      />
      <TextInput
        variant="general"
        className={styles.textInput}
        name="Candidate"
        label="Candidate Name Readonly"
        hint="This is hint"
        value={textGroup}
        onChange={handleTextChange}
        readOnly
      />
      <TextInput
        className={styles.textInput}
        name="Candidate"
        label="Disabled Candidate Name"
        value={textGroup}
        onChange={handleTextChange}
        disabled
      />
      <TextInput
        className={styles.textInput}
        name="Candidate"
        label="Error in text input"
        value={textGroup}
        onChange={handleTextChange}
        error="Is that your real name ?"
      />
    </div>
  );
}
export default TextInputExample;
