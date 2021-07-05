import React from 'react';
import Portal from './portal';
import _cs from 'classnames';

function Backdrop (p) {
  React.useEffect(() => {
    const html = document.getElementsByTagName('html')[0];
    const prevValue = html.style.overflow;
    html.style.overflow = 'hidden';

    return () => {
      html.style.overflow = prevValue;
    };
  }, []);

  return (
    <Portal>
      <div className={_cs(p.className, 'tc-backdrop')}>
        { p.children }
      </div>
    </Portal>
  );
}

export default Backdrop;
