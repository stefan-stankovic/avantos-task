import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { actionGraphApiRoutes } from './api-routes';
import { mapActionGraph } from './mapper';
import { ActionGraph } from './types';

type GetActionGraphParams = {
  tenantId: string;
  blueprintId: string;
};

const getActionGraph = async ({
  tenantId,
  blueprintId,
}: GetActionGraphParams) => {
  const response = await apiClient.get<ActionGraph>(
    actionGraphApiRoutes.byTenantIdAndBlueprintId({ tenantId, blueprintId })
  );
  return response.data;
};

export const useGetActionGraphQuery = (
  params: GetActionGraphParams,
  options?: UseQueryOptions<any>
) => {
  return useQuery({
    queryKey: ['actionGraph', params.tenantId, params.blueprintId],
    queryFn: () => getActionGraph(params),
    select: mapActionGraph,
    ...options,
  });
};
