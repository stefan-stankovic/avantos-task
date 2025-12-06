import { useFormStateStore } from '@/stores/form-state-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Position } from '@xyflow/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { FlowNodeData } from '../api/types';
import { GraphView } from './graph-view';

vi.mock('@xyflow/react', async () => {
  const actual = await vi.importActual('@xyflow/react');
  return {
    ...actual,
    ReactFlow: ({
      nodes,
      onNodeClick,
    }: {
      nodes: any[];
      onNodeClick: (event: React.MouseEvent, node: any) => void;
    }) => (
      <div data-testid='react-flow'>
        {nodes.map((node) => (
          <div
            key={node.id}
            data-testid={`node-${node.id}`}
            onClick={(e) => onNodeClick(e, node)}
          >
            {node.data.label}
          </div>
        ))}
      </div>
    ),
  };
});

// Mock modals
vi.mock('./form-fields/form-fields-modal', () => ({
  FormFieldsModal: () => <div data-testid='form-fields-modal' />,
}));

vi.mock('./field-mapping/field-mapping-modal', () => ({
  FieldMappingModal: () => <div data-testid='field-mapping-modal' />,
}));

describe('GraphView', () => {
  beforeEach(() => {
    useFormStateStore.setState({
      formStates: {},
      selectedNode: null,
      fieldMappingModal: null,
    });
  });

  it('should render ReactFlow with nodes and edges', () => {
    const nodes = [
      {
        id: 'node-1',
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: 'Test Node',
          type: 'action',
          formId: 'form-1',
          formFields: ['field1'],
          dependencyData: {
            direct: [],
            transitive: [],
          },
        } as FlowNodeData,
      },
    ];

    const edges = [
      {
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2',
      },
    ];

    render(<GraphView nodes={nodes} edges={edges} />);

    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    expect(screen.getByTestId('node-node-1')).toBeInTheDocument();
    expect(screen.getByText('Test Node')).toBeInTheDocument();
  });

  it('should render modals', () => {
    render(<GraphView nodes={[]} edges={[]} />);

    expect(screen.getByTestId('form-fields-modal')).toBeInTheDocument();
    expect(screen.getByTestId('field-mapping-modal')).toBeInTheDocument();
  });

  it('should call openNodeModal when node is clicked', async () => {
    const user = userEvent.setup();
    const nodes = [
      {
        id: 'node-1',
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: 'Test Node',
          type: 'action',
          formId: 'form-1',
          formFields: ['field1', 'field2'],
          dependencyData: {
            direct: [
              {
                id: 'dep-1',
                name: 'Dependency 1',
                formId: 'form-dep',
                formFields: ['depField1'],
              },
            ],
            transitive: [],
          },
        } as FlowNodeData,
      },
    ];

    render(<GraphView nodes={nodes} edges={[]} />);

    const nodeElement = screen.getByTestId('node-node-1');
    await user.click(nodeElement);

    const state = useFormStateStore.getState();
    expect(state.selectedNode).toEqual({
      nodeId: 'node-1',
      formId: 'form-1',
      formName: 'Test Node',
      formFields: ['field1', 'field2'],
      dependencies: {
        direct: [
          {
            id: 'dep-1',
            name: 'Dependency 1',
            formId: 'form-dep',
            formFields: ['depField1'],
          },
        ],
        transitive: [],
      },
    });
  });

  it('should handle multiple nodes', () => {
    const nodes = [
      {
        id: 'node-1',
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: 'Node 1',
          type: 'action',
          formId: 'form-1',
          formFields: [],
          dependencyData: { direct: [], transitive: [] },
        } as FlowNodeData,
      },
      {
        id: 'node-2',
        position: { x: 100, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: 'Node 2',
          type: 'action',
          formId: 'form-2',
          formFields: [],
          dependencyData: { direct: [], transitive: [] },
        } as FlowNodeData,
      },
    ];

    render(<GraphView nodes={nodes} edges={[]} />);

    expect(screen.getByTestId('node-node-1')).toBeInTheDocument();
    expect(screen.getByTestId('node-node-2')).toBeInTheDocument();
    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.getByText('Node 2')).toBeInTheDocument();
  });

  it('should initialize form state when node is clicked for the first time', async () => {
    const user = userEvent.setup();
    const nodes = [
      {
        id: 'node-1',
        position: { x: 0, y: 0 },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        data: {
          label: 'Test Node',
          type: 'action',
          formId: 'form-1',
          formFields: ['field1', 'field2'],
          dependencyData: { direct: [], transitive: [] },
        } as FlowNodeData,
      },
    ];

    render(<GraphView nodes={nodes} edges={[]} />);

    const nodeElement = screen.getByTestId('node-node-1');
    await user.click(nodeElement);

    const state = useFormStateStore.getState();
    const formState = state.formStates['node-1'];

    expect(formState).toBeDefined();
    expect(formState?.formId).toBe('form-1');
    expect(formState?.formName).toBe('Test Node');
    expect(Object.keys(formState?.fields || {})).toEqual(['field1', 'field2']);
  });
});
