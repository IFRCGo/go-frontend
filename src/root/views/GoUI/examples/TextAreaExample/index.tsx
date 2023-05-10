import React, { useCallback, useState } from "react";
import TextArea from "#goui/components/TextArea";
import Header from "#goui/components/Header";
import styles from './styles.module.scss';

function TextAreaExample() {
    const [textGroup, setTextGroup] = useState('');

    const handleTextChange = useCallback((val) => {
        setTextGroup(val);
    }, [setTextGroup]);

    return (
        <>
            <div className={styles.textBox}>
                <Header>Simple Text Area</Header>
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
                <Header>Text Area Disabled</Header>
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
            </div>
            <div className={styles.textBox}>
                <Header>Text Area with error</Header>
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
        </>
    );
}
export default TextAreaExample;