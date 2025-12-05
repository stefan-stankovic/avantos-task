import { useGetActionGraphQuery } from '../../features/action-graph/api/get-action-graph';
import { GraphView } from '../../features/action-graph/components/graph-view';

const tenantId = '123';
const blueprintId = 'bp_456';

export const Home = () => {
  const { data: items = [] } = useGetActionGraphQuery({
    blueprintId,
    tenantId,
  });

  return (
    <div className='flex items-center justify-center h-screen'>
      <GraphView nodes={items.nodes} edges={items.edges} />
    </div>
  );
};
