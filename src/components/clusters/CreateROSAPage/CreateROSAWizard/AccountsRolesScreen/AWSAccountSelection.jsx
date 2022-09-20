// a redux-form Field-compatible component for selecting an associated AWS account id

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Select,
  SelectOption,
  FormGroup,
  Title,
  EmptyStateBody,
  EmptyState,
  Tooltip,
} from '@patternfly/react-core';
import useAnalytics from '~/hooks/useAnalytics';
import { trackEvents } from '~/common/analytics';
import PopoverHint from '../../../../common/PopoverHint';
import './AccountsRolesScreen.scss';

const AWS_ACCT_ID_PLACEHOLDER = 'Select an account';

function NoAssociatedAWSAccounts() {
  return (
    <EmptyState className="no-associated-aws-accounts_empty-state">
      <Title headingLevel="h6" size="md" data-test-id="no_associated_accounts">
        No associated accounts were found.
      </Title>
      <EmptyStateBody>Associate an AWS account to your Red Hat account.</EmptyStateBody>
    </EmptyState>
  );
}

function AWSAccountSelection({
  input: {
    // Redux Form's onBlur interferes with Patternfly's Select footer onClick handlers.
    onBlur: _onBlur,
    ...inputProps
  },
  isDisabled,
  isLoading,
  label,
  meta: { error, touched },
  extendedHelpText,
  selectedAWSAccountID,
  AWSAccountIDs,
  launchAssocAWSAcctModal,
  onRefresh,
}) {
  const track = useAnalytics();
  const [isOpen, setIsOpen] = useState(false);
  const associateAWSAccountBtnRef = React.createRef();
  const hasAWSAccounts = AWSAccountIDs.length > 0;

  useEffect(() => {
    // only scroll to associateAWSAccountBtn when no AWS accounts
    if (isOpen === true && !hasAWSAccounts) {
      associateAWSAccountBtnRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, hasAWSAccounts]);

  const onToggle = (toogleOpenValue) => {
    setIsOpen(toogleOpenValue);
  };

  const onSelect = (_, selection) => {
    setIsOpen(false);
    inputProps.onChange(selection);
  };

  const launchModal = () => {
    // close dropdown
    setIsOpen(false);
    // will cause window reload on first time, then open assoc aws modal with new token
    launchAssocAWSAcctModal();
  };

  const footer = (
    <>
      {!hasAWSAccounts && <NoAssociatedAWSAccounts />}
      <Button
        ref={associateAWSAccountBtnRef}
        data-test-id="launch-associate-account-btn"
        variant="secondary"
        onClick={(event) => {
          track(trackEvents.AssociateAWS);
          launchModal(event);
        }}
      >
        Associate a new AWS account
      </Button>
    </>
  );

  return (
    <FormGroup
      label={label}
      labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
      className="aws-account-selection"
      validated={error ? 'error' : undefined}
      helperTextInvalid={touched && error}
      isRequired
    >
      <Select
        {...inputProps}
        label={label}
        labelIcon={extendedHelpText && <PopoverHint hint={extendedHelpText} />}
        isOpen={isOpen}
        selections={hasAWSAccounts ? selectedAWSAccountID : ''}
        onToggle={onToggle}
        onSelect={onSelect}
        isDisabled={isDisabled}
        placeholderText={AWS_ACCT_ID_PLACEHOLDER}
        footer={footer}
      >
        {AWSAccountIDs.map((awsId) => (
          <SelectOption
            className="pf-c-dropdown__menu-item"
            key={awsId}
            value={awsId}
          >{`${awsId}`}</SelectOption>
        ))}
      </Select>
      {onRefresh && (
        <Tooltip content={<p>Click icon to refresh associated aws accounts and account-roles.</p>}>
          <Button
            isLoading={isLoading}
            isDisabled={isDisabled}
            isInline
            isSmall
            variant="secondary"
            onClick={() => {
              onRefresh();
            }}
          >
            Refresh
          </Button>
        </Tooltip>
      )}
    </FormGroup>
  );
}

AWSAccountSelection.propTypes = {
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  input: PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  }),
  extendedHelpText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  AWSAccountIDs: PropTypes.arrayOf(PropTypes.string),
  selectedAWSAccountID: PropTypes.string,
  launchAssocAWSAcctModal: PropTypes.func.isRequired,
  initialValue: PropTypes.string,
  meta: PropTypes.shape({
    touched: PropTypes.bool,
    error: PropTypes.string,
  }),
  onRefresh: PropTypes.func,
};

export { AWS_ACCT_ID_PLACEHOLDER };

export default AWSAccountSelection;
