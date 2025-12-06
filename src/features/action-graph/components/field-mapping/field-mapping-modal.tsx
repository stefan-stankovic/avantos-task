import { Accordion } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  useFormStateStore,
  type FieldMapping,
} from '@/stores/form-state-store';
import { useEffect, useState } from 'react';
import { DependencyFormsAccordion } from './dependency-forms-accordion';
import { GlobalDataAccordion } from './global-data-accordion';

export function FieldMappingModal() {
  const { fieldMappingModal, closeFieldMappingModal, setFieldMapping } =
    useFormStateStore();

  const [selectedMapping, setSelectedMapping] = useState<FieldMapping | null>(
    null
  );

  // Reset selected mapping when modal opens with new data
  useEffect(() => {
    if (fieldMappingModal) {
      setSelectedMapping(fieldMappingModal.currentMapping || null);
    }
  }, [fieldMappingModal]);

  if (!fieldMappingModal) return null;

  const handleFieldSelect = (
    sourceFormId: string,
    sourceFormName: string,
    sourceFieldName: string
  ) => {
    setSelectedMapping({
      sourceFormId,
      sourceFormName,
      sourceFieldName,
    });
  };

  const handleSave = () => {
    setFieldMapping(
      fieldMappingModal.nodeId,
      fieldMappingModal.fieldName,
      selectedMapping
    );
    closeFieldMappingModal();
  };

  const handleCancel = () => {
    setSelectedMapping(null);
    closeFieldMappingModal();
  };

  const isFieldSelected = (formId: string, fieldName: string) => {
    return (
      selectedMapping?.sourceFormId === formId &&
      selectedMapping?.sourceFieldName === fieldName
    );
  };

  return (
    <Dialog open={!!fieldMappingModal} onOpenChange={handleCancel}>
      <DialogContent className='max-w-3xl max-h-[85vh] overflow-hidden flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-xl'>
            Map Field: {fieldMappingModal.fieldName}
          </DialogTitle>
          <DialogDescription>
            Select a field from global data or dependent forms to prefill this
            field
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto pr-2 -mr-2'>
          <Accordion type='single' collapsible className='w-full'>
            <GlobalDataAccordion
              onFieldSelect={(formId, formName, fieldName) =>
                handleFieldSelect(formId, formName, fieldName)
              }
              isFieldSelected={isFieldSelected}
            />
            <DependencyFormsAccordion
              dependencies={fieldMappingModal.availableDependencies}
              onFieldSelect={(formId, formName, fieldName) =>
                handleFieldSelect(formId, formName, fieldName)
              }
              isFieldSelected={isFieldSelected}
            />
          </Accordion>
        </div>

        {selectedMapping && (
          <div className='mt-4 p-3 rounded-lg bg-muted/50 border'>
            <p className='text-sm'>
              <span className='text-muted-foreground'>Selected mapping: </span>
              <span className='font-medium'>
                {selectedMapping.sourceFormName}
              </span>
              {' → '}
              <span className='font-medium'>
                {selectedMapping.sourceFieldName}
              </span>
            </p>
          </div>
        )}

        <DialogFooter className='gap-2'>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          {fieldMappingModal.currentMapping && (
            <Button
              variant='destructive'
              onClick={() => {
                setFieldMapping(
                  fieldMappingModal.nodeId,
                  fieldMappingModal.fieldName,
                  null
                );
                closeFieldMappingModal();
              }}
            >
              Remove Mapping
            </Button>
          )}
          <Button onClick={handleSave} disabled={!selectedMapping}>
            Save Mapping
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
