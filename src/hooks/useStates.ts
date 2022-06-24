import { useReducer } from 'react';

export const useStates = <T extends object>(initialValue: T) => {
  return useReducer((prev: T, next: Partial<T>) => ({ ...prev, ...next }), initialValue);
};
