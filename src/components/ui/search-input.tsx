import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Search } from 'lucide-react';
import React from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  onDebouncedChange?: (value: string) => void;
  debounceMs?: number;
};

export function SearchInput({
  onDebouncedChange,
  debounceMs = 300,
  ...props
}: Props) {
  const [value, setValue] = React.useState('');

  const debouncedValue = useDebounce(value, debounceMs);

  React.useEffect(() => {
    if (onDebouncedChange) onDebouncedChange(debouncedValue);
  }, [debouncedValue, onDebouncedChange]);

  return (
    <div className='relative w-full'>
      <Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        {...props}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          props.onChange?.(e);
        }}
        className='pl-9'
      />
    </div>
  );
}
