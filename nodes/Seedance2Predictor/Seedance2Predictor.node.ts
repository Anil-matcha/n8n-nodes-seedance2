import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';

import { submitTask, pollForResult, MODEL_REGISTRY } from '../../utils/MuapiClient';

function buildPayload(
  ctx: IExecuteFunctions,
  category: string,
  model: string,
  itemIndex: number,
): Record<string, unknown> {
  const get = (name: string) => ctx.getNodeParameter(name, itemIndex);

  if (category === 'textToVideo') {
    return {
      prompt: get('t2v_prompt'),
      aspect_ratio: get('t2v_aspect_ratio'),
    };
  }

  if (category === 'imageToVideo') {
    return {
      prompt: get('i2v_prompt'),
      image_url: get('i2v_image_url'),
      aspect_ratio: get('i2v_aspect_ratio'),
    };
  }

  if (category === 'videoEdit') {
    if (model === 'seedance-v2.0-extend') {
      return {
        request_id: get('extend_request_id'),
        prompt: get('extend_prompt'),
      };
    }
    if (model === 'seedance-2.0-watermark-remover') {
      return {
        video_url: get('watermark_video_url'),
      };
    }
  }

  return {};
}

export class Seedance2Predictor implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Seedance 2.0',
    name: 'seedance2Predictor',
    icon: 'file:muapi-logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["model"] || "Seedance 2.0"}}',
    description: 'Create high-quality AI videos with ByteDance Seedance 2.0',
    defaults: {
      name: 'Seedance 2.0',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'seedance2Api',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Category',
        name: 'category',
        type: 'options',
        noDataExpression: true,
        options: [
          { value: 'textToVideo', name: 'Text to Video' },
          { value: 'imageToVideo', name: 'Image to Video' },
          { value: 'videoEdit', name: 'Video Edit / Tools' },
        ],
        default: 'textToVideo',
      },
      {
        displayName: 'Model',
        name: 'model',
        type: 'options',
        typeOptions: {
          loadOptionsDependsOn: ['category'],
          loadOptionsMethod: 'getModelsForCategory',
        },
        default: '',
        required: true,
      },

      // T2V
      {
        displayName: 'Prompt',
        name: 't2v_prompt',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: { show: { category: ['textToVideo'] } },
      },
      {
        displayName: 'Aspect Ratio',
        name: 't2v_aspect_ratio',
        type: 'options',
        options: [
          { value: '16:9', name: '16:9 (Landscape)' },
          { value: '9:16', name: '9:16 (Portrait)' },
          { value: '1:1', name: '1:1 (Square)' },
        ],
        default: '16:9',
        displayOptions: { show: { category: ['textToVideo'] } },
      },

      // I2V
      {
        displayName: 'Prompt',
        name: 'i2v_prompt',
        type: 'string',
        typeOptions: { rows: 4 },
        default: '',
        required: true,
        displayOptions: { show: { category: ['imageToVideo'] } },
      },
      {
        displayName: 'Image URL',
        name: 'i2v_image_url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { category: ['imageToVideo'] } },
      },
      {
        displayName: 'Aspect Ratio',
        name: 'i2v_aspect_ratio',
        type: 'options',
        options: [
          { value: '16:9', name: '16:9 (Landscape)' },
          { value: '9:16', name: '9:16 (Portrait)' },
          { value: '1:1', name: '1:1 (Square)' },
        ],
        default: '16:9',
        displayOptions: { show: { category: ['imageToVideo'] } },
      },

      // Video Edit
      {
        displayName: 'Original Request ID',
        name: 'extend_request_id',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { model: ['seedance-v2.0-extend'] } },
      },
      {
        displayName: 'Extension Prompt',
        name: 'extend_prompt',
        type: 'string',
        default: '',
        displayOptions: { show: { model: ['seedance-v2.0-extend'] } },
      },
      {
        displayName: 'Video URL',
        name: 'watermark_video_url',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { model: ['seedance-2.0-watermark-remover'] } },
      },

      {
        displayName: 'Options',
        name: 'options',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        options: [
          {
            displayName: 'Max Wait Time (seconds)',
            name: 'maxWaitSeconds',
            type: 'number',
            default: 600,
          },
          {
            displayName: 'Poll Interval (seconds)',
            name: 'pollIntervalSeconds',
            type: 'number',
            default: 3,
          },
        ],
      },
    ],
  };

  methods = {
    loadOptions: {
      async getModelsForCategory(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        const category = this.getCurrentNodeParameter('category') as string;
        const models = MODEL_REGISTRY[category] ?? [];
        return models.map((m) => ({ value: m.value, name: m.name, description: m.description }));
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const credentials = await this.getCredentials('seedance2Api');
    const apiKey = credentials.apiKey as string;
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const category = this.getNodeParameter('category', i) as string;
      const model = this.getNodeParameter('model', i) as string;
      const options = this.getNodeParameter('options', i) as { maxWaitSeconds?: number; pollIntervalSeconds?: number };

      const maxWaitMs = (options.maxWaitSeconds ?? 600) * 1000;
      const pollIntervalMs = (options.pollIntervalSeconds ?? 3) * 1000;

      const modelDef = (MODEL_REGISTRY[category] ?? []).find((m) => m.value === model);
      if (!modelDef) throw new NodeOperationError(this.getNode(), `Unknown model "${model}"`);

      const payload = buildPayload(this, category, model, i);

      try {
        const submitResponse = await submitTask(modelDef.endpoint, payload, apiKey);
        const result = await pollForResult(submitResponse.request_id, apiKey, { maxWaitMs, pollIntervalMs });
        returnData.push({ json: { ...result, model, category } });
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message, model, category }, pairedItem: i });
        } else {
          throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
        }
      }
    }
    return [returnData];
  }
}
