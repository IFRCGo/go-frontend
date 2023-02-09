import React from 'react';
import {
    IoChevronForwardOutline,
} from 'react-icons/io5';

import Container from '#components/Container';
import Link from '#components/Link';
import LanguageContext from '#root/languageContext';

import styles from './styles.module.scss';

export interface ProvinceResult {
    id: number;
    name: string;
    score: number;
}

interface Props {
    data: ProvinceResult[] | undefined;
    actions: React.ReactNode;
}

function ProvinceList(props: Props) {
    const {
        data,
        actions,
    } = props;

    const { strings } = React.useContext(LanguageContext);

    if (!data) {
        return null;
    }

    return (
        <Container
            heading={strings.searchIfrcProvince}
            actions={actions}
            sub
            contentClassName={styles.provinceList}
        >
            {data.map((district) => (
                <div className={styles.provinceName}>
                    {district.name}
                </div>
            ))}
        </Container>
    );
}

export default ProvinceList;
