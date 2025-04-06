import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { flushSync } from "react-dom";

type FilterSelectProps = {
  filter: string;
  setFilter: (value: string) => void;
};

// FilterSelect must be defined in its own component rather than inside of App.tsx
// because when you define a component inside of another component whenever the
// parent component re-renders (which happens everytime the filter state changes),
// react will re-create the defined component which causes the radio group focus to be lost
export const FilterSelect = ({ filter, setFilter }: FilterSelectProps) => {
  const filters = [
    {
      label: "All",
      value: "all",
      id: "extensions-list-filter-all",
    },
    {
      label: "Active",
      value: "active",
      id: "extensions-list-filter-active",
    },
    {
      label: "Inactive",
      value: "inactive",
      id: "extensions-list-filter-inactive",
    },
  ];

  const onFilterChange = (value: string) => {
    // fallback for browsers that dont support view transitions
    if (!document.startViewTransition) {
      setFilter(value);
    }

    // browsers that do support view transitions
    document.startViewTransition(() => {
      // flushSync forces React to complete all pending updates synchronously,
      // normally React batches state updates and processes them asynchronously.
      // in this case we need flushSync to ensure when startViewTransition takes the "after" screenshot of the DOM
      // the changes from setFilter are already applied, without it React will batch the update asynchronously causing
      // the transition to capture an incomplete state.
      flushSync(() => {
        setFilter(value);
      });
    });
  };

  return (
    <RadioGroup
      className="flex items-center justify-center gap-x-2"
      value={filter}
      onValueChange={onFilterChange}
      defaultValue={filter}
    >
      {filters.map(({ label, value, id }) => (
        <div key={id}>
          <RadioGroupItem value={value} id={id} className="peer sr-only" />
          <Label
            htmlFor={id}
            className={cn(
              "grid h-9 w-20 place-content-center rounded-full bg-white text-neutral-900 transition-colors hover:bg-neutral-200 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-red-400 dark:peer-focus-visible:border-2 dark:peer-focus-visible:border-neutral-800 dark:peer-focus-visible:bg-neutral-600",
              filter === value &&
                "bg-red-700 text-white peer-focus-visible:bg-red-700 peer-focus-visible:text-white peer-focus-visible:ring-offset-2 hover:bg-red-400 dark:bg-red-500 dark:text-neutral-800 peer-focus-visible:dark:bg-red-700 dark:peer-focus-visible:ring-offset-0 dark:hover:bg-red-400",
            )}
          >
            {label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
