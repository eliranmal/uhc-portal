import React from 'react';
import { useParams } from 'react-router-dom';

import { Navigate } from '~/common/routing';
import LoadingPage from '~/components/App/LoadingPage';
import NotFoundError from '~/components/App/NotFoundError';
import { useFetchAccessRequest } from '~/queries/ClusterDetailsQueries/AccessRequestTab/useFetchAccessRequest';

const AccessRequestNavigate = () => {
  const { id: accessRequestId } = useParams<{ id: string }>();

  const {
    data: accessRequest,
    isLoading: isAccessRequestLoading,
    isError: isAccessRequestError,
  } = useFetchAccessRequest(accessRequestId!!);

  if (isAccessRequestError) {
    return <NotFoundError />;
  }

  return isAccessRequestLoading || !accessRequest?.subscription_id ? (
    <LoadingPage />
  ) : (
    <Navigate replace to={`/details/s/${accessRequest.subscription_id}#accessRequest`} />
  );
};

export default AccessRequestNavigate;
