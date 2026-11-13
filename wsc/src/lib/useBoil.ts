import { useEffect, type RefObject } from 'react';
import { registerBoil } from './boil';

export function useBoil(ref: RefObject<HTMLElement | SVGElement>, enabled = true) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return registerBoil(el, enabled);
  }, [ref, enabled]);
}
