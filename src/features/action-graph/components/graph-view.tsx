import { Edge as FlowEdge, Node as FlowNode, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

type Props = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};
export const GraphView = ({ nodes, edges }: Props) => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} edges={edges} fitView />
    </div>
  );
};
