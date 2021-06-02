import React from 'react';

import Spinner from '#components/spinner';

export const GlobalLoadingContext = React.createContext({
  loading: false,
  setLoading: () => { console.warn('setLoading on GlobalLoadingContext called without initialization'); },
});

export function NewGlobalLoadingParent() {
  React.useEffect(() => {
    document.body.classList.add('unscrollable-y');

    return () => { document.body.classList.remove('unscrollable-y'); };
  }, []);

  return (
    <div className='loading-pane'>
      <Spinner />
    </div>
  );
}

function NewGlobalLoading() {
  const { setLoading } = React.useContext(GlobalLoadingContext);

  React.useEffect(() => {
    setLoading(true);

    return () => setLoading(false);
  });

  return null;
}

export default NewGlobalLoading;
