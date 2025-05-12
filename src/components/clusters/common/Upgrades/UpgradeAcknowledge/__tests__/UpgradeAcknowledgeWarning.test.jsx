import React from 'react';

import { checkAccessibility, render, screen } from '~/testUtils';

import UpgradeAcknowledgeWarning from '../UpgradeAcknowledgeWarning/UpgradeAcknowledgeWarning';

describe('<UpgradeAcknowledgeWarning>', () => {
  const openModal = jest.fn();

  const defaultProps = {
    isStsEnabled: false,
    isHypershift: false,
    cluster: {
      id: 'myClusterId',
      openshift_version: 'my.openshift.version',
      version: {
        raw_id: '4.2.10',
        available_upgrades: ['4.4.10'],
      },
      upgradeGates: [
        {
          version_gate: { id: '1' },
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
        {
          version_gate: { id: '2' },
          version_raw_id_prefix: '4.2',
          title: 'upgrade to 4.2',
          sts_only: false,
        },
        {
          version_gate: { id: '3' },
          version_raw_id_prefix: '4.5',
          title: 'upgrade to 4.5',
          sts_only: false,
        },
        {
          version_gate: { id: '4' },
          version_raw_id_prefix: '5.10',
          title: 'upgrade to 5.10',
          sts_only: false,
        },
      ],
    },
    schedules: {
      items: [{ upgrade_type: 'OSD', schedule_type: 'automatic', state: { value: 'started' } }],
    },
    upgradeGates: [
      {
        id: '1',
        version_raw_id_prefix: '4.4',
        title: 'upgrade to 4.4',
        sts_only: false,
      },
      {
        id: '2',
        version_raw_id_prefix: '4.2',
        title: 'upgrade to 4.2',
        sts_only: false,
      },
      {
        id: '3',
        version_raw_id_prefix: '4.5',
        title: 'upgrade to 4.5',
        sts_only: false,
      },
      {
        id: '4',
        version_raw_id_prefix: '5.9',
        title: 'upgrade to 5.9',
        sts_only: true,
      },
    ],
  };

  afterEach(() => {
    openModal.mockClear();
  });

  it('Displays nothing if cluster id is unknown', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        ...defaultProps.cluster,
        id: undefined,
      },
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Displays nothing if openshiftVersion is unknown', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        ...defaultProps.cluster,
        openshift_version: undefined,
      },
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display nothing if no clusterUnmetAcks AND do not show confirm', () => {
    const { container } = render(<UpgradeAcknowledgeWarning {...defaultProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display confirmation if  clusterMetAcks and is yStream approved', async () => {
    const newProps = {
      ...defaultProps,
      showConfirm: true,
      isMinorVersionUpgradesEnabled: true,
    };

    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);

    expect(screen.getByText('Administrator acknowledgement was received.')).toBeInTheDocument();
    await checkAccessibility(container);
  });

  it('Display confirmation if there is only clusterMetAcks and is not yStream approved', () => {
    const newProps = {
      ...defaultProps,
      showConfirm: true,
    };
    render(<UpgradeAcknowledgeWarning {...newProps} />);

    expect(screen.getByText('Administrator acknowledgement was received.')).toBeInTheDocument();
  });

  it('Display message if isManual AND if is Info', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        id: 'muClusterId',
        openshift_version: 'my.openshift.version',
        version: {
          raw_id: '4.2.10',
          available_upgrades: ['4.4.10'],
        },
        upgradeGates: [
          { version_gate: { id: 'oldGate' } },
          { version_gate: { id: '3' } },
          { version_gate: { id: '6' } },
          { version_gate: { id: '9' } },
        ],
      },
      schedules: {
        items: [
          {
            upgrade_type: 'OSD',
            schedule_type: 'manual',
            state: { value: 'scheduled' },
            version: '4.2.10',
          },
        ],
      },
      upgradeGates: [
        {
          id: '1',
          version_raw_id_prefix: '4.2',
          title: 'upgrade to 4.2',
          sts_only: false,
        },
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '4',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3 sts only',
          sts_only: true,
        },
        {
          id: '5',
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
        {
          id: '7',
          version_raw_id_prefix: '5.3',
          title: 'upgrade to 5.3',
          sts_only: false,
        },
        {
          id: '8',
          version_raw_id_prefix: '5.4',
          title: 'upgrade to 5.4',
          sts_only: false,
        },
      ],
      isInfo: true,
      isPlain: false,
    };

    render(<UpgradeAcknowledgeWarning {...newProps} />);

    expect(
      screen.getByText(
        'Administrator acknowledgement is required before updating from 4.2.10 to 4.4.10',
      ),
    ).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'Provide approval' })).not.toBeInTheDocument();
  });

  it('displays nothing if isManual but has a scheduled upgrade', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        id: 'muClusterId',
        openshift_version: 'my.openshift.version',
        version: {
          raw_id: '4.4.10',
          available_upgrades: ['4.4.10'],
        },
        upgradeGates: [
          { version_gate: { id: 'oldGate' } },
          { version_gate: { id: '3' } },
          { version_gate: { id: '6' } },
          { version_gate: { id: '9' } },
        ],
      },
      schedules: {
        items: [{ upgrade_type: 'OSD', schedule_type: 'manual', state: { value: 'scheduled' } }],
      },
      upgradeGates: [
        {
          id: '1',
          version_raw_id_prefix: '4.2',
          title: 'upgrade to 4.2',
          sts_only: false,
        },
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '4',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3 sts only',
          sts_only: true,
        },
        {
          id: '5',
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
        {
          id: '7',
          version_raw_id_prefix: '5.3',
          title: 'upgrade to 5.3',
          sts_only: false,
        },
        {
          id: '8',
          version_raw_id_prefix: '5.4',
          title: 'upgrade to 5.4',
          sts_only: false,
        },
      ],
      isInfo: true,
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display nothing if isManual AND if is not Info', () => {
    const newProps = {
      ...defaultProps,
      schedules: {
        items: [{ upgrade_type: 'OSD', schedule_type: 'manual', state: { value: 'scheduled' } }],
      },
      isInfo: false,
    };
    const { container } = render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('Display alert if is not manual', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        id: 'muClusterId',
        openshift_version: 'my.openshift.version',
        version: {
          raw_id: '4.2.10',
          available_upgrades: ['4.4.10'],
        },
        upgradeGates: [
          { version_gate: { id: 'oldGate' } },
          { version_gate: { id: '3' } },
          { version_gate: { id: '6' } },
          { version_gate: { id: '9' } },
        ],
      },
      schedules: {
        items: [{ version: '4.4.10', schedule_type: 'automatic' }],
      },
      upgradeGates: [
        {
          id: '1',
          version_raw_id_prefix: '4.2',
          title: 'upgrade to 4.2',
          sts_only: false,
        },
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '4',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3 sts only',
          sts_only: true,
        },
        {
          id: '5',
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
        {
          id: '7',
          version_raw_id_prefix: '5.3',
          title: 'upgrade to 5.3',
          sts_only: false,
        },
        {
          id: '8',
          version_raw_id_prefix: '5.4',
          title: 'upgrade to 5.4',
          sts_only: false,
        },
      ],
      isInfo: true,
    };
    render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(
      screen.getByText(
        'Administrator acknowledgement is required before updating from 4.2.10 to 4.4.10',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Provide approval' })).toBeInTheDocument();
  });

  it('Display alert if individual update is required', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        id: 'muClusterId2',
        openshift_version: 'my.openshift.version',
        version: {
          raw_id: '4.2.10',
          available_upgrades: ['4.4.10'],
        },
        upgradeGates: [{ version_gate: { id: 'oldGate' } }],
      },
      schedules: {
        items: [
          {
            id: 'myUpgradePolicyID',
            version: '4.4.10',
            schedule_type: 'automatic',
            state: { value: 'pending' },
            enable_minor_version_upgrades: false,
          },
        ],
      },
      upgradeGates: [
        {
          id: '1',
          version_raw_id_prefix: '4.2',
          title: 'upgrade to 4.2',
          sts_only: false,
        },
      ],
      isInfo: true,
    };
    const { container } = render(<UpgradeAcknowledgeWarning showUpgradeWarning {...newProps} />);
    console.log(container.innerHTML);
    expect(
      screen.getByText(
        'Your update strategy is currently set to recurring updates. Update 4.4.10 is a Y steam update and must be individually updated.',
      ),
    ).toBeInTheDocument();
  });

  it('Set correct info when opening modal', () => {
    const newProps = {
      ...defaultProps,
      cluster: {
        id: 'muClusterId',
        openshift_version: 'my.openshift.version',
        version: {
          raw_id: '4.2.10',
          available_upgrades: ['4.4.10'],
        },
        upgradeGates: [
          { version_gate: { id: 'oldGate' } },
          { version_gate: { id: '3' } },
          { version_gate: { id: '6' } },
          { version_gate: { id: '9' } },
        ],
      },
      schedules: {
        items: [{ version: '4.4.10', schedule_type: 'automatic' }],
      },
      upgradeGates: [
        {
          id: '1',
          version_raw_id_prefix: '4.2',
          title: 'upgrade to 4.2',
          sts_only: false,
        },
        {
          id: '2',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3',
          sts_only: false,
        },
        {
          id: '4',
          version_raw_id_prefix: '4.3',
          title: 'upgrade to 4.3 sts only',
          sts_only: true,
        },
        {
          id: '5',
          version_raw_id_prefix: '4.4',
          title: 'upgrade to 4.4',
          sts_only: false,
        },
        {
          id: '7',
          version_raw_id_prefix: '5.3',
          title: 'upgrade to 5.3',
          sts_only: false,
        },
        {
          id: '8',
          version_raw_id_prefix: '5.4',
          title: 'upgrade to 5.4',
          sts_only: false,
        },
      ],
      isPlain: true,
    };

    render(<UpgradeAcknowledgeWarning {...newProps} />);
    expect(
      screen.getByText(
        'Administrator acknowledgement is required before updating from 4.2.10 to 4.4.10',
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Provide approval' })).toBeInTheDocument();
  });
});
