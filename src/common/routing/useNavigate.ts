/* eslint-disable custom-rules/restrict-react-router-imports */
import { useCallback, useEffect, useRef } from 'react';
import { NavigateOptions, To, useNavigate as routerUseNavigate } from 'react-router-dom';

import { withBasename } from './getBaseName';

export interface NavigateFunction {
  (to: To, options?: NavigateOptions): void;
}

const useNavigate = () => {
  const navigate = routerUseNavigate();
  const wrapNavigate: NavigateFunction = (to, options) => {
    navigate(withBasename(to), options);
  };
  return wrapNavigate;
};

// prevent re-rendering issues
// https://github.com/remix-run/react-router/issues/7634#issuecomment-1094099414
const useStableNavigate = () => {
  const navigate = useNavigate();
  const navigateRef = useRef({ navigate });
  useEffect(() => {
    navigateRef.current.navigate = navigate;
  }, [navigate]);
  return useCallback((to: To, navigateOptions?: NavigateOptions) => {
    navigateRef.current.navigate(to, navigateOptions);
  }, []);
};

export default useStableNavigate;
