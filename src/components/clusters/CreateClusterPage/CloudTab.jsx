import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PageSection, Title, Button, Stack, StackItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, expandable, cellWidth } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { OCM } from 'openshift-assisted-ui-lib';

import RedHatLogo from '../../../styles/images/Logo-RedHat-Hat-Color-RGB.png';
import IBMCloudLogo from '../../../styles/images/ibm_cloud-icon.png';
import MicrosoftLogo from '../../../styles/images/Microsoft_logo.svg';
import AWSLogo from '../../../styles/images/AWS.png';
import links from './CreateClusterConsts';
import CreateClusterDropDown from './CreateClusterDropDown';

const { TechnologyPreview, PreviewBadgePosition } = OCM;

const getColumns = () => [
  {
    title: '',
    cellFormatters: [expandable],
    transforms: [cellWidth(10)],
  },
  {
    title: 'Offerings',
    transforms: [cellWidth(25)],
  },
  {
    title: 'Purchased through',
    transforms: [cellWidth(20)],
  },
  {
    title: '\u00A0',
    transforms: [cellWidth(20)],
  },
  {
    title: 'Get started',
  },
];

const osdRow = (shouldExpand = true, isOpen = true, hasQuota = true, hasTrial = false) => {
  let contents = (
    <Button
      component="a"
      href={links.OSD_LEARN_MORE}
      variant="secondary"
      rel="noopener noreferrer"
      target="_blank"
    >
      Learn more
    </Button>
  );

  let buttonWidth = '';

  if (hasQuota) {
    if (hasTrial) {
      buttonWidth = 'create-cluster';
    }
    contents = (
      <Link id="create-cluster" to="/create/osd">
        <Button data-test-id="create_osd_cluster_btn" className={buttonWidth}>
          Create cluster
        </Button>
      </Link>
    );
  }

  const offeringRow = {
    cells: [
      {
        title: (
          <>
            <img className="partner-logo" src={RedHatLogo} alt="OSD" />
          </>
        ),
      },
      <>
        <a href={links.OSD_LEARN_MORE} rel="noopener noreferrer" target="_blank">
          Red Hat OpenShift Dedicated
        </a>
      </>,
      'Red Hat',
      'Available on AWS and GCP',
      <>{contents}</>,
    ],
  };
  const descriptionRow = {
    parent: 0,
    fullWidth: true,
    cells: [
      {
        title: (
          <Stack hasGutter>
            <StackItem>
              A complete OpenShift cluster provided as a fully-managed cloud service dedicated to a
              single customer. Reduce operational complexity and focus on building and scaling
              applications that add more value to your business.
              <br />
              Hosted on Amazon Web Services (AWS) and Google Cloud.
            </StackItem>
            <StackItem>
              <a href={links.OSD_LEARN_MORE} rel="noopener noreferrer" target="_blank">
                Learn more about Red Hat OpenShift Dedicated <ArrowRightIcon />
              </a>
            </StackItem>
          </Stack>
        ),
      },
    ],
  };
  if (shouldExpand) {
    offeringRow.isOpen = isOpen;
    return [offeringRow, descriptionRow];
  }
  return [offeringRow];
};

const osdTrialRow = () => {
  const contents = (
    <Link id="create-trial-cluster" to="/create/osdtrial?trial=osd">
      <Button className="create-trial-cluster">Create trial cluster</Button>
    </Link>
  );

  const offeringRow = {
    cells: [
      {
        title: (
          <>
            <img className="partner-logo" src={RedHatLogo} alt="OSD" />
          </>
        ),
      },
      <>
        <a href={links.OSD_LEARN_MORE} rel="noopener noreferrer" target="_blank">
          Red Hat OpenShift Dedicated Trial
        </a>
      </>,
      'Red Hat',
      'Available on AWS and GCP',
      <>{contents}</>,
    ],
  };
  return offeringRow;
};

const activeSubscriptionsTable = (hasOSDQuota, osdTrialEnabled) => {
  const columns = getColumns();
  let rows = [];

  if (hasOSDQuota) {
    rows = osdRow(false, true, true, osdTrialEnabled);
  }
  if (osdTrialEnabled) {
    rows.unshift(osdTrialRow(false));
  }

  return (
    <Table
      className="managed-subscriptions"
      aria-label="Managed subscriptions"
      cells={columns}
      rows={rows}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const managedServices = (hasQuota, rosaCreationWizardFeature, trialEnabled) => {
  const [openRows, setOpenRows] = useState([]);
  const onCollapse = (e, rowKey, open) => {
    if (open) {
      setOpenRows([...openRows, rowKey]);
    } else {
      setOpenRows(openRows.filter((row) => row !== rowKey));
    }
  };

  const rowKeys =
    hasQuota || trialEnabled
      ? {
          azure: 0,
          ibm: 2,
          aws: 4,
        }
      : {
          osd: 0,
          azure: 2,
          ibm: 4,
          aws: 6,
        };

  const defaultRows = [
    {
      isOpen: openRows.includes(rowKeys.azure),
      cells: [
        <>
          <img className="partner-logo" src={MicrosoftLogo} alt="Microsoft" />
        </>,
        <>
          <a href={links.AZURE} target="_blank" rel="noopener noreferrer">
            Azure Red Hat OpenShift
          </a>
        </>,
        'Microsoft Azure',
        'Flexible hourly billing',
        <>
          <Button
            component="a"
            href={links.AZURE}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            className="get-started-button"
          >
            Try it on Azure
          </Button>
        </>,
      ],
    },
    {
      parent: rowKeys.azure,
      fullWidth: true,
      cells: [
        {
          title: (
            <Stack hasGutter>
              <StackItem>
                A flexible, self-service deployment of OpenShift clusters provided as a
                fully-managed cloud service by Microsoft and Red Hat.
                <br />
                Hosted on Microsoft Azure.
              </StackItem>
              <StackItem>
                <a href={links.AZURE} target="_blank" rel="noopener noreferrer">
                  Learn more about Azure Red Hat OpenShift <ArrowRightIcon />
                </a>
              </StackItem>
            </Stack>
          ),
        },
      ],
    },
    {
      isOpen: openRows.includes(rowKeys.ibm),
      cells: [
        <>
          <img className="partner-logo" src={IBMCloudLogo} alt="IBM Cloud" />
        </>,
        <>
          <a href={links.IBM_CLOUD_LEARN_MORE} target="_blank" rel="noopener noreferrer">
            Red Hat OpenShift on IBM Cloud
          </a>
        </>,
        'IBM',
        'Flexible hourly billing',
        <>
          <Button
            component="a"
            href={links.IBM_CLOUD}
            variant="secondary"
            target="_blank"
            rel="noopener noreferrer"
            className="get-started-button"
          >
            Try it on IBM
          </Button>
        </>,
      ],
    },
    {
      parent: rowKeys.ibm,
      fullWidth: true,
      cells: [
        {
          title: (
            <Stack hasGutter>
              <StackItem>
                A preconfigured OpenShift environment provided as a fully-managed cloud service at
                enterprise scale.
                <br />
                Hosted on IBM Cloud.
              </StackItem>
              <StackItem>
                <a href={links.IBM_CLOUD_LEARN_MORE} target="_blank" rel="noopener noreferrer">
                  Learn more about Red Hat OpenShift on IBM Cloud <ArrowRightIcon />
                </a>
              </StackItem>
            </Stack>
          ),
        },
      ],
    },
    {
      isOpen: openRows.includes(rowKeys.aws),
      cells: [
        <>
          <img className="partner-logo" src={AWSLogo} alt="AWS" />
        </>,
        <>
          <a href={links.AWS} target="_blank" rel="noopener noreferrer">
            Red Hat OpenShift Service on AWS (ROSA)
          </a>
        </>,
        'Amazon Web Services',
        'Flexible hourly billing',
        <>
          <CreateClusterDropDown />
        </>,
      ],
    },
    {
      parent: rowKeys.aws,
      fullWidth: true,
      cells: [
        {
          title: (
            <Stack hasGutter>
              <StackItem>
                Build, deploy, and manage Kubernetes applications with Red Hat OpenShift running
                natively on AWS.
                <br />
                Hosted on AWS.
              </StackItem>
              <StackItem>
                <a href={links.AWS} target="_blank" rel="noopener noreferrer">
                  Learn more about Red Hat OpenShift Service on AWS <ArrowRightIcon />
                </a>
              </StackItem>
            </Stack>
          ),
        },
      ],
    },
  ];

  const rows =
    hasQuota || trialEnabled
      ? defaultRows
      : osdRow(true, openRows.includes(rowKeys.osd), hasQuota).concat(defaultRows);

  return (
    <Table
      aria-label="Managed services table"
      rows={rows}
      cells={getColumns()}
      onCollapse={onCollapse}
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const runItYourself = () => {
  const columns = ['Cloud provider', 'Installation options'];
  const rows = [
    [
      <>
        <Link to="/install/alibaba/installer-provisioned" className="pf-u-mr-xs">
          Alibaba Cloud
        </Link>
        <TechnologyPreview position={PreviewBadgePosition.inline} />
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/aws">AWS (x86_64)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/aws/arm">AWS (ARM)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/azure">Azure (x86_64)</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/azure/multi/installer-provisioned" className="pf-u-mr-xs">
          Azure (heterogeneous)
        </Link>
        <TechnologyPreview position={PreviewBadgePosition.inline} />
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/gcp">Google Cloud</Link>
      </>,
      'Full stack automation and pre-existing infrastructure',
    ],
    [
      <>
        <Link to="/install/ibm-cloud" className="pf-u-mr-xs">
          IBM Cloud
        </Link>
        <TechnologyPreview position={PreviewBadgePosition.inline} />
      </>,
      'Full stack automation',
    ],
    [
      <>
        <Link to="/install/platform-agnostic">Platform agnostic (x86_64)</Link>
      </>,
      'Pre-existing infrastructure',
    ],
  ];
  return (
    <Table className="run-it-yourself" aria-label="Run it yourself" cells={columns} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};

const CloudTab = ({ hasOSDQuota, rosaCreationWizardFeature, trialEnabled }) => (
  <>
    {(hasOSDQuota || trialEnabled) && (
      <PageSection variant="light">
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2">Active subscriptions</Title>
          </StackItem>
          <StackItem>
            {activeSubscriptionsTable(hasOSDQuota, trialEnabled)}
            <Link to="/quota">
              <Button id="subscriptions" variant="link">
                View your available quota <ArrowRightIcon />
              </Button>
            </Link>
          </StackItem>
        </Stack>
      </PageSection>
    )}
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">Managed services</Title>
        </StackItem>
        <StackItem>
          Create clusters in the cloud using a managed service.
          {managedServices(hasOSDQuota, rosaCreationWizardFeature, trialEnabled)}
        </StackItem>
      </Stack>
    </PageSection>
    <PageSection>
      <Stack hasGutter>
        <StackItem>
          <Title headingLevel="h2">Run it yourself</Title>
        </StackItem>
        <StackItem>
          Run OpenShift clusters on your own by installing from another cloud provider.
          {runItYourself()}
        </StackItem>
      </Stack>
    </PageSection>
  </>
);

export default CloudTab;

CloudTab.propTypes = {
  hasOSDQuota: PropTypes.bool.isRequired,
  trialEnabled: PropTypes.bool.isRequired,
  rosaCreationWizardFeature: PropTypes.bool.isRequired,
};
