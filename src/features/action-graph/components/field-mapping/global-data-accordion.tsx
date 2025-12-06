import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { GLOBAL_DATA_SOURCES } from '@/stores/form-state-store';
import { Check, Globe } from 'lucide-react';

type Props = {
  onFieldSelect: (
    sourceFormId: string,
    sourceFormName: string,
    sourceFieldName: string
  ) => void;
  isFieldSelected: (formId: string, fieldName: string) => boolean;
  searchQuery?: string;
};

export function GlobalDataAccordion({
  onFieldSelect,
  isFieldSelected,
  searchQuery = '',
}: Props) {
  return (
    <>
      {GLOBAL_DATA_SOURCES.map((globalSource) => (
        <AccordionItem key={globalSource.id} value={globalSource.id}>
          <AccordionTrigger className='hover:no-underline'>
            <div className='flex items-center gap-2'>
              <Globe className='size-4 text-primary' />
              <span className='font-medium'>{globalSource.name}</span>
              <span className='text-xs text-muted-foreground'>
                ({globalSource.fields.length} fields)
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className='space-y-2 pl-6 pt-2'>
              {globalSource.fields
                .filter((fieldName) =>
                  fieldName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((fieldName) => {
                  const isSelected = isFieldSelected(
                    globalSource.id,
                    fieldName
                  );

                  return (
                    <button
                      key={fieldName}
                      onClick={() =>
                        onFieldSelect(
                          globalSource.id,
                          globalSource.name,
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
                })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}
