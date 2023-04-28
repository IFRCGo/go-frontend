import React, {
    useEffect,
    useState,
    useCallback,
} from 'react';

export function useBlurEffect(
    shouldWatch: boolean, // boolean,
    callback: (clickedInside: boolean, event: Event) => void,
    elementRef: React.RefObject<HTMLElement>,
    parentRef: React.RefObject<HTMLElement>,
) {
    useEffect(() => {
        const handleDocumentClick = (e: Event) => {
            const { current: element } = elementRef;
            const { current: parent } = parentRef;

            const isElementOrContainedInElement = element
                ? element === e.target || element.contains(e.target as (Node | null))
                : false;
            const isParentOrContainedInParent = parent
                ? parent === e.target || parent.contains(e.target as (Node | null))
                : false;

            const clickedInside = isElementOrContainedInElement || isParentOrContainedInParent;
            callback(clickedInside, e);
        };

        if (shouldWatch) {
            document.addEventListener('click', handleDocumentClick);
        } else {
            document.removeEventListener('click', handleDocumentClick);
        }

        return () => { document.removeEventListener('click', handleDocumentClick); };
    }, [shouldWatch, callback, elementRef, parentRef]);
}

const defaultPlacement = {
    top: 'unset',
    right: 'unset',
    bottom: 'unset',
    left: 'unset',
};

export const useFloatPlacement = (parentRef: React.RefObject<HTMLElement>) => {
    const [placement, setPlacement] = useState(defaultPlacement);

    const calculatePlacement = useCallback(() => {
        const newPlacement = { ...defaultPlacement };

        if (parentRef.current) {
            const parentBCR = parentRef.current.getBoundingClientRect();
            const { x, y, width, height } = parentBCR;

            const cX = window.innerWidth / 2;
            const cY = window.innerHeight / 2;

            const horizontalPosition = (cX - parentBCR.x) > 0 ? 'right' : 'left';
            const verticalPosition = (cY - parentBCR.y) > 0 ? 'bottom' : 'top';

            if (horizontalPosition === 'left') {
                newPlacement.right = `${document.body.clientWidth - x - width}px`;
            } else if (horizontalPosition === 'right') {
                newPlacement.left = `${x}px`;
            }

            if (verticalPosition === 'top') {
                newPlacement.bottom = `${window.innerHeight - y}px`;
            } else if (verticalPosition === 'bottom') {
                newPlacement.top = `${y + height}px`;
            }
        }

        setPlacement(newPlacement);
    }, [setPlacement, parentRef]);

    useEffect(() => {
        calculatePlacement();
        // TODO: throttle and debounce callbacks
        const handleScroll = calculatePlacement;
        const handleResize = calculatePlacement;

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, [calculatePlacement]);

    return placement;
};

function getCurrentHash() {
    const hash = window.location.hash;

    if (hash) {
        return hash.substr(1);
    }

    return undefined;
}

export function useHash() {
    const [hash, setHash] = useState(getCurrentHash());
    const handleHashChange = useCallback(() => {
        setHash(getCurrentHash());
    }, [setHash]);
    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [handleHashChange]);

    return hash;
}
