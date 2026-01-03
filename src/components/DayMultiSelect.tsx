import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

const daysList = [
  { value: "U", label: "Sunday (U)" },
  { value: "M", label: "Monday (M)" },
  { value: "T", label: "Tuesday (T)" },
  { value: "W", label: "Wednesday (W)" },
  { value: "R", label: "Thursday (R)" },
  { value: "F", label: "Friday (F)" },
  { value: "S", label: "Saturday (S)" },
];

const dayOrder = "MTWRFSU";

type Props = {
  value?: string;
  onChange: (val: string) => void;

  label?: string;
  labelClassName?: string;

  triggerClassName?: string;
  contentClassName?: string;

  /** Optional: control Button variant without editing the component */
  variant?: React.ComponentProps<typeof Button>["variant"];
};

export function DayMultiSelect({
  value = "",
  onChange,
  label = "Day",
  labelClassName,
  triggerClassName,
  contentClassName,
  variant = "outline",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (dayValue: string) => {
    onChange(value.includes(dayValue) ? value.replace(dayValue, "") : value + dayValue);
  };

  const daysDisplay = value
    .split("")
    .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
    .join("");

  return (
    <div className="space-y-1.5">
      <Label className={cn("text-xs font-medium text-muted-foreground", labelClassName)}>
        {label}
      </Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={variant}
            role="combobox"
            aria-expanded={open}
            className={cn("h-9 w-full justify-between px-3 font-normal", triggerClassName)}
          >
            <span className="truncate">{value ? daysDisplay : "Any day"}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)}
        >
          <Command>
            <CommandList>
              <CommandGroup>
                {daysList.map((day) => {
                  const isSelected = value.includes(day.value);
                  return (
                    <CommandItem key={day.value} onSelect={() => handleSelect(day.value)}>
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <span>{day.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
