import React from 'react';

export function useBlurEffect (
  shouldWatch, // boolean,
  callback, // (clickedInside: boolean, e: MouseEvent) => void,
  elementRef, // React.RefObject<HTMLElement>,
  parentRef, // React.RefObject<HTMLElement>,
  deps, // React.DependencyList,
) {
  React.useEffect(() => {
    const handleDocumentClick = (e) => {
      const { current: element } = elementRef;
      const { current: parent } = parentRef;

      const isElementOrContainedInElement = element
        ? element === e.target || element.contains(e.target)
        : false;
      const isParentOrContainedInParent = parent
        ? parent === e.target || parent.contains(e.target)
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
  }, deps);
}

const defaultPlacement = {
  top: 'unset',
  right: 'unset',
  bottom: 'unset',
  left: 'unset',
};

export const useFloatPlacement = (parentRef /* React.RefObject<HTMLElement> */) => {
  const [placement, setPlacement] = React.useState(defaultPlacement);

  const handleScroll = React.useCallback(() => {
    const newPlacement = {...defaultPlacement};

    if (parentRef.current) {
      const parentBCR = parentRef.current.getBoundingClientRect();
      const { x, y, width, height } = parentBCR;

      const cX = window.innerWidth / 2;
      const cY = window.innerHeight / 2;

      const horizontalPosition = (cX - parentBCR.x) > 0 ? 'right' : 'left';
      const verticalPosition = (cY - parentBCR.y) > 0 ? 'bottom' : 'top';

      if (horizontalPosition === 'left') {
        newPlacement.right = `${window.innerWidth - x - width}px`;
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
  }, [setPlacement]);

  React.useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return placement;
};
