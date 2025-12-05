export interface ActionGraph {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: ActionNode[];
  edges: ActionEdge[];
  forms: ActionForm[];
}

export interface ActionNode {
  id: string;
  type: string;
  position: Point;
  data: NodeData;
}

export interface NodeData {
  id: string;
  component_key: string;
  component_type: string;
  component_id: string;
  name: string;
  prerequisites: string[];
  sla_duration: SLADuration;
  approval_required: boolean;
}

export interface ActionEdge {
  source: string;
  target: string;
}

export interface ActionForm {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: Record<string, unknown>;
  ui_schema: Record<string, unknown>;
  dynamic_field_config: Record<string, unknown>;
}

interface Point {
  x: number;
  y: number;
}

interface SLADuration {
  number: number;
  unit: string;
}

export interface Dependency {
  id: string;
  name: string;
  formId: string;
  formFields: string[];
}
