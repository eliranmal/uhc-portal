// return the transfer details

import React from 'react';

import { TextContent, TextList, TextListItem } from '@patternfly/react-core';

import { ClusterTransfer } from '~/types/accounts_mgmt.v1';

export function TransferDetails({ transfer }: { transfer: ClusterTransfer }) {
  return (
    <TextContent>
      <TextList component="dl">
        <TextListItem component="dt">Requested date</TextListItem>
        <TextListItem component="dd">
          {new Date(transfer?.created_at || '').toLocaleString()}
        </TextListItem>
        <TextListItem component="dt">Requested by</TextListItem>
        <TextListItem component="dd">{transfer.owner}</TextListItem>
        <TextListItem component="dt">Transfer to</TextListItem>
        <TextListItem component="dd">{transfer.recipient}</TextListItem>
        <TextListItem component="dt">Status</TextListItem>
        <TextListItem component="dd">{transfer.status}</TextListItem>
        <TextListItem component="dt">Status Description</TextListItem>
        <TextListItem component="dd">{transfer.status_description}</TextListItem>
      </TextList>
    </TextContent>
  );
}
