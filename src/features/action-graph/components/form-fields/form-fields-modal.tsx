import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFormStateStore } from '@/stores/form-state-store';
import { FormFieldsList } from './form-fields-list';

export function FormFieldsModal() {
  const {
    selectedNode,
    closeNodeModal,
    formStates,
    openFieldMappingModal,
    setFieldMapping,
  } = useFormStateStore();

  if (!selectedNode) return null;

  const formState = formStates[selectedNode.nodeId];
  const allDependencies = [
    ...selectedNode.dependencies.direct,
    ...selectedNode.dependencies.transitive,
  ];

  const handleFieldClick = (fieldName: string) => {
    const fieldState = formState?.fields[fieldName];

    openFieldMappingModal({
      nodeId: selectedNode.nodeId,
      formId: selectedNode.formId,
      fieldName,
      currentMapping: fieldState?.prefillMapping || null,
      availableDependencies: allDependencies,
    });
  };

  const handleRemoveMapping = (nodeId: string, fieldName: string) => {
    setFieldMapping(nodeId, fieldName, null);
  };

  return (
    <Dialog open={!!selectedNode} onOpenChange={closeNodeModal}>
      <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl'>{selectedNode.formName}</DialogTitle>
          <DialogDescription>
            Click on the field to set prefill mapping from dependent forms
          </DialogDescription>
        </DialogHeader>

        <FormFieldsList
          selectedNode={selectedNode}
          formState={formState}
          handleFieldClick={handleFieldClick}
          handleRemoveMapping={handleRemoveMapping}
        />

        {allDependencies.length === 0 && (
          <div className='mt-4 p-4 rounded-lg bg-muted/50 border border-dashed'>
            <p className='text-sm text-muted-foreground text-center'>
              This form does not depend on any form
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
