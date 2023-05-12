import React, { useCallback, useState } from "react";
import RawTextArea from "../../components/RawTextArea";
import styles from './styles.module.scss';

function RawTextAreaExample() {
    const [textGroup, setTextGroup] = useState('');

    const handleTextChange = useCallback((val) => {
        setTextGroup(val);
    }, [setTextGroup]);

    return (
        <div className={styles.textBox}>
            <RawTextArea
                className={styles.rawTextExample}
                name="anonymous"
                value={textGroup}
                onChange={handleTextChange}
                rows={5}
            />
        </div>
    );
}
export default RawTextAreaExample;
