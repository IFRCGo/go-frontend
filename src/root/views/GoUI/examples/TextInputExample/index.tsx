import React, { useCallback, useState } from "react";
import TextInput from '#goui/components/TextInput';
import styles from './styles.module.scss';

function TextInputExample() {
    const [textGroup, setTextGroup] = useState('');

    const handleTextChange = useCallback((val) => {
        setTextGroup(val);
    }, [setTextGroup]);

    return (
        <>
            <div className={styles.textBox}>
                <TextInput
                    className={styles.textExample}
                    name="Candidate"
                    labelClassName={styles.textLabel}
                    label="Candidate Name"
                    value={textGroup}
                    onChange={handleTextChange}
                    rows={2}
                />
            </div>
            <div className={styles.textBox}>
                <TextInput
                    className={styles.textExample}
                    name="Candidate"
                    labelClassName={styles.textLabel}
                    label="Disabled Candidate Name"
                    value={textGroup}
                    onChange={handleTextChange}
                    rows={2}
                    disabled
                />
            </div>
            <div className={styles.textBox}>
                <TextInput
                    className={styles.textExample}
                    name="Candidate"
                    labelClassName={styles.textLabel}
                    label="Error in text input"
                    value={textGroup}
                    onChange={handleTextChange}
                    rows={2}
                    error="Is that your real name ?"
                />
            </div>
        </>
    );
}
export default TextInputExample;