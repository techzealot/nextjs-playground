"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserAction } from "@/lib/server/actions/user-action";
import { userSchema } from "@/lib/share/schema";
import {
  mergeForm,
  useForm,
  useStore,
  useTransform,
} from "@tanstack/react-form";
import { useAction } from "next-safe-action/hooks";
import { useEffect } from "react";

const Page = () => {
  const { execute, result } = useAction(createUserAction, {
    onSettled: ({ result: { data, validationErrors } }) => {
      console.log("data", data);
      console.log("errors", validationErrors?.username?._errors);
      //!在这里可以更精细的处理错误映射,能细化到字段,但是没有辅助api实现起来比较麻烦
      // if (validationErrors) {
      //   form.setFieldMeta(
      //     "username",
      //     (meta) =>
      //       ({
      //         ...meta,
      //         error: validationErrors?.username?._errors?.join(),
      //         errorMap: { onSubmit: validationErrors?._errors?.join() },
      //       } as FieldMeta)
      //   );
      //   form.setErrorMap({ onSubmit: validationErrors?._errors?.join() });
      // }
    },
  });
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onSubmit: userSchema,
    },
    //!使用createServerValidate这种方式只能合并values,errors,errorMap,不能更进一步细化到字段,自定义模式可以合并更多,但基本无法实现,手动构造FromState太过复杂
    transform: useTransform(
      (baseForm) => mergeForm(baseForm, result.data ?? {}),
      [result.data]
    ),
    onSubmit: ({ value }) => {
      execute(value);
    },
  });

  const formErrors = useStore(form.store, (formState) => formState.errors);

  useEffect(() => {
    console.log(form.state);
  });

  return (
    <div className="max-w-[600px] mx-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {result.data && (
          <p className="text-gray-500">{JSON.stringify(result)}</p>
        )}
        {formErrors.map((error) => (
          <p key={error as string} className="text-red-500">
            {error}
          </p>
        ))}
        <form.Field name="username">
          {(field) => {
            return (
              <div className="flex justify-start items-center">
                <Label>{field.name}:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field name="email">
          {(field) => {
            return (
              <div className="flex justify-start items-center">
                <Label>{field.name}:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field name="password">
          {(field) => {
            return (
              <div className="flex justify-start items-center">
                <Label>{field.name}:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            );
          }}
        </form.Field>
        <form.Field name="confirmPassword">
          {(field) => {
            return (
              <div className="flex justify-start items-center">
                <Label>{field.name}:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value ?? ""}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
              </div>
            );
          }}
        </form.Field>
        <form.Subscribe
          selector={(formState) => [
            formState.canSubmit,
            formState.isSubmitting,
          ]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "Submit..." : "Submit"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
};

export default Page;
