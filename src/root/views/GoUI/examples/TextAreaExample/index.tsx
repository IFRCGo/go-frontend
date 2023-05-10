import React, { useCallback, useState } from "react";
import TextArea from "../../components/TextArea";
import styles from './styles.module.scss';

function TextAreaExample() {
    const [textGroup, setTextGroup] = useState('');

    const handleTextChange = useCallback((val) => {
        setTextGroup(val);
    }, [setTextGroup]);

    return (
        <>
            <div className={styles.textBox}>
                <TextArea
                    className={styles.textExample}
                    name="anonymous"
                    labelClassName={styles.textLabel}
                    label="Write some random stuff"
                    value={textGroup}
                    onChange={handleTextChange}
                    rows={5}
                />
            </div>
            <div className={styles.textBox}>
                <TextArea
                    className={styles.textExample}
                    name="anonymous"
                    labelClassName={styles.textLabel}
                    label="An example of disabled text box"
                    value={textGroup}
                    onChange={handleTextChange}
                    rows={5}
                    disabled={true}
                />
            </div>
            <div className={styles.textBox}>
                <TextArea
                    className={styles.textExample}
                    name="anonymous"
                    labelClassName={styles.textLabel}
                    label="An example of error text box"
                    value={textGroup}
                    onChange={handleTextChange}
                    rows={5}
                    disabled={true}
                    error="Please enter the right text"
                />
            </div>
        </>
    );
}
export default TextAreaExample;