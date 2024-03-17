"use client";
import { Label as PrimLabel } from "@/components/ui/label";
import { cn } from "@/libs/utils";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from "react-hook-form";

const Root = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const Field = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const Item = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
Item.displayName = "FormItem";

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return <PrimLabel ref={ref} className={cn(error && "text-destructive", className)} htmlFor={formItemId} {...props} />;
});
Label.displayName = "FormLabel";

const Control = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
  ({ ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <Slot
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Control.displayName = "FormControl";

const Description = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { formDescriptionId } = useFormField();

    return <p ref={ref} id={formDescriptionId} className={cn("text-sm text-muted-foreground", className)} {...props} />;
  }
);
Description.displayName = "FormDescription";

const Message = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    const { error, formMessageId } = useFormField();
    const body = error ? String(error?.message) : children;

    if (!body) {
      return null;
    }

    return (
      <p ref={ref} id={formMessageId} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {body}
      </p>
    );
  }
);
Message.displayName = "FormMessage";

export { Control, Description, Field, Item, Label, Message, Root, useFormField };
