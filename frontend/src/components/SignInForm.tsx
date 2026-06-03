import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import type { LoginRequest } from "../api/auth";
import Logo from "./Logo";
import "./SignUpForm.css";

export default function SignInForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [abortController] = useState(() => new AbortController());
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      abortController.abort();
    };
  }, [abortController]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  const onSubmit = async (fields: LoginRequest) => {
    setServerError(null);

    try {
      const result = await login(fields, abortController.signal);

      if (abortController.signal.aborted) {
        return;
      }

      localStorage.setItem("token", result.token);
      navigate("/", { replace: true });
    } catch (err) {
      if (abortController.signal.aborted) {
        return;
      }

      setServerError(
        err instanceof Error ? err.message : "something went wrong",
      );
    }
  };

  return (
    <form
      className="signup-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Sign in"
    >
      <Logo />
      <h2>Welcome back</h2>

      {serverError && (
        <div className="signup-form__error-banner" role="alert">
          {serverError}
        </div>
      )}

      <div className="signup-form__field">
        <label htmlFor="signin-email">Email</label>
        <input
          id="signin-email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "signin-email-err" : undefined}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address",
            },
          })}
        />
        {errors.email && (
          <span
            id="signin-email-err"
            className="signup-form__error"
            role="alert"
          >
            {errors.email.message}
          </span>
        )}
      </div>

      <div className="signup-form__field">
        <label htmlFor="signin-password">Password</label>
        <input
          id="signin-password"
          type="password"
          autoComplete="current-password"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? "signin-password-err" : undefined}
          {...register("password", {
            required: "Password is required",
          })}
        />
        {errors.password && (
          <span
            id="signin-password-err"
            className="signup-form__error"
            role="alert"
          >
            {errors.password.message}
          </span>
        )}
      </div>

      <button
        type="submit"
        className="signup-form__submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>

      <p className="signup-form__footer">
        Don't have an account? <Link to="/sign-up">Sign up</Link>
      </p>
    </form>
  );
}
