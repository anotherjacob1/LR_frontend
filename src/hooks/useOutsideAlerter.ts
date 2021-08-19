import React, { useEffect } from 'react';

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(
  ref: React.MutableRefObject<HTMLElement | HTMLInputElement | null>,
  onClick: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClick();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClick]);
}

export default useOutsideAlerter;
