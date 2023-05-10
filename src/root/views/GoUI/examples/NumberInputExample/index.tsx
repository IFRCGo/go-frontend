import React, { useState, useCallback } from 'react';
import NumberInput from '#goui/components/NumberInput';
import Header from '#goui/components/Header';
import styles from './styles.module.scss';

function NumberInputExample() {
    const [numberData, setDataGroup] = useState<number | null | undefined>();

    const handleTextChange = useCallback((val) => {
        setDataGroup(val);
    }, [setDataGroup]);

    return (
        <>
            <div className={styles.numberBox}>
                <Header>
                    Number Input example
                </Header>
                <NumberInput
                    className={styles.numberExample}
                    label="Number of Random Count"
                    name="randomCount"
                    value={numberData}
                    onChange={handleTextChange}
                />
            </div>
            <div className={styles.numberBox}>
                <Header>
                    Disabled mode example
                </Header>
                <NumberInput
                    className={styles.numberExample}
                    label="Number of Random Count"
                    name="randomCount"
                    value={numberData}
                    onChange={handleTextChange}
                    disabled
                />
            </div>
            <div className={styles.numberBox}>
                <Header>
                    Error mode example
                </Header>
                <NumberInput
                    className={styles.numberExample}
                    label="Number of Random Count"
                    name="randomCount"
                    value={numberData}
                    onChange={handleTextChange}
                    error="Please enter numbers"
                />
            </div>
        </>
    );
}
export default NumberInputExample;