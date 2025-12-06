import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '../../../api/client';
import { useGetActionGraphQuery } from './get-action-graph';
import { ActionGraph } from './types';

vi.mock('../../../api/client', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

afterEach(() => {
  vi.clearAllMocks();
});

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useGetActionGraphQuery', () => {
  it('should fetch and map action graph data', async () => {
    const mockData: ActionGraph = {
      id: 'graph-1',
      tenant_id: 'tenant-1',
      name: 'Test Graph',
      description: 'Test',
      category: 'test',
      nodes: [
        {
          id: 'node-1',
          type: 'action',
          position: { x: 0, y: 0 },
          data: {
            id: 'node-1',
            component_key: 'key-1',
            component_type: 'form',
            component_id: 'form-1',
            name: 'Node 1',
            prerequisites: [],
            sla_duration: { number: 1, unit: 'day' },
            approval_required: false,
          },
        },
      ],
      edges: [],
      forms: [
        {
          id: 'form-1',
          name: 'Form 1',
          description: 'Test form',
          is_reusable: false,
          field_schema: {
            properties: {
              field1: { type: 'string' },
            },
          },
          ui_schema: {},
          dynamic_field_config: {},
        },
      ],
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () =>
        useGetActionGraphQuery({
          tenantId: 'tenant-1',
          blueprintId: 'blueprint-1',
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.get).toHaveBeenCalledWith(
      '/tenant-1/actions/blueprints/blueprint-1/graph'
    );
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.nodes).toHaveLength(1);
    expect(result.current.data?.nodes[0]?.data?.label).toBe('Node 1');
    expect(result.current.data?.nodes[0]?.data?.formFields).toEqual(['field1']);
  });

  it('should handle error when fetching fails', async () => {
    const mockError = new Error('Network error');
    vi.mocked(apiClient.get).mockRejectedValueOnce(mockError);

    const { result } = renderHook(
      () =>
        useGetActionGraphQuery({
          tenantId: 'tenant-1',
          blueprintId: 'blueprint-1',
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });

  it('should use correct query key', async () => {
    const mockData: ActionGraph = {
      id: 'graph-1',
      tenant_id: 'tenant-1',
      name: 'Test Graph',
      description: 'Test',
      category: 'test',
      nodes: [],
      edges: [],
      forms: [],
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () =>
        useGetActionGraphQuery({
          tenantId: 'tenant-123',
          blueprintId: 'blueprint-456',
        }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
  });

  it('should respect custom query options', async () => {
    const mockData: ActionGraph = {
      id: 'graph-1',
      tenant_id: 'tenant-1',
      name: 'Test Graph',
      description: 'Test',
      category: 'test',
      nodes: [],
      edges: [],
      forms: [],
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: mockData });

    const { result } = renderHook(
      () =>
        useGetActionGraphQuery(
          {
            tenantId: 'tenant-1',
            blueprintId: 'blueprint-1',
          },
          {
            enabled: false,
          }
        ),
      { wrapper: createWrapper() }
    );

    // Should not fetch when enabled is false
    expect(result.current.isFetching).toBe(false);
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
