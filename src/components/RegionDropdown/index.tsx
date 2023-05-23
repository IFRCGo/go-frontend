import { generatePath } from 'react-router-dom';

import DropdownMenu, { Props as DropdownMenuProps } from '#components/DropdownMenu';
import DropdownMenuItem from '#components/DropdownMenuItem';
import useTranslation from '#hooks/useTranslation';
import commonStrings from '#strings/common';
import routes from '#routes';

interface Props extends DropdownMenuProps {
}

function RegionDropdown(props: Props) {
    const {
        variant = 'tertiary',
        ...otherProps
    } = props;

    const strings = useTranslation('common', commonStrings);

    return (
        <DropdownMenu
            label={strings.menuRegions}
            variant={variant}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...otherProps}
        >
            {/* TODO: Fetch these from server */}
            <DropdownMenuItem
                href={generatePath(routes.region.absolutePath, { regionId: '0' })}
                label={strings.regionNameAfrica}
            />
            <DropdownMenuItem
                href={generatePath(routes.region.absolutePath, { regionId: '1' })}
                label={strings.regionNameAmerica}
            />
            <DropdownMenuItem
                href={generatePath(routes.region.absolutePath, { regionId: '2' })}
                label={strings.regionNameAsia}
            />
            <DropdownMenuItem
                href={generatePath(routes.region.absolutePath, { regionId: '3' })}
                label={strings.regionNameEurope}
            />
            <DropdownMenuItem
                href={generatePath(routes.region.absolutePath, { regionId: '4' })}
                label={strings.regionNameMENA}
            />
        </DropdownMenu>
    );
}

export default RegionDropdown;
