"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(0, "Age must be positive"),
});

const childSchema = baseSchema.extend({
  isAdult: z.literal(false),
});

const adultSchema = baseSchema.extend({
  isAdult: z.literal(true),
  age: z.number().min(18, "Must be at least 18"),
  occupation: z.string().min(1, "Occupation is required"),
  yearsOfExperience: z.number().min(0, "Experience must be positive"),
});

const userSchema = z.discriminatedUnion("isAdult", [childSchema, adultSchema]);

const formSchema = z.object({
  users: z.array(userSchema),
});

type FormValues = z.infer<typeof formSchema>;

const Page = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      users: [
        {
          name: "",
          age: 0,
          isAdult: false,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "users",
    control: form.control,
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2">
            <div className="flex gap-2 items-end">
              <FormField
                control={form.control}
                name={`users.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage className="mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`users.${index}.age`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Age"
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>

            <FormField
              control={form.control}
              name={`users.${index}.isAdult`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel>Is Adult?</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch(`users.${index}.isAdult`) && (
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`users.${index}.occupation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Occupation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Occupation"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`users.${index}.yearsOfExperience`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Years of Experience"
                          type="number"
                          {...field}
                          value={field.value || 0}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="secondary"
          onClick={() =>
            append({
              name: "",
              age: 0,
              isAdult: false,
            })
          }
        >
          Add User
        </Button>

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Page;
