import React from 'react';

const useGlobalBlur = (ref, callback) => {
  const wasOutside = e => {
    const currentRef = ref instanceof HTMLElement ? ref : ref?.current;
    callback(!currentRef?.contains(e.target));
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', wasOutside, false);
    return () => document.removeEventListener('mousedown', wasOutside, false);
  });
};

export default useGlobalBlur;
