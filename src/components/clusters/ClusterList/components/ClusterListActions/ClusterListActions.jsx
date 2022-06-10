/*
Copyright (c) 2021 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  ToolbarItem,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const useMediaQuery = (query) => {
  if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') {
    return false;
  }

  const mediaQuery = window.matchMedia(query);
  const [match, setMatch] = React.useState(!!mediaQuery.matches);

  React.useEffect(() => {
    const handler = () => setMatch(!!mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return match;
};

const dropdownRegisterCluster = (
  <DropdownItem component="button" key="registercluster" data-testid="register-cluster-item">
    <div>
      <Link to="/register" className="pf-c-dropdown__menu-item">
        Register disconnected cluster
      </Link>
    </div>
  </DropdownItem>
);
const dropdownArchived = (
  <DropdownItem component="button" key="archived">
    <div>
      <Link to="archived" className="pf-c-dropdown__menu-item">
        View cluster archives
      </Link>
    </div>
  </DropdownItem>
);
const dropdownAssisteInstaller = (
  <DropdownItem component="button" key="assistedinstaller">
    <div>
      <Link to="/assisted-installer" className="pf-c-dropdown__menu-item">
        Assisted Installer clusters
      </Link>
    </div>
  </DropdownItem>
);
const toolbarCreateCluster = (
  <ToolbarItem key="createcluster">
    <Link to="/create">
      <Button data-test-id="create_cluster_btn">Create cluster</Button>
    </Link>
  </ToolbarItem>
);
const toolbarRegisterCluster = (
  <ToolbarItem key="registercluster">
    <Link to="/register" rel="noopener noreferrer">
      <Button variant="secondary" data-testid="register-cluster-item">
        Register cluster
      </Button>
    </Link>
  </ToolbarItem>
);

const useItems = (aiEnabled) => {
  const wide = useMediaQuery('(min-width: 900px)');

  const toolbarItems = [];
  const dropdownItems = [];

  toolbarItems.push(toolbarCreateCluster);
  if (wide) {
    toolbarItems.push(toolbarRegisterCluster);
  } else {
    dropdownItems.push(dropdownRegisterCluster);
  }
  dropdownItems.push(dropdownArchived);

  if (aiEnabled) {
    dropdownItems.push(dropdownAssisteInstaller);
  }

  return [dropdownItems, toolbarItems];
};

const ClusterListActions = ({ className, aiEnabled }) => {
  const [isOpen, onToggle] = useState(false);
  const [dropdownItems, toolbarItems] = useItems(aiEnabled);

  return (
    <>
      {toolbarItems}
      <ToolbarItem>
        <Dropdown
          data-testid="cluster-list-extra-actions-dropdown"
          onSelect={() => onToggle(!isOpen)}
          toggle={<KebabToggle onToggle={onToggle} />}
          isOpen={isOpen}
          isPlain
          dropdownItems={dropdownItems}
          className={className}
          position={DropdownPosition.right}
        />
      </ToolbarItem>
    </>
  );
};

ClusterListActions.propTypes = {
  className: PropTypes.string,
  aiEnabled: PropTypes.bool,
};

export default ClusterListActions;
