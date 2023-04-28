import React from 'react';
import {
    IoChevronForward,
    IoArrowDownOutline,
    IoChevronBack,
    IoLockClosed,
    IoCaretBackSharp,
    IoCheckmarkSharp,
    IoClose,
    IoArrowUp,
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
                    actions={<IoChevronForward />}
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
                    actions={<IoChevronForward />}
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
                    name="tertiary-button"
                    type="button"
                    variant="tertiary"
                >
                    Tertiary
                </Button>
                <Button
                    name="tertiary-button"
                    type="button"
                    variant="tertiary"
                    actions={<IoChevronForward />}
                >
                    Tertiary
                </Button>
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Tertiary Icon Button"
                    headingSize="ultraSmall"
                />
                <Button
                    name="tertiary-icon-button"
                    type="button"
                    variant="navigationPrimary"
                    icons={<IoChevronBack />}
                >
                    Expand
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
                    icons={<IoArrowDownOutline />}
                >
                    EAP - Complete Download
                </Button>
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Navigation primary"
                    headingSize="ultraSmall"
                />
                <Button
                    name="navigation-secondary"
                    type="button"
                    variant="navigationSecondary"
                    icons={<IoCaretBackSharp />}
                >
                    All Countries
                </Button>
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Tertiary Icon Button"
                    headingSize="ultraSmall"
                />
                <Button
                    name="dialog-confirm-button"
                    type="button"
                    variant="dialogConfirmOk"
                    icons={<IoCheckmarkSharp />}
                />
                <Button
                    name="dialog-confirm-button"
                    type="button"
                    variant="dialogConfirmCancel"
                    icons={<IoClose />}
                />
                <Button
                    name="navigate-top"
                    type="button"
                    variant="navigateTop"
                    icons={<IoArrowUp />}
                />
            </div>
            <div className={styles.buttonsContainer}>
                <Header
                    heading="Button with description"
                    headingSize="ultraSmall"
                />
                <Button
                    name="primary-button"
                    type="button"
                    variant="buttonWithDescription"
                    actions={<IoLockClosed />}
                    buttonWithDescription="If you are an IFRC member, please login to see more details"
                >
                    login to see more
                </Button>
            </div>
        </div >
    );
}

export default Buttons;
