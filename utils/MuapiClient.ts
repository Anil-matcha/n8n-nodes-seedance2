import axios, { AxiosInstance, AxiosResponse } from 'axios';

const BASE_URL = 'https://api.muapi.ai/api/v1';

export interface PollOptions {
  maxWaitMs?: number;
  pollIntervalMs?: number;
}

export interface TaskResult {
  request_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  outputs?: unknown[];
  error?: string;
  [key: string]: unknown;
}

export interface SubmitResponse {
  request_id: string;
  [key: string]: unknown;
}

function createClient(apiKey: string): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    timeout: 60_000,
  });
}

export async function submitTask(
  endpoint: string,
  params: Record<string, unknown>,
  apiKey: string,
): Promise<SubmitResponse> {
  const client = createClient(apiKey);
  const response: AxiosResponse<SubmitResponse> = await client.post(`/${endpoint}`, params);
  return response.data;
}

export async function getTaskResult(
  requestId: string,
  apiKey: string,
): Promise<TaskResult> {
  const client = createClient(apiKey);
  const response: AxiosResponse<TaskResult> = await client.get(
    `/predictions/${requestId}/result`,
  );
  return response.data;
}

export async function pollForResult(
  requestId: string,
  apiKey: string,
  options: PollOptions = {},
): Promise<TaskResult> {
  const maxWaitMs = options.maxWaitMs ?? 600_000; // 10 minutes
  const pollIntervalMs = options.pollIntervalMs ?? 3_000; // 3 seconds

  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const result = await getTaskResult(requestId, apiKey);

    if (result.status === 'completed') {
      return result;
    }

    if (result.status === 'failed') {
      throw new Error(`Task ${requestId} failed: ${result.error ?? 'Unknown error'}`);
    }

    // Still pending/processing — wait before next poll
    await new Promise<void>((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error(
    `Task ${requestId} did not complete within ${maxWaitMs / 1000}s timeout`,
  );
}

// ─── Model registry ──────────────────────────────────────────────────────────

export interface ModelDefinition {
  value: string;
  name: string;
  endpoint: string;
  description: string;
}

export const MODEL_REGISTRY: Record<string, ModelDefinition[]> = {
  textToVideo: [
    { value: 'seedance-v2.0-t2v', name: 'Seedance 2.0 (T2V)', endpoint: 'seedance-v2.0-t2v', description: 'Seedance 2.0 text-to-video' },
    { value: 'seedance-2.0-new-t2v', name: 'Seedance 2.0 New (T2V)', endpoint: 'seedance-2.0-new-t2v', description: 'Seedance 2.0 New text-to-video' },
  ],
  imageToVideo: [
    { value: 'seedance-v2.0-i2v', name: 'Seedance 2.0 (I2V)', endpoint: 'seedance-v2.0-i2v', description: 'Seedance 2.0 image-to-video' },
    { value: 'seedance-2.0-new-omni', name: 'Seedance 2.0 New Omni', endpoint: 'seedance-2.0-new-omni', description: 'Seedance 2.0 New Omni image-to-video' },
    { value: 'seedance-2.0-new-first-last', name: 'Seedance 2.0 New First & Last', endpoint: 'seedance-2.0-new-first-last', description: 'Seedance 2.0 New First & Last image-to-video' },
  ],
  videoEdit: [
    { value: 'seedance-v2.0-extend', name: 'Seedance 2.0 Extend', endpoint: 'seedance-v2.0-extend', description: 'Extend Seedance 2.0 generated video' },
    { value: 'seedance-2.0-watermark-remover', name: 'Seedance 2.0 Watermark Remover', endpoint: 'seedance-2.0-watermark-remover', description: 'Remove Seedance 2.0 watermarks' },
  ],
};
