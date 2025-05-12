import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { Card, CardBody, CardTitle } from '@patternfly/react-core';
import { SortByDirection } from '@patternfly/react-table';

import links from '~/common/installLinks.mjs';
import ExternalLink from '~/components/common/ExternalLink';
import ConnectedModal from '~/components/common/Modal/ConnectedModal';
import { modalActions } from '~/components/common/Modal/ModalActions';
import modals from '~/components/common/Modal/modals';
import {
  refetchAccessRequests,
  useFetchAccessRequests,
} from '~/queries/ClusterDetailsQueries/AccessRequestTab/useFetchAccessRequests';
import { viewActions } from '~/redux/actions/viewOptionsActions';
import { viewConstants } from '~/redux/constants';
import { useGlobalState } from '~/redux/hooks';
import { AccessRequest as AccessRequestModel } from '~/types/access_transparency.v1';
import { ViewSorting } from '~/types/types';

import AccessRequestModalForm from './components/AccessRequestModalForm';
import AccessRequestTable from './components/AccessRequestTable';
import AccessRequestTablePagination from './components/AccessRequestTablePagination';

import './AccessRequest.scss';

type AccessRequestProps = {
  subscriptionId?: string;
};

const AccessRequest = ({ subscriptionId }: AccessRequestProps) => {
  const dispatch = useDispatch();
  const viewType = viewConstants.ACCESS_REQUESTS_VIEW;
  const viewOptions = useGlobalState((state) => state.viewOptions[viewType]);

  const { data: accessRequests, isLoading: isAccessRequestsLoading } = useFetchAccessRequests(
    subscriptionId!!,
    viewOptions,
    false,
    { enabled: true },
  );

  const isPending = useMemo(() => isAccessRequestsLoading, [isAccessRequestsLoading]);
  const isPendingNoData = useMemo(
    () => isPending || !accessRequests?.items?.length,
    [isPending, accessRequests],
  );
  const sortBy = useMemo(
    () => ({
      index: viewOptions.sorting.sortIndex,
      direction: viewOptions.sorting.isAscending ? SortByDirection.asc : SortByDirection.desc,
    }),
    [viewOptions],
  );

  const setSorting = useCallback(
    (sorting: ViewSorting) => dispatch(viewActions.onListSortBy(sorting, viewType)),
    [dispatch, viewType],
  );

  const openAccessRequest = useCallback(
    (accessRequestElement?: AccessRequestModel) =>
      dispatch(
        modalActions.openModal(modals.ACCESS_REQUEST_DETAILS, {
          accessRequest: accessRequestElement,
          onClose: () => {
            refetchAccessRequests();
          },
        }),
      ),
    [dispatch],
  );

  return (
    <>
      <Card className="ocm-c-access-request__card">
        <CardTitle className="ocm-c-access-request__card--header">Access Requests</CardTitle>
        <CardBody className="ocm-c-access-request__card--body">
          <div className="access-request-subtitle">
            Access requests to customer data on Red Hat OpenShift Service on AWS clusters and the
            corresponding cloud accounts can be created by SRE either in response to a
            customer-initiated support ticket or in response to alerts received by SRE, as part of
            the standard incident response process.
          </div>
          <ExternalLink href={links.ACCESS_REQUEST_DOC_LINK}>
            Read more about Access Requests functionality
          </ExternalLink>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <AccessRequestTablePagination
            viewType={viewType}
            viewOptions={viewOptions}
            variant="top"
            isDisabled={isPendingNoData}
          />

          <AccessRequestTable
            accessRequestItems={accessRequests?.items}
            setSorting={setSorting}
            openDetailsAction={openAccessRequest}
            sortBy={sortBy}
            isPending={isPending}
          />
          <AccessRequestTablePagination
            viewType={viewType}
            viewOptions={viewOptions}
            variant="bottom"
            isDisabled={isPendingNoData}
          />
        </CardBody>
      </Card>
      <ConnectedModal ModalComponent={AccessRequestModalForm} />
    </>
  );
};

export default AccessRequest;
