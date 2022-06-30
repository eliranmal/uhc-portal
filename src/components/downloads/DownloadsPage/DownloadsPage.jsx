import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ExpandableSectionToggle,
  PageSection,
  Split,
  SplitItem,
  FormSelect,
  FormSelectOption,
  Text,
  TextContent,
} from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components/PageHeader';
import {
  TableComposable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ExpandableRowContent,
} from '@patternfly/react-table';
import { ArrowRightIcon } from '@patternfly/react-icons';
import { Link } from 'react-router-dom';
import { OCM } from 'openshift-assisted-ui-lib';

import produce from 'immer';
import { has, get } from 'lodash';

import ExternalLink from '../../common/ExternalLink';
import links, {
  tools,
  channels,
  operatingSystems,
  operatingSystemOptions,
  architectureOptions,
  githubReleasesToFetch,
  urlsSelector,
} from '../../../common/installLinks.mjs';
import DevPreviewBadge from '../../common/DevPreviewBadge';

import DownloadButton from '../../clusters/install/instructions/components/DownloadButton';
import AlignRight from '../../common/AlignRight';
import DownloadsCategoryDropdown from '../DownloadsCategoryDropdown';
import { expandKeys, downloadsCategories } from '../downloadsStructure';
import DownloadsSection from '../DownloadsSection';
import DownloadPullSecret from '../DownloadPullSecret';
import CopyPullSecret from '../CopyPullSecret';

import './DownloadsPage.scss';

const { TechnologyPreview, PreviewBadgePosition } = OCM;

const ColumnHeadings = () => (
  <Thead>
    <Tr>
      <Th width={10} />
      <Th width={40}>Name</Th>
      <Th width={20}>OS type</Th>
      <Th width={20}>Architecture type</Th>
    </Tr>
  </Thead>
);

/**
 * @returns User's OS (one of `operatingSystems` keys), or null if detection failed.
 */
export function detectOS() {
  const { platform } = window.navigator;
  const macOSPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];

  if (macOSPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.mac;
  }
  if (windowsPlatforms.indexOf(platform) !== -1) {
    return operatingSystems.windows;
  }
  if (/Linux/.test(platform)) {
    return operatingSystems.linux;
  }
  return null;
}

/**
 * Returns relevant subset of `operatingSystemOptions`.
 */
export const allOperatingSystemsForTool = (urls, tool, channel) =>
  operatingSystemOptions.filter(({ value: OS }) =>
    architectureOptions.find(({ value: architecture }) =>
      has(urls, [tool, channel, architecture, OS]),
    ),
  );

/**
 * Returns relevant subset of `architectureOptions`
 * (not all of them valid for currently chosen OS, but form _some_ OS).
 */
export const allArchitecturesForTool = (urls, tool, channel) =>
  architectureOptions.filter(({ value: architecture }) =>
    operatingSystemOptions.find(({ value: OS }) => has(urls, [tool, channel, architecture, OS])),
  );

/**
 * Returns relevant subset from `architectureOptions`.
 */
export const architecturesForToolOS = (urls, tool, channel, OS) =>
  architectureOptions.filter(({ value: architecture }) =>
    has(urls, [tool, channel, architecture, OS]),
  );

export const operatingSystemDropdown = (urls, tool, channel, OS, setOS) => (
  <FormSelect value={OS} data-test-id={`os-dropdown-${tool}`} onChange={setOS} aria-label="Select OS dropdown">
    <FormSelectOption key="select" value="select" label="Select OS" isDisabled />
    {allOperatingSystemsForTool(urls, tool, channel).map(({ value, label }) => (
      <FormSelectOption key={value} value={value} label={label} />
    ))}
  </FormSelect>
);

export const architectureDropdown = (urls, tool, channel, OS, architecture, setArchitecture) => {
  const optionsForOS = architecturesForToolOS(urls, tool, channel, OS);
  return (
    <FormSelect
      aria-label="Select architecture dropdown"
      value={architecture}
      onChange={setArchitecture}
      isDisabled={optionsForOS.length <= 1}
      data-test-id={`arch-dropdown-${tool}`}
    >
      <FormSelectOption key="select" value="select" label="Select architecture" isDisabled />
      {allArchitecturesForTool(urls, tool, channel).map(
        ({ value, label }) =>
          has(urls, [tool, channel, value, OS]) && (
            <FormSelectOption key={value} value={value} label={label} />
          ),
      )}
    </FormSelect>
  );
};

/**
 * @param tool - one of `installLinks.tools`.
 * @param detectedOS - result of detectOS(), injected for testing.
 * @returns {OS, architecture}
 */
export const initialSelection = (urls, tool, channel, detectedOS) => {
  // Start with an OS and architecture chosen so that some users can
  // click Download directly without having to change selections.
  const OSes = allOperatingSystemsForTool(urls, tool, channel).map((os) => os.value);
  const OS = detectedOS && OSes.includes(detectedOS) ? detectedOS : OSes?.[0];
  const architecture = architecturesForToolOS(urls, tool, channel, OS)?.[0]?.value;
  return { OS, architecture };
};

/**
 * Renders choice dropdowns + download button with linked behavior.
 * Does not keep state - expects state + callbacks to be passed in.
 * This allows reuse on different pages with different layouts.
 * @param selections - { [tool]: { OS, architecture } }
 * @param setSelections - callback to replace whole `selections` map
 * @param urls - either static `installLinks.urls` or result of urlsSelector() with github links.
 * @param tool - one of `tools`
 * @param channel - one of `channels`
 * @param downloadButtonProps - extra props for download button
 * @returns { osDropdown, archDropdown, downloadButton }
 */
export const downloadChoice = (
  selections,
  setSelections,
  urls,
  tool,
  channel,
  downloadButtonProps,
) => {
  const { OS, architecture } =
    selections[tool] || initialSelection(urls, tool, channel, detectOS());
  // Callbacks for dropdowns:
  const onChangeOS = (newOS) => {
    let newArchitecture = architecture;
    // Invalidate arch selection if not compatible
    if (!has(urls, [tool, channel, architecture, newOS])) {
      const optionsForOS = architecturesForToolOS(urls, tool, channel, newOS);
      newArchitecture = optionsForOS.length > 1 ? 'select' : optionsForOS[0].value;
    }
    setSelections({ ...selections, [tool]: { OS: newOS, architecture: newArchitecture } });
  };
  const onChangeArchitecture = (newArchitecture) => {
    setSelections({ ...selections, [tool]: { OS, architecture: newArchitecture } });
  };

  // If Github API fetching of last release fails, we can't link to direct download,
  // fallback to navigating to last release page in new tab, where user will pick OS/arch.
  if (allOperatingSystemsForTool(urls, tool, channel).length === 0) {
    const fallback = get(urls, [tool, channel, 'fallbackNavigateURL']);
    return {
      osDropdown: '', // hide dropdowns
      archDropdown: '',
      downloadButton: (
        <DownloadButton url={fallback} download={false} tool={tool} {...downloadButtonProps} />
      ),
    };
  }

  const url = get(urls, [tool, channel, architecture, OS]);
  return {
    osDropdown: operatingSystemDropdown(urls, tool, channel, OS, onChangeOS),
    archDropdown: architectureDropdown(urls, tool, channel, OS, architecture, onChangeArchitecture),
    downloadButton: <DownloadButton url={url} tool={tool} {...downloadButtonProps} />,
  };
};

const rowId = (expandKey) => `tool-${expandKey}`;

/** An expandable pair of table rows. */
const ExpandableRowPair = ({ expanded, setExpanded, expandKey, cells, description, toolRefs }) => {
  const isExpanded = !!expanded[expandKey];
  const onToggle = (event, rowIndex, newOpen) => {
    setExpanded({ ...expanded, [expandKey]: newOpen });
  };
  return (
    <Tbody isExpanded={isExpanded} ref={get(toolRefs, expandKey)}>
      <Tr>
        <Td expand={{ isExpanded, onToggle, rowIndex: 0 }} />
        {cells}
      </Tr>
      <Tr isExpanded={isExpanded} data-test-id={`expanded-row-${expandKey}`}>
        <Td colSpan={1 + cells.length}>
          <ExpandableRowContent>{description}</ExpandableRowContent>
        </Td>
      </Tr>
    </Tbody>
  );
};
ExpandableRowPair.propTypes = {
  // { [expandKey]: boolean }
  expanded: PropTypes.object,
  // callback to replace whole `expanded` map
  setExpanded: PropTypes.func,
  // { [expandKey]: ref } - to allow referring to specific row pairs
  toolRefs: PropTypes.object,
  // tool or other key for `expanded` array
  expandKey: PropTypes.oneOf(Object.values(expandKeys)),
  // array of `<Td>` cells for first row
  cells: PropTypes.arrayOf(PropTypes.node),
  // content for full-width description cell
  description: PropTypes.node,
};

/** Row pair for a tool. */
const ToolAndDescriptionRows = ({
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
  tool,
  channel,
  name,
  description,
}) => {
  const chooser = downloadChoice(selections, setSelections, urls, tool, channel, {
    text: 'Download',
  });

  return (
    <ExpandableRowPair
      expanded={expanded}
      setExpanded={setExpanded}
      toolRefs={toolRefs}
      expandKey={tool}
      cells={[
        <Td dataLabel="Name">
          <span>{name}</span>
        </Td>,
        <Td dataLabel="OS">{chooser.osDropdown}</Td>,
        <Td dataLabel="Architecture">{chooser.archDropdown}</Td>,
        <Td dataLabel="">
          <AlignRight>{chooser.downloadButton} </AlignRight>
        </Td>,
      ]}
      description={description}
    />
  );
};
ToolAndDescriptionRows.propTypes = {
  // { [expandKey]: boolean }
  expanded: PropTypes.object,
  // callback to replace whole `expanded` map
  setExpanded: PropTypes.func,
  // { [tool]: { OS, architecture } }
  selections: PropTypes.object,
  // callback to replace whole `selections` map
  setSelections: PropTypes.func,
  // { [tool]: ref } - to allow referring to specific tool rows
  toolRefs: PropTypes.object,
  // either static `installLinks.urls` or result of urlsSelector() with github links.
  urls: PropTypes.object,
  // one of `tools`
  tool: PropTypes.oneOf(Object.values(tools)),
  // one of `channels`
  channel: PropTypes.oneOf(Object.values(channels)),
  // text for Name column
  name: PropTypes.node,
  // content for full-width description cell
  description: PropTypes.node,
};

// TODO: changes in following functions have to be kept in sync with `downloadsCategories`.
//   Can we stop encoding order here, e.g. return mapping from expandKeys to single rows,
//   and use `downloadsCategories` as source of truth for what to show in what order?

const cliToolRows = (expanded, setExpanded, selections, setSelections, toolRefs, urls) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OC}
        channel={channels.STABLE}
        name={
          <>
            OpenShift command-line interface (<code>oc</code>)
          </>
        }
        description={
          <Text>
            Create applications and manage OpenShift projects from the command line using the
            OpenShift client <code>oc</code>.{' '}
            <ExternalLink ExternalLink href={links.CLI_TOOLS_OCP_GETTING_STARTED}>
              Get started
            </ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OCM}
        channel={channels.STABLE}
        name={
          <>
            OpenShift Cluster Manager API command-line interface (<code>ocm</code>){' '}
            <DevPreviewBadge />
          </>
        }
        description={
          <TextContent>
            <Text>
              Manage your OpenShift clusters from the command line using the OpenShift Cluster
              Manager API client <code>ocm</code>.{' '}
              <ExternalLink href={links.OCM_CLI_DOCS}>Get started</ExternalLink>
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.ROSA}
        channel={channels.STABLE}
        name={
          <>
            Red Hat OpenShift Service on AWS command-line interface (<code>rosa</code>)
          </>
        }
        description={
          <Text>
            Manage your Red Hat OpenShift Service on AWS (ROSA) clusters from the command line using
            the ROSA client for OCM and AWS APIs.{' '}
            <ExternalLink href={links.ROSA_CLI_DOCS}>Get started</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.KN}
        channel={channels.STABLE}
        name={
          <>
            Knative command-line interface for OpenShift Serverless (<code>kn</code>)
          </>
        }
        description={
          <Text>
            Interact with Knative components on OpenShift Container Platform with the Knative client
            for OpenShift Serverless <code>kn</code>.{' '}
            <ExternalLink href={links.KN_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.TKN}
        channel={channels.STABLE}
        name={
          <>
            Tekton command-line interface for OpenShift Pipelines (<code>tkn</code>)
          </>
        }
        description={
          <Text>
            Manage and interact with CI pipelines on OpenShift Container Platform with the Tekton
            CLI for OpenShift Pipelines.{' '}
            <ExternalLink href={links.TKN_DOCS}>Get started</ExternalLink>
          </Text>
        }
      />
    </>
  );
};

const devToolRows = (expanded, setExpanded, selections, setSelections, toolRefs, urls) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.ODO}
        channel={channels.STABLE}
        name={
          <>
            Developer-focused CLI for OpenShift (<code>odo</code>)
          </>
        }
        description={
          <Text>
            Write, build, and deploy applications on OpenShift with <code>odo</code>, a fast,
            iterative, and straightforward CLI tool for developers.{' '}
            <ExternalLink href={links.ODO_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.HELM}
        channel={channels.STABLE}
        name={
          <>
            Helm 3 CLI (<code>helm</code>)
          </>
        }
        description={
          <Text>
            Define, install, and upgrade application packages as Helm charts using Helm 3, a package
            manager for Kubernetes. <ExternalLink href={links.HELM_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OPM}
        channel={channels.STABLE}
        name={
          <>
            Operator Package Manager (<code>opm</code>)
          </>
        }
        description={
          <Text>
            Create and maintain catalogs of Operators from a list of bundles with the Operator
            Package Manager. <ExternalLink href={links.OPM_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OPERATOR_SDK}
        channel={channels.STABLE}
        name={
          <>
            Operator SDK CLI (<code>operator-sdk</code>)
          </>
        }
        description={
          <Text>
            Build, test, and deploy Operators with the Operator SDK CLI.{' '}
            <ExternalLink href={links.OSDK_DOCS}>Learn more</ExternalLink>
          </Text>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.RHOAS}
        channel={channels.STABLE}
        name={
          <>
            Red Hat OpenShift Application Services CLI (<code>rhoas</code>) <DevPreviewBadge />
          </>
        }
        description={
          <TextContent>
            <Text>
              Create and manage Kafka instances and topics, service accounts, and more using{' '}
              <code>rhoas</code>.
            </Text>
            <Text>
              <ExternalLink href={links.RHOAS_CLI_DOCS}>Get started</ExternalLink>
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

const installationRows = (expanded, setExpanded, selections, setSelections, toolRefs, urls) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.X86INSTALLER}
        channel={channels.STABLE}
        name="OpenShift for x86_64 Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported x86_64 infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in the <Link to="/create">cloud</Link>, or in your{' '}
              <Link to="/create/datacenter">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.ARMINSTALLER}
        channel={channels.STABLE}
        name="OpenShift for ARM Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported ARM infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in <Link to="/install/aws/arm">AWS</Link>, or in your{' '}
              <Link to="/install/arm">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.IBMZINSTALLER}
        channel={channels.STABLE}
        name="OpenShift for IBM Z Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported IBM Z infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in your{' '}
              <Link to="/install/ibmz/user-provisioned">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.PPCINSTALLER}
        channel={channels.STABLE}
        name="OpenShift for Power Installer"
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported Power infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in your{' '}
              <Link to="/install/power/user-provisioned">data center</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.MULTIINSTALLER}
        channel={channels.STABLE}
        name={
          <>
            OpenShift Installer for heterogeneous clusters{' '}
            <TechnologyPreview position={PreviewBadgePosition.inline} />
          </>
        }
        description={
          <TextContent>
            <Text>
              Download and extract your operating system&apos;s installation program and place the
              file in the directory where you&apos;ll store your configuration details. Then, create
              clusters on supported infrastructure using our{' '}
              <ExternalLink href={links.INSTALL_DOCS_ENTRY}>documentation</ExternalLink> as a guide.
            </Text>
            <Text>
              Learn how to deploy in{' '}
              <Link to="/install/azure/multi/installer-provisioned">Azure</Link>.
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.CRC}
        channel={channels.STABLE}
        name={
          <>
            OpenShift Local (<code>crc</code>)
          </>
        }
        description={
          <TextContent>
            <Text>
              Download and open the OpenShift Local file to automatically start a step-by-step
              installation guide.
            </Text>
            <Text>
              <Link to="/create/local">Create a minimal cluster on your desktop</Link> for local
              development and testing.
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

const disconnectedInstallationRows = (
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.MIRROR_REGISTRY}
        channel={channels.STABLE}
        name="mirror registry for Red Hat OpenShift"
        description={
          <TextContent>
            <Text>
              Download and install a local, minimal single instance deployment of Red Hat Quay to
              aid bootstrapping the first disconnected cluster.{' '}
              <ExternalLink href={links.INSTALL_MIRROR_REGISTRY_LEARN_MORE}>
                Learn more
              </ExternalLink>
            </Text>
          </TextContent>
        }
      />
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.OC_MIRROR_PLUGIN}
        channel={channels.STABLE}
        name="OpenShift Client (oc) mirror plugin"
        description={
          <TextContent>
            <Text>
              The &quot;mirror&quot; plugin for the OpenShift CLI client (oc) controls the process{' '}
              of mirroring all relevant container image for a full disconnected OpenShift{' '}
              installation in a central, declarative tool.{' '}
              <ExternalLink href={links.INSTALL_OC_MIRROR_PLUGIN_LEARN_MORE}>
                Learn more
              </ExternalLink>
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

const customInstallationRows = (
  expanded,
  setExpanded,
  selections,
  setSelections,
  toolRefs,
  urls,
) => {
  const commonProps = {
    expanded,
    setExpanded,
    selections,
    setSelections,
    toolRefs,
    urls,
  };
  return (
    <>
      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.BUTANE}
        channel={channels.STABLE}
        name="Butane config transpiler CLI"
        description={
          <TextContent>
            <Text>
              Write and validate machine configs in a convenient short-hand syntax with the Butane
              config transpiler CLI tool.{' '}
              <ExternalLink href={links.BUTANE_DOCS}>Learn more</ExternalLink>
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.COREOS_INSTALLER}
        channel={channels.STABLE}
        name="CoreOS Installer CLI"
        description={
          <TextContent>
            <Text>
              Download and install RHCOS disk images with the coreos-installer CLI tool.{' '}
              <ExternalLink href={links.COREOS_INSTALLER_DOCS}>Learn more</ExternalLink>
            </Text>
          </TextContent>
        }
      />

      <ToolAndDescriptionRows
        {...commonProps}
        tool={tools.CCOCTL}
        channel={channels.STABLE}
        name={
          <>
            Cloud Credential Operator CLI utility (<code>ccoctl</code>)
          </>
        }
        description={
          <TextContent>
            <Text>
              The ccoctl tool provides various commands to assist with the creating and maintenance
              of cloud credentials from outside the cluster (necessary when Cloud Credential
              Operator is put in Manual mode).{' '}
              <ExternalLink href={links.CCO_MANUAL_MODE}>Learn more</ExternalLink>
            </Text>
          </TextContent>
        }
      />
    </>
  );
};

// TODO: is this useful?
const TokensHeadings = () => (
  <Thead>
    <Tr>
      <Th width={10} />
      <Th width={90} />
      <Th width={10} />
    </Tr>
  </Thead>
);

const tokenRows = (expanded, setExpanded, toolRefs, token) => (
  <>
    <ExpandableRowPair
      expanded={expanded}
      setExpanded={setExpanded}
      toolRefs={toolRefs}
      expandKey={expandKeys.PULL_SECRET}
      cells={[
        <Td>Pull secret</Td>,
        <Td>
          <AlignRight>
            <Split hasGutter>
              <SplitItem>
                <CopyPullSecret token={token} text="Copy" variant="link-inplace" />
              </SplitItem>
              <SplitItem>
                <DownloadPullSecret token={token} text="Download" />
              </SplitItem>
            </Split>
          </AlignRight>
        </Td>,
      ]}
      description={
        <TextContent>
          <Text>
            An image pull secret provides authentication for the cluster to access services and
            registries which serve the container images for OpenShift components. Every individual
            user gets a single pull secret generated. The pull secret can be used when installing
            clusters, based on the required infrastructure.
          </Text>
          <Text>
            Learn how to <Link to="/create">create a cluster</Link> or{' '}
            <ExternalLink href={links.OCM_DOCS_PULL_SECRETS}>
              learn more about pull secrets
            </ExternalLink>
            .
          </Text>
        </TextContent>
      }
    />

    <ExpandableRowPair
      expanded={expanded}
      setExpanded={setExpanded}
      toolRefs={toolRefs}
      expandKey={expandKeys.TOKEN_OCM}
      cells={[
        <Td>OpenShift Cluster Manager API Token</Td>,
        <Td>
          <AlignRight>
            <Link to="/token">
              <Button variant="secondary" icon={<ArrowRightIcon />} iconPosition="right">
                View API token
              </Button>
            </Link>
          </AlignRight>
        </Td>,
      ]}
      description={
        <Text>
          Use your API token to authenticate against your OpenShift Cluster Manager account.
        </Text>
      }
    />
  </>
);

class DownloadsPage extends React.Component {
  static initialExpanded() {
    const initial = {};
    Object.values(expandKeys).forEach((key) => {
      initial[key] = false;
    });
    return initial;
  }

  static makeRefs() {
    const toolRefs = {};
    Object.values(expandKeys).forEach((key) => {
      toolRefs[key] = React.createRef();
    });
    return toolRefs;
  }

  state = {
    selectedCategory: 'ALL', // one of `downloadsCategories` key
    expanded: DownloadsPage.initialExpanded(), // { [tool]: isOpen }
    selections: {}, // { [tool]: {OS, architecture} }
  };

  toolRefs = DownloadsPage.makeRefs(); // { [tool]: ref }

  componentDidMount() {
    document.title = 'Downloads | Red Hat OpenShift Cluster Manager';

    const { getAuthToken, githubReleases, getLatestRelease } = this.props;
    getAuthToken();
    githubReleasesToFetch.forEach((repo) => {
      if (!githubReleases[repo].fulfilled) {
        getLatestRelease(repo);
      }
    });

    this.focusRowByHash();
    window.addEventListener('hashchange', this.focusRowByHash);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.focusRowByHash);
  }

  setCategory = (selectedCategory) => {
    const { expanded } = this.state;
    this.setState({ selectedCategory });
    this.updateURL(selectedCategory, expanded);
  };

  setExpanded = (expanded) => {
    const { selectedCategory } = this.state;
    this.setState({ expanded });
    this.updateURL(selectedCategory, expanded);
  };

  setSelections = (selections) => {
    this.setState({ selections });
  };

  /** "Advertise" link targets by setting #tool-foo URL.
   *
   * Takes new state as params because this.state is unreliable after setState().
   * @param selectedCategory string - current/new category.
   * @param expanded - { key: bool } current/new expanded.
   */
  updateURL = (selectedCategory, expanded) => {
    let lastExpanded = null;
    const shownKeys = downloadsCategories.find((c) => c.key === selectedCategory).tools;
    shownKeys.forEach((key) => {
      if (expanded[key]) {
        lastExpanded = key;
      }
    });

    const hash = lastExpanded ? `#${rowId(lastExpanded)}` : '';
    const { location, history } = this.props;
    if (hash !== location.hash) {
      // pushState/replaceState API never trigger `hashchange` event,
      // avoiding undesired effects like scrolling.
      history.replace({ ...location, hash });
    }
  };

  focusRowByHash = () => {
    const { location } = this.props;
    const hash = location.hash.replace('#', '');
    const key = Object.values(expandKeys).find((k) => rowId(k) === hash);
    if (key) {
      // Expand to draw attention.  setState() directly to bypass updateHash().
      const { expanded } = this.state;
      this.setState({ expanded: { ...expanded, [key]: true } });

      const row = this.toolRefs[key]?.current;
      if (row) {
        row.scrollIntoView({ block: 'start', behavior: 'smooth' });

        // Goal: Bring keyboard focus somewhere in the chosen row.
        // .focus() only works on focusable elements - input, select, button, etc.
        // The row expand toggle happens to be a button.
        const elem = row.querySelector('button, select');
        if (elem) {
          elem.focus({ preventScroll: true }); // don't interfere with smooth scroll.
        }
      }
    }
  };

  render() {
    const { token, githubReleases } = this.props;
    const { selectedCategory, expanded, selections } = this.state;

    const urls = urlsSelector(githubReleases);

    // Expand if at least one collapsed, collapse if all expanded.
    const shownKeys = downloadsCategories.find((c) => c.key === selectedCategory).tools;
    const allExpanded = shownKeys.every((key) => expanded[key]);
    const willExpandAll = !allExpanded;

    const expandCollapseAll = () => {
      this.setExpanded(
        produce(expanded, (draft) => {
          shownKeys.forEach((key) => {
            draft[key] = willExpandAll;
          });
        }),
      );
    };

    return (
      <>
        <PageHeader className="downloads-page-header">
          <Split>
            <SplitItem isFilled>
              <PageHeaderTitle className="ocm-page-title" title="Downloads" />
            </SplitItem>
          </Split>
          <Split className="subheader">
            <SplitItem>
              <DownloadsCategoryDropdown
                selectedCategory={selectedCategory}
                setCategory={this.setCategory}
              />
            </SplitItem>
            <SplitItem>
              <ExpandableSectionToggle
                className="expand-collapse-all"
                isExpanded={!willExpandAll}
                onToggle={expandCollapseAll}
              >
                {willExpandAll ? 'Expand all' : 'Collapse all'}
              </ExpandableSectionToggle>
            </SplitItem>
          </Split>
        </PageHeader>

        <PageSection className="downloads-page-body">
          <PageSection
            variant="light"
            padding={{ default: 'noPadding' }}
            className="downloads-page-body"
          >
            <DownloadsSection
              selectedCategory={selectedCategory}
              category="CLI"
              description={
                <Text>
                  Download command line tools to manage and work with OpenShift from your terminal.
                </Text>
              }
            >
              <TableComposable aria-label="CLI tools table">
                <ColumnHeadings />
                {cliToolRows(
                  expanded,
                  this.setExpanded,
                  selections,
                  this.setSelections,
                  this.toolRefs,
                  urls,
                )}
              </TableComposable>
            </DownloadsSection>

            <DownloadsSection
              selectedCategory={selectedCategory}
              category="DEV"
              description={
                <Text>
                  Access all the powers of Kubernetes through a simplified workflow with Red Hat’s
                  developer tools.{' '}
                  <ExternalLink href="https://developers.redhat.com/topics/developer-tools">
                    Learn more
                  </ExternalLink>
                </Text>
              }
            >
              <TableComposable aria-label="Developer tools table">
                <ColumnHeadings />
                {devToolRows(
                  expanded,
                  this.setExpanded,
                  selections,
                  this.setSelections,
                  this.toolRefs,
                  urls,
                )}
              </TableComposable>
            </DownloadsSection>

            <DownloadsSection
              selectedCategory={selectedCategory}
              category="INSTALLATION"
              description={
                <Text>
                  Install OpenShift based on your infrastructure. For the installer matching your
                  infrastructure type, select the operating system and architecture on which you
                  wish to run the installer. Then follow the steps provided within your
                  infrastructure&apos;s tab on the <Link to="/create">create cluster</Link> page to
                  install an OpenShift cluster.
                </Text>
              }
            >
              <TableComposable aria-label="OpenShift installation table">
                <ColumnHeadings />
                {installationRows(
                  expanded,
                  this.setExpanded,
                  selections,
                  this.setSelections,
                  this.toolRefs,
                  urls,
                )}
              </TableComposable>
            </DownloadsSection>

            <DownloadsSection
              selectedCategory={selectedCategory}
              category="DISCONNECTED_INSTALLATION"
              description={
                <Text>
                  Utilities to simplify preparation of disconnected cluster installations.
                </Text>
              }
            >
              <TableComposable aria-label="OpenShift disconnected installation tools table">
                <ColumnHeadings />
                {disconnectedInstallationRows(
                  expanded,
                  this.setExpanded,
                  selections,
                  this.setSelections,
                  this.toolRefs,
                  urls,
                )}
              </TableComposable>
            </DownloadsSection>

            <DownloadsSection
              selectedCategory={selectedCategory}
              category="CUSTOM_INSTALLATION"
              description={
                <Text>
                  Customize OpenShift and Red Hat Enterprise Linux CoreOS (RHCOS) installation with
                  these tools.
                </Text>
              }
            >
              <TableComposable aria-label="OpenShift installation customization downloads table">
                <ColumnHeadings />
                {customInstallationRows(
                  expanded,
                  this.setExpanded,
                  selections,
                  this.setSelections,
                  this.toolRefs,
                  urls,
                )}
              </TableComposable>
            </DownloadsSection>

            <DownloadsSection category="TOKENS" selectedCategory={selectedCategory}>
              <TableComposable aria-label="Tokens table">
                <TokensHeadings />
                {tokenRows(expanded, this.setExpanded, this.toolRefs, token)}
              </TableComposable>
            </DownloadsSection>
          </PageSection>
        </PageSection>
      </>
    );
  }
}
DownloadsPage.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  token: PropTypes.object.isRequired,
  getAuthToken: PropTypes.func.isRequired,
  githubReleases: PropTypes.object.isRequired,
  getLatestRelease: PropTypes.func.isRequired,
};

export default DownloadsPage;
