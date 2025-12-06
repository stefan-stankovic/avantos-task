import { MarkerType, Position } from '@xyflow/react';
import { describe, expect, it } from 'vitest';
import { mapActionGraph } from './mapper';
import { ActionGraph } from './types';

describe('mapActionGraph', () => {
  it('should map simple graph with no dependencies', () => {
    const graph: ActionGraph = {
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
              field2: { type: 'number' },
            },
          },
          ui_schema: {},
          dynamic_field_config: {},
        },
      ],
    };

    const result = mapActionGraph(graph);

    expect(result.nodes).toHaveLength(1);
    expect(result.nodes[0]).toEqual({
      id: 'node-1',
      position: { x: 0, y: 0 },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        label: 'Node 1',
        type: 'action',
        formId: 'form-1',
        formFields: ['field1', 'field2'],
        dependencyData: {
          direct: [],
          transitive: [],
        },
      },
    });
    expect(result.edges).toHaveLength(0);
    expect(result.forms).toEqual(graph.forms);
  });

  it('should map graph with direct dependencies', () => {
    const graph: ActionGraph = {
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
        {
          id: 'node-2',
          type: 'action',
          position: { x: 100, y: 0 },
          data: {
            id: 'node-2',
            component_key: 'key-2',
            component_type: 'form',
            component_id: 'form-2',
            name: 'Node 2',
            prerequisites: ['node-1'],
            sla_duration: { number: 1, unit: 'day' },
            approval_required: false,
          },
        },
      ],
      edges: [{ source: 'node-1', target: 'node-2' }],
      forms: [
        {
          id: 'form-1',
          name: 'Form 1',
          description: 'Test form',
          is_reusable: false,
          field_schema: {
            properties: {
              name: { type: 'string' },
              email: { type: 'string' },
            },
          },
          ui_schema: {},
          dynamic_field_config: {},
        },
        {
          id: 'form-2',
          name: 'Form 2',
          description: 'Test form 2',
          is_reusable: false,
          field_schema: {
            properties: {
              address: { type: 'string' },
            },
          },
          ui_schema: {},
          dynamic_field_config: {},
        },
      ],
    };

    const result = mapActionGraph(graph);

    expect(result.nodes).toHaveLength(2);

    // Node 1 should have no dependencies
    expect(result.nodes[0].data.dependencyData.direct).toHaveLength(0);
    expect(result.nodes[0].data.dependencyData.transitive).toHaveLength(0);

    // Node 2 should have node-1 as direct dependency
    expect(result.nodes[1].data.dependencyData.direct).toHaveLength(1);
    expect(result.nodes[1].data.dependencyData.direct[0]).toEqual({
      id: 'node-1',
      name: 'Node 1',
      formId: 'form-1',
      formFields: ['name', 'email'],
    });
    expect(result.nodes[1].data.dependencyData.transitive).toHaveLength(0);

    // Check edges
    expect(result.edges).toHaveLength(1);
    expect(result.edges[0]).toEqual({
      id: 'node-1-node-2-0',
      source: 'node-1',
      target: 'node-2',
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    });
  });

  it('should map graph with transitive dependencies', () => {
    const graph: ActionGraph = {
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
        {
          id: 'node-2',
          type: 'action',
          position: { x: 100, y: 0 },
          data: {
            id: 'node-2',
            component_key: 'key-2',
            component_type: 'form',
            component_id: 'form-2',
            name: 'Node 2',
            prerequisites: ['node-1'],
            sla_duration: { number: 1, unit: 'day' },
            approval_required: false,
          },
        },
        {
          id: 'node-3',
          type: 'action',
          position: { x: 200, y: 0 },
          data: {
            id: 'node-3',
            component_key: 'key-3',
            component_type: 'form',
            component_id: 'form-3',
            name: 'Node 3',
            prerequisites: ['node-2'],
            sla_duration: { number: 1, unit: 'day' },
            approval_required: false,
          },
        },
      ],
      edges: [
        { source: 'node-1', target: 'node-2' },
        { source: 'node-2', target: 'node-3' },
      ],
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
        {
          id: 'form-2',
          name: 'Form 2',
          description: 'Test form 2',
          is_reusable: false,
          field_schema: {
            properties: {
              field2: { type: 'string' },
            },
          },
          ui_schema: {},
          dynamic_field_config: {},
        },
        {
          id: 'form-3',
          name: 'Form 3',
          description: 'Test form 3',
          is_reusable: false,
          field_schema: {
            properties: {
              field3: { type: 'string' },
            },
          },
          ui_schema: {},
          dynamic_field_config: {},
        },
      ],
    };

    const result = mapActionGraph(graph);

    // Node 3 should have node-2 as direct and node-1 as transitive dependency
    const node3 = result.nodes.find((n) => n.id === 'node-3');
    expect(node3?.data.dependencyData.direct).toHaveLength(1);
    expect(node3?.data.dependencyData.direct[0].id).toBe('node-2');

    expect(node3?.data.dependencyData.transitive).toHaveLength(1);
    expect(node3?.data.dependencyData.transitive[0]).toEqual({
      id: 'node-1',
      name: 'Node 1',
      formId: 'form-1',
      formFields: ['field1'],
    });
  });

  it('should handle form without field_schema', () => {
    const graph: ActionGraph = {
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
          field_schema: {},
          ui_schema: {},
          dynamic_field_config: {},
        },
      ],
    };

    const result = mapActionGraph(graph);

    expect(result.nodes[0].data.formFields).toEqual([]);
  });

  it('should handle multiple edges between same nodes', () => {
    const graph: ActionGraph = {
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
        {
          id: 'node-2',
          type: 'action',
          position: { x: 100, y: 0 },
          data: {
            id: 'node-2',
            component_key: 'key-2',
            component_type: 'form',
            component_id: 'form-2',
            name: 'Node 2',
            prerequisites: [],
            sla_duration: { number: 1, unit: 'day' },
            approval_required: false,
          },
        },
      ],
      edges: [
        { source: 'node-1', target: 'node-2' },
        { source: 'node-1', target: 'node-2' },
      ],
      forms: [],
    };

    const result = mapActionGraph(graph);

    expect(result.edges).toHaveLength(2);
    expect(result.edges[0].id).toBe('node-1-node-2-0');
    expect(result.edges[1].id).toBe('node-1-node-2-1');
  });
});
