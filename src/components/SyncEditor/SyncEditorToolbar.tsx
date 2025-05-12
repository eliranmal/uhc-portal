import React from 'react';

import {
  Alert,
  Button,
  ButtonVariant,
  Divider,
  Flex,
  FlexItem,
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';

import { Shortcut } from './Shortcut';
import { SyncEditorShortcuts } from './SyncEditorShortcuts';

type SyncEditorToolbarProps = {
  isRequestPending?: boolean;
  requestErrorMessage?: string;
  requestPendingMessage?: string;
  isSideBarVisible?: boolean;
  isContentValid?: boolean;
  toggleSideBar: () => void;
};

const ACCESSIBILITY_SHORTCUT = {
  PC: ['Ctrl', 'F1'],
  Mac: ['⌥ Opt', 'F1'],
  description: 'Accessibility help',
};

const SyncEditorToolbar = ({
  isRequestPending,
  requestPendingMessage,
  requestErrorMessage,
  isSideBarVisible,
  isContentValid,
  toggleSideBar,
}: SyncEditorToolbarProps) => (
  <Flex direction={{ default: 'column' }}>
    {isRequestPending && requestPendingMessage ? (
      <FlexItem>
        <Alert variant="info" title={requestPendingMessage} />
      </FlexItem>
    ) : null}
    {requestErrorMessage ? (
      <FlexItem>
        <Alert variant="danger" title={requestErrorMessage} />
      </FlexItem>
    ) : null}
    {!isContentValid ? (
      <FlexItem>
        <Alert variant="danger" title="Not valid content">
          <p>
            There are validation errors. Please fix them before submitting the cluster creation
            request.
          </p>
        </Alert>
      </FlexItem>
    ) : null}
    <Flex>
      <FlexItem align={{ default: 'alignRight' }} spacer={{ default: 'spacerMd' }}>
        <Flex>
          <FlexItem align={{ default: 'alignRight' }} spacer={{ default: 'spacerSm' }}>
            <Shortcut shortcut={ACCESSIBILITY_SHORTCUT} />
          </FlexItem>
          <FlexItem>
            <HelperText>
              <HelperTextItem variant="indeterminate">
                {ACCESSIBILITY_SHORTCUT.description}
              </HelperTextItem>
            </HelperText>
          </FlexItem>
        </Flex>
      </FlexItem>
      <Divider
        component="div"
        orientation={{
          default: 'vertical',
        }}
        inset={{ default: 'insetMd' }}
        className="pf-m-spacer-none"
      />
      <FlexItem spacer={{ default: 'spacerSm' }}>
        <SyncEditorShortcuts />
      </FlexItem>
      <Divider
        component="div"
        orientation={{
          default: 'vertical',
        }}
        inset={{ default: 'insetMd' }}
        className="pf-m-spacer-none"
      />
      <FlexItem>
        <Button variant={ButtonVariant.link} icon={<InfoCircleIcon />} onClick={toggleSideBar}>
          {isSideBarVisible ? 'Hide' : 'Show'} sidebar
        </Button>
      </FlexItem>
    </Flex>
  </Flex>
);

export { SyncEditorToolbar };
