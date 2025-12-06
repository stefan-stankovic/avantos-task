import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dependency } from '@/features/action-graph/api/types';
import { Check, Database } from 'lucide-react';

type Props = {
  dependencies: Dependency[];
  onFieldSelect: (
    sourceFormId: string,
    sourceFormName: string,
    sourceFieldName: string
  ) => void;
  isFieldSelected: (formId: string, fieldName: string) => boolean;
};

export function DependencyFormsAccordion({
  dependencies,
  onFieldSelect,
  isFieldSelected,
}: Props) {
  if (dependencies.length === 0) return null;

  return (
    <>
      {dependencies.map((dependency) => (
        <AccordionItem key={dependency.id} value={dependency.id}>
          <AccordionTrigger className='hover:no-underline'>
            <div className='flex items-center gap-2'>
              <Database className='size-4 text-muted-foreground' />
              <span className='font-medium'>{dependency.name}</span>
              <span className='text-xs text-muted-foreground'>
                ({dependency.formFields.length} fields)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='space-y-2 pl-6 pt-2'>
              {dependency.formFields.length === 0 ? (
                <p className='text-sm text-muted-foreground py-2'>
                  No fields available
                </p>
              ) : (
                dependency.formFields.map((fieldName) => {
                  const isSelected = isFieldSelected(
                    dependency.formId,
                    fieldName
                  );

                  return (
                    <button
                      key={fieldName}
                      onClick={() =>
                        onFieldSelect(
                          dependency.formId,
                          dependency.name,
                          fieldName
                        )
                      }
                      className={`w-full text-left px-4 py-3 rounded-md border transition-all ${
                        isSelected
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'bg-card hover:bg-accent/50 border-border'
                      }`}
                    >
                      <div className='flex items-center justify-between gap-2'>
                        <span className='text-sm truncate'>{fieldName}</span>
                        {isSelected && <Check className='size-4 shrink-0' />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}
