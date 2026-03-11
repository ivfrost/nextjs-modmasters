import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ComponentProps, MouseEventHandler } from 'react';
import { Button } from './ui/button';

type ButtonShowToggleProps = {
  size?: ComponentProps<typeof Button>['size'];
  variant?: ComponentProps<typeof Button>['variant'];
  value: boolean;
  className?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

export default function ButtonShowToggle(props: ButtonShowToggleProps) {
  const { size, variant, value, className, onClick } = props;
  return (
    <Button
      className={`rounded-none w-full font-semibold text-muted-foreground border-0 supports-backdrop-filter:bg-white/80 dark:supports-backdrop-filter:bg-stone-900/80 supports-backdrop-filter:backdrop-blur-xs ${className}`}
      onClick={onClick}
      size={size}
      variant={variant}
    >
      {value ? (
        <>
          <ChevronUp /> <span>Show less</span>
        </>
      ) : (
        <>
          <ChevronDown /> <span>Show More</span>
        </>
      )}
    </Button>
  );
}
