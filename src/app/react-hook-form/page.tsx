"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserAction } from "@/lib/server/actions/user-action";
import { userSchema } from "@/lib/share/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { errorMap } from "zod-validation-error";

const Page = () => {
  const { execute } = useAction(createUserAction, {
    onSettled: (response) => {
      if (response.result?.validationErrors) {
        handleValidationErrors(response.result.validationErrors);
      } else if (!response.result) {
        setError("root", {
          type: "manual",
          message: "Network error, please try again later",
        });
      }
    },
  });

  const handleValidationErrors = (validationErrors: {
    _errors?: string[];
    username?: { _errors?: string[] };
    email?: { _errors?: string[] };
    password?: { _errors?: string[] };
    confirmPassword?: { _errors?: string[] };
  }) => {
    Object.entries(validationErrors).forEach(([field, error]) => {
      if (!error) return;

      if (field === "_errors") {
        setError("root", {
          type: "manual",
          message: (error as string[]).join(", "),
        });
      } else {
        setError(
          field as "username" | "email" | "password" | "confirmPassword",
          {
            type: "manual",
            message: (error as { _errors: string[] })._errors.join(", "),
          }
        );
      }
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(userSchema, { errorMap }),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    execute(data);
  });

  return (
    <div className="max-w-[600px] mx-auto">
      <form onSubmit={onSubmit}>
        {errors.root && (
          <p className="text-red-500 mb-4">{errors.root.message}</p>
        )}
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-start items-center">
              <Label>username:</Label>
              <Input {...register("username")} />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-start items-center">
              <Label>email:</Label>
              <Input {...register("email")} />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-start items-center">
              <Label>password:</Label>
              <Input type="password" {...register("password")} />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex justify-start items-center">
              <Label>confirmPassword:</Label>
              <Input type="password" {...register("confirmPassword")} />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
