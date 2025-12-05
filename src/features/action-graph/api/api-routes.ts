export const actionGraphApiRoutes = {
  byTenantIdAndBlueprintId: ({
    tenantId,
    blueprintId,
  }: {
    tenantId: string;
    blueprintId: string;
  }) => `/${tenantId}/actions/blueprints/${blueprintId}/graph`,
};
