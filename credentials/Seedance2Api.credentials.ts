import {
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class Seedance2Api implements ICredentialType {
  name = 'seedance2Api';
  displayName = 'Seedance 2.0 API';
  documentationUrl = 'https://muapi.ai';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
    },
  ];
}
