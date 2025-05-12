import React from 'react';

import { Chip } from '@patternfly/react-core';

import { isMac } from '~/common/navigator';

import { shortcut } from './model/shortcut';

type ShortcutProps = {
  shortcut: shortcut;
};
const Shortcut = ({ shortcut }: ShortcutProps) =>
  shortcut[isMac ? 'Mac' : 'PC']
    .map((key) => (
      <Chip key={key} isReadOnly>
        {key}
      </Chip>
    ))
    .reduce((prev, curr) => (
      // eslint-disable-next-line react/jsx-no-useless-fragment
      <>{[prev, ' + ', curr]}</>
    ));

export { Shortcut };
