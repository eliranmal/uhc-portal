/**
 * Before we had: "@types/react-copy-to-clipboard": "^5.0.1"
 * But due to issues with @types/react@18, replaced with this
 * 
 * See also https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25414
 */
declare module 'react-copy-to-clipboard' {
  import React from 'react';

  interface Options {
    debug: boolean;
    message: string;
  }

  interface Props {
    text: string;
    onCopy?(a: string, b: boolean): void;
    options?: Options;
    children?: React.ReactNode;
  }

  // eslint-disable-next-line react/prefer-stateless-function
  class CopyToClipboard extends React.Component<React.PropsWithChildren<Props>, {}> {}
  export default CopyToClipboard;
}
