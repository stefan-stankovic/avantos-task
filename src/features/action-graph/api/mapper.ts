import {
  Edge as FlowEdge,
  Node as FlowNode,
  MarkerType,
  Position,
} from '@xyflow/react';

import { ActionGraph, Dependency, FlowNodeData } from './types';

const getFormFields = (graph: ActionGraph, formId: string): string[] => {
  const form = graph.forms.find((f) => f.id === formId);
  if (!form?.field_schema?.properties) return [];
  return Object.keys(form.field_schema.properties);
};

const getDirectDependencies = (
  graph: ActionGraph,
  nodeId: string
): Dependency[] => {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const node = nodeMap.get(nodeId);
  if (!node) return [];

  return (node.data.prerequisites || []).reduce<Dependency[]>((acc, depId) => {
    const depNode = nodeMap.get(depId);
    if (!depNode) return acc;

    acc.push({
      id: depId,
      name: depNode.data.name,
      formId: depNode.data.component_id,
      formFields: getFormFields(graph, depNode.data.component_id),
    });

    return acc;
  }, []);
};

const getTransitiveDependencies = (
  graph: ActionGraph,
  nodeId: string
): Dependency[] => {
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const startNode = nodeMap.get(nodeId);
  if (!startNode) return [];

  const directIds = new Set(startNode.data.prerequisites || []);
  const visited = new Set<string>();
  const stack = [...directIds];
  const transitiveDeps: Dependency[] = [];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (visited.has(currentId)) continue;
    visited.add(currentId);

    const currentNode = nodeMap.get(currentId);
    if (!currentNode) continue;

    if (!directIds.has(currentNode.id)) {
      const formId = currentNode.data.component_id;
      const formFields = getFormFields(graph, formId);

      transitiveDeps.push({
        id: currentNode.id,
        name: currentNode.data.name,
        formId,
        formFields,
      });
    }

    const prereqs = currentNode.data.prerequisites || [];
    for (const prereq of prereqs) {
      if (!visited.has(prereq)) {
        stack.push(prereq);
      }
    }
  }

  return transitiveDeps;
};

const mapNodes = (graph: ActionGraph): FlowNode<FlowNodeData>[] => {
  return graph.nodes.map((node) => {
    const formFields = getFormFields(graph, node.data.component_id);
    const directDeps = getDirectDependencies(graph, node.id);
    const transitiveDeps = getTransitiveDependencies(graph, node.id);

    return {
      id: node.id,
      position: node.position,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: node.data.name,
        type: node.type,
        formId: node.data.component_id,
        formFields,
        dependencyData: {
          direct: directDeps,
          transitive: transitiveDeps,
        },
      },
    };
  });
};

const mapEdges = (graph: ActionGraph): FlowEdge[] => {
  return graph.edges.map((edge, index) => ({
    id: `${edge.source}-${edge.target}-${index}`,
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
    ...edge,
  }));
};

export type MappedActionGraph = {
  nodes: FlowNode<FlowNodeData>[];
  edges: FlowEdge[];
  forms: ActionGraph['forms'];
};

export const mapActionGraph = (graph: ActionGraph): MappedActionGraph => {
  return {
    nodes: mapNodes(graph),
    edges: mapEdges(graph),
    forms: graph.forms,
  };
};
