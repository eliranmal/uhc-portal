/* ClipboardCopyLink button is a button (link variant),
that allows you to copy text to the clipboard, and show a Tooltip saying "Copied!"
just like PatternFly's "ClipboardCopy", but without the text input.
*/
import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import { Button, Tooltip } from '@patternfly/react-core';

type Props = {
  text: string;
  className?: string;
  isDisabled?: boolean;
  children?: React.ReactNode;
};

const ClipboardCopyLinkButton = ({ text, className, children, isDisabled }: Props) => {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<number>();
  const onCopy = React.useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    setCopied(true);
    timerRef.current = window.setTimeout(() => {
      setCopied(false);
      timerRef.current = undefined;
    }, 2500);
  }, []);

  return (
    <Tooltip
      trigger="mouseenter focus click"
      entryDelay={100}
      exitDelay={500}
      content={<div>{copied ? 'Successfuly copied to clipboard!' : 'Copy to clipboard'}</div>}
    >
      <CopyToClipboard text={text} onCopy={onCopy}>
        <Button className={className} variant="link" isAriaDisabled={isDisabled}>
          {children}
        </Button>
      </CopyToClipboard>
    </Tooltip>
  );
};

export default ClipboardCopyLinkButton;
