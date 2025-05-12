import config from '~/config';
import apiRequest from '~/services/apiRequest';

const createIncident = (
  checks: {
    isUSPerson: boolean;
    authPerson: boolean;
    govContract: boolean;
    rulesOfBehavior: boolean;
  },
  contractID?: string,
  file?: File,
) =>
  apiRequest.postForm(
    '/fedramp-customer-interest/incident',
    {
      file,
      contractID,
      acknowledgement: JSON.stringify(checks),
    },
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: config.configData.fedrampGateway,
    },
  );

const fedrampService = {
  createIncident,
};

export default fedrampService;
