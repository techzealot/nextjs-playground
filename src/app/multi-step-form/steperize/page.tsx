"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm, useFormContext } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { defineStepper } from "@stepperize/react";

import "./app.css";

const shippingSchema = z.object({
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(5, "Postal code is required"),
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Card number is required"),
  expirationDate: z.string().min(5, "Expiration date is required"),
  cvv: z.string().min(3, "CVV is required"),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;
type PaymentFormValues = z.infer<typeof paymentSchema>;

const { useStepper, steps } = defineStepper(
  { id: "shipping", label: "Shipping", schema: shippingSchema },
  { id: "payment", label: "Payment", schema: paymentSchema },
  { id: "complete", label: "Complete", schema: z.object({}) }
);

function Page() {
  const stepper = useStepper();

  const form = useForm({
    defaultValues: {
      address: "test",
      city: "",
      postalCode: "",
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    },
    mode: "onTouched",
    resolver: zodResolver(stepper.current.schema),
  });

  const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
    // biome-ignore lint/suspicious/noConsoleLog: <We want to log the form values>
    console.log(`Form values for step ${stepper.current.id}:`, values);
    // you can get all form values this way
    console.log("state", form.getValues());
    if (stepper.isLast) {
      stepper.reset();
    } else {
      stepper.next();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-6 border rounded-lg w-[450px]"
        >
          <div className="flex justify-between">
            <h2 className="text-lg font-medium">Checkout</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Step {stepper.current.index + 1} of {steps.length}
              </span>
            </div>
          </div>
          <nav aria-label="Checkout Steps" className="group my-4">
            <ol className="flex items-center justify-between gap-2">
              {stepper.all.map((step, index, array) => (
                <React.Fragment key={step.id}>
                  <li className="flex items-center gap-4 flex-shrink-0">
                    <Button
                      type="button"
                      role="tab"
                      variant={
                        index <= stepper.current.index ? "default" : "secondary"
                      }
                      aria-current={
                        stepper.current.id === step.id ? "step" : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      className="flex size-10 items-center justify-center rounded-full"
                      // ! should validate before going to next step
                      onClick={async () => {
                        const valid = await form.trigger();
                        //must be validated
                        if (!valid) return;
                        //can't skip steps forwards but can go back anywhere
                        if (index - stepper.current.index > 1) return;
                        stepper.goTo(step.id);
                      }}
                    >
                      {index + 1}
                    </Button>
                    <span className="text-sm font-medium">{step.label}</span>
                  </li>
                  {index < array.length - 1 && (
                    <Separator
                      className={`flex-1 ${
                        index < stepper.current.index
                          ? "bg-primary"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </ol>
          </nav>
          <div className="space-y-4">
            {stepper.switch({
              shipping: () => <ShippingComponent />,
              payment: () => <PaymentComponent />,
              complete: () => <CompleteComponent />,
            })}
            {!stepper.isLast ? (
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                >
                  Back
                </Button>
                <Button type="submit">
                  {stepper.isLast ? "Complete" : "Next"}
                </Button>
              </div>
            ) : (
              <Button type="submit">submit</Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

function ShippingComponent() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ShippingFormValues>();

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("address").name}
          className="block text-sm font-medium text-primary"
        >
          Address
        </label>
        <Input
          id={register("address").name}
          {...register("address")}
          className="block w-full p-2 border rounded-md"
        />
        {errors.address && (
          <span className="text-sm text-destructive">
            {errors.address.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("city").name}
          className="block text-sm font-medium text-primary"
        >
          City
        </label>
        <Input
          id={register("city").name}
          {...register("city")}
          className="block w-full p-2 border rounded-md"
        />
        {errors.city && (
          <span className="text-sm text-destructive">
            {errors.city.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("postalCode").name}
          className="block text-sm font-medium text-primary"
        >
          Postal Code
        </label>
        <Input
          id={register("postalCode").name}
          {...register("postalCode")}
          className="block w-full p-2 border rounded-md"
        />
        {errors.postalCode && (
          <span className="text-sm text-destructive">
            {errors.postalCode.message}
          </span>
        )}
      </div>
    </div>
  );
}

function PaymentComponent() {
  const {
    register,
    formState: { errors },
  } = useFormContext<PaymentFormValues>();

  return (
    <div className="space-y-4 text-start">
      <div className="space-y-2">
        <label
          htmlFor={register("cardNumber").name}
          className="block text-sm font-medium text-primary"
        >
          Card Number
        </label>
        <Input
          id={register("cardNumber").name}
          {...register("cardNumber")}
          className="block w-full p-2 border rounded-md"
        />
        {errors.cardNumber && (
          <span className="text-sm text-destructive">
            {errors.cardNumber.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("expirationDate").name}
          className="block text-sm font-medium text-primary"
        >
          Expiration Date
        </label>
        <Input
          id={register("expirationDate").name}
          {...register("expirationDate")}
          className="block w-full p-2 border rounded-md"
        />
        {errors.expirationDate && (
          <span className="text-sm text-destructive">
            {errors.expirationDate.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <label
          htmlFor={register("cvv").name}
          className="block text-sm font-medium text-primary"
        >
          CVV
        </label>
        <Input
          id={register("cvv").name}
          {...register("cvv")}
          className="block w-full p-2 border rounded-md"
        />
        {errors.cvv && (
          <span className="text-sm text-destructive">{errors.cvv.message}</span>
        )}
      </div>
    </div>
  );
}

function CompleteComponent() {
  return <div className="text-center">Thank you! Your order is complete.</div>;
}

export default Page;
