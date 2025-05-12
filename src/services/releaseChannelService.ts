import axios from 'axios';

import { Graph } from '~/types/upgrades_info.v1';

import config from '../config';

const getOCPReleaseChannel = (channel: string) =>
  axios.get<Graph>('/api/upgrades_info/v1/graph', {
    baseURL: config.configData.apiGateway,
    headers: {
      Accept: 'application/json',
    },
    params: {
      channel,
      arch: 'amd64',
    },
  });

export default getOCPReleaseChannel;
