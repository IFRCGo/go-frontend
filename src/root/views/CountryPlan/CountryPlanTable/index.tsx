import React from 'react';
import {
    _cs,
} from '@togglecorp/fujs';
import Table from '#components/Table';

import styles from './styles.module.scss';

interface Props {
    className?: string;
}

function CountryPlanTable(props: Props) {
    const {
        className,
    } = props;

    return (
        <Table
            className={_cs(styles.countryPlanTable, className)}
            data={undefined}
            columns={[]}
            keySelector={undefined}
        />
    );
}

export default CountryPlanTable;
