import { useFormStateStore } from '@/stores/form-state-store';
import { Edge as FlowEdge, Node as FlowNode, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FlowNodeData } from '../api/types';
import { FieldMappingModal } from './field-mapping/field-mapping-modal';
import { FormFieldsModal } from './form-fields/form-fields-modal';

type Props = {
  nodes: FlowNode<FlowNodeData>[];
  edges: FlowEdge[];
};

export const GraphView = ({ nodes, edges }: Props) => {
  const { openNodeModal } = useFormStateStore();

  const handleNodeClick = (
    _event: React.MouseEvent,
    node: FlowNode<FlowNodeData>
  ) => {
    openNodeModal({
      nodeId: node.id,
      formId: node.data.formId,
      formName: node.data.label,
      formFields: node.data.formFields,
      dependencies: node.data.dependencyData,
    });
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={handleNodeClick}
          fitView
        />
      </div>
      <FormFieldsModal />
      <FieldMappingModal />
    </>
  );
};
