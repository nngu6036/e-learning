import { EnvConfig } from './env-config.interface';

const BaseConfig: EnvConfig = {
  CLOUD_ENDPOINT: 'http://localhost:5000',
  CONFERENCE_ENDPOINT: 'http://localhost:4444',
  SOCKET_ENDPOINT: 'http://localhost:3000',
};

export = BaseConfig;
