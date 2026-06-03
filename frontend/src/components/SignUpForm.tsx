import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { register as registerUser } from "../api/auth";
import type { RegisterRequest } from "../api/auth";
import Logo from "./Logo";
import "./SignUpForm.css";

interface SignUpFields extends RegisterRequest {
  confirmPassword: string;
}

export default function SignUpForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFields>();

  const onSubmit = async (fields: SignUpFields) => {
    setServerError(null);

    try {
      const result = await registerUser({
        email: fields.email,
        password: fields.password,
      });
      console.log("registered:", result);
      setSuccess(true);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "something went wrong",
      );
    }
  };

  if (success) {
    return (
      <output className="signup-form">
        <h2>Check your email</h2>
        <p>
          We've sent a confirmation link. (Just kidding — your account is
          ready!)
        </p>
      </output>
    );
  }

  return (
    <form
      className="signup-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Sign up"
    >
      <Logo />
      <h2>Create your account</h2>

      {serverError && (
        <div className="signup-form__error-banner" role="alert">
          {serverError}
        </div>
      )}

      <div className="signup-form__field">
        <label htmlFor="signup-email">Email</label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "signup-email-err" : undefined}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
            maxLength: {
              value: 255,
              message: "Email is too long",
            },
          })}
        />
        {errors.email && (
          <span
            id="signup-email-err"
            className="signup-form__error"
            role="alert"
          >
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="signup-form__field">
        <label htmlFor="signup-password">Password</label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "signup-password-err" : undefined}
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Must be at least 8 characters",
            },
            maxLength: {
              value: 128,
              message: "Password is too long",
            },
          })}
        />
        {errors.password && (
          <span
            id="signup-password-err"
            className="signup-form__error"
            role="alert"
          >
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="signup-form__field">
        <label htmlFor="signup-confirm">Confirm password</label>
        <input
          id="signup-confirm"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={
            errors.confirmPassword ? "signup-confirm-err" : undefined
          }
          {...register("confirmPassword", {
            required: "Please confirm your password",
            validate: (value) =>
              value === watch("password") || "Passwords do not match",
          })}
        />
        {errors.confirmPassword && (
          <span
            id="signup-confirm-err"
            className="signup-form__error"
            role="alert"
          >
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="signup-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account…" : "Sign up"}
      </button>

      <p className="signup-form__footer">
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
    </form>
  );
}
