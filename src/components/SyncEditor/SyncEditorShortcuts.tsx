import React from 'react';

import {
  Button,
  ButtonVariant,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Popover,
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';

import { shortcut } from './model/shortcut';
import { Shortcut } from './Shortcut';

const shortcuts: shortcut[] = [
  {
    PC: ['F1'],
    Mac: ['F1'],
    description: 'View all editor shortcuts',
  },
  {
    PC: ['Ctrl', 'F'],
    Mac: ['⌥ Opt', 'F'],
    description: 'Search',
  },
  {
    PC: ['Ctrl', 'Space'],
    Mac: ['⌥ Opt', 'Esc'],
    description: 'Activate auto complete',
  },
  {
    PC: ['Alt', 'Down'],
    Mac: ['⌥ Opt', 'Down'],
    description: 'Move a line down',
  },
  {
    PC: ['Alt', 'Up'],
    Mac: ['⌥ Opt', 'Up'],
    description: 'Move a line up',
  },
  {
    PC: ['Alt', 'F8'],
    Mac: ['⌥ Opt', 'F8'],
    description: 'View problem',
  },
  {
    PC: ['🖱 Hover'],
    Mac: ['🖱 Hover'],
    description: 'View property descriptions',
  },
];

const shortcutsPopoverProps = {
  bodyContent: (
    <Grid span={6} hasGutter key="grid">
      {shortcuts.map((shortcut, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`shortcut-${index}`}>
          <GridItem style={{ textAlign: 'right', marginRight: '1em' }}>
            <Shortcut shortcut={shortcut} />
          </GridItem>
          <GridItem>
            <HelperText>
              <HelperTextItem variant="indeterminate">{shortcut.description}</HelperTextItem>
            </HelperText>
          </GridItem>
        </React.Fragment>
      ))}
    </Grid>
  ),
  'aria-label': 'Shortcuts',
};

type SyncEditorShortcutsProps = {
  shortcutsPopoverButtonText?: string;
};

const SyncEditorShortcuts = ({
  shortcutsPopoverButtonText = 'View Shortcuts',
}: SyncEditorShortcutsProps) => (
  <Popover {...shortcutsPopoverProps}>
    <Button variant={ButtonVariant.link} icon={<HelpIcon />}>
      {shortcutsPopoverButtonText}
    </Button>
  </Popover>
);

export { SyncEditorShortcuts };
