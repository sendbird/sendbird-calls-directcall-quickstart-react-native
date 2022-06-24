/* eslint-disable */
import type { DependencyList } from 'react';
import { useEffect, useLayoutEffect } from 'react';

type Destructor = () => void;

type AsyncEffectCallback = () => void | Destructor | Promise<void> | Promise<Destructor>;

export const useEffectAsync = (asyncEffect: AsyncEffectCallback, deps?: DependencyList) => {
  useEffect(createAsyncEffectCallback(asyncEffect), deps);
};

export const useLayoutEffectAsync = (asyncEffect: AsyncEffectCallback, deps?: DependencyList) => {
  useLayoutEffect(createAsyncEffectCallback(asyncEffect), deps);
};

export const useIIFE = <T>(callback: () => T) => {
  return iife(callback);
};

const iife = <T extends (...args: never[]) => any>(callback: T): ReturnType<T> => callback();

const createAsyncEffectCallback = (asyncEffect: AsyncEffectCallback) => () => {
  const destructor = iife(asyncEffect);
  return () => {
    if (!destructor) return;

    if (destructor instanceof Promise) {
      iife(async () => {
        const awaitedDestructor = await destructor;
        if (awaitedDestructor) awaitedDestructor();
      });
    } else {
      iife(destructor);
    }
  };
};
