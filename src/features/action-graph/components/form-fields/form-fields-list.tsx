import { Button } from '@/components/ui/button';
import { FormState, SelectedNodeData } from '@/stores/form-state-store';
import { Database, Link2, Trash2Icon } from 'lucide-react';

export const FormFieldsList = ({
  selectedNode,
  formState,
  handleFieldClick,
  handleRemoveMapping,
}: {
  selectedNode: SelectedNodeData;
  formState: FormState;
  handleFieldClick: (fieldName: string) => void;
  handleRemoveMapping: (nodeId: string, fieldName: string) => void;
}) => {
  return (
    <div className='space-y-3 mt-4'>
      {selectedNode.formFields.length === 0 ? (
        <p className='text-muted-foreground text-sm text-center py-8'>
          No available fields
        </p>
      ) : (
        selectedNode.formFields.map((fieldName) => {
          const fieldState = formState?.fields[fieldName];
          const hasMapping = !!fieldState?.prefillMapping;

          return (
            <div
              key={fieldName}
              onClick={() => handleFieldClick(fieldName)}
              className='w-full text-left p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group'
            >
              <div className='flex items-start justify-between gap-4'>
                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-2 mb-1'>
                    <Database className='size-4 text-muted-foreground shrink-0' />
                    <h4 className='font-medium text-sm truncate'>
                      {fieldName}
                    </h4>
                  </div>

                  {hasMapping && fieldState.prefillMapping && (
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2 mt-2 text-xs text-muted-foreground'>
                        <Link2 className='size-3' />
                        <span>
                          Mapped from:{' '}
                          <span className='font-medium text-foreground'>
                            {fieldState.prefillMapping.sourceFormName}
                          </span>
                          {' → '}
                          <span className='font-medium text-foreground'>
                            {fieldState.prefillMapping.sourceFieldName}
                          </span>
                        </span>
                      </div>
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={(e) => {
                          handleRemoveMapping(selectedNode.nodeId, fieldName);
                          e.stopPropagation();
                        }}
                      >
                        <Trash2Icon color='red' />
                      </Button>
                    </div>
                  )}

                  {!hasMapping && (
                    <p className='text-xs text-muted-foreground mt-1'>
                      No prefill mapping
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
