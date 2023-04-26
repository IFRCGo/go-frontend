import React from 'react';
import {
    IoChevronForward,
    IoAirplaneOutline,
    IoDownload,
} from 'react-icons/io5';
import Header from '#components/Header';
import Button from '#views/GoUI/components/Button';
import styles from './styles.module.scss';

function Buttons() {
    return (
        <div className={styles.buttonCollection}>
            <Header
                heading="BUTTON COLLECTION"
                headingSize="medium"
            />
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Primary Button"
                    headingSize="ultraSmall"
                />
                <Button
                    name="primary-button"
                    type="button"
                    variant="primary"
                >
                    Emergencies
                </Button>
                <Button
                    name="primary-button"
                    type="button"
                    variant="primary"
                    icons={<IoAirplaneOutline />}
                >
                    Countries on ifrc-go
                </Button>
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Secondary Button"
                    headingSize="ultraSmall"
                />
                <Button
                    name="secondary-button"
                    type="button"
                    variant="secondary"
                >
                    Secondary
                </Button>
                <Button
                    name="secondary-button"
                    type="button"
                    variant="secondary"
                    icons={<IoChevronForward />}
                >
                    Secondary
                </Button>
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Tertiary Button"
                    headingSize="ultraSmall"
                />
                <Button
                    name="primary-button"
                    type="button"
                    variant="tertiary"
                >
                    Tertiary
                </Button>
                <Button
                    name="primary-button"
                    type="button"
                    variant="tertiary"
                    icons={<IoChevronForward />}
                >
                    Tertiary
                </Button>
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Download Button"
                    headingSize="ultraSmall"
                />
                <Button
                    name="primary-button"
                    type="button"
                    variant="download"
                    icons={<IoDownload />}
                >
                    EAP - Complete Download
                </Button>
            </div>
        </div >
    );
}

export default Buttons;
