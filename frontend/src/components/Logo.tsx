import "./SignUpForm.css";

export default function Logo() {
  return (
    <picture>
      <source srcSet="/logo-dark.png" media="(prefers-color-scheme: dark)" />
      <img className="signup-form__logo" src="/logo-light.png" alt="Dropfile" />
    </picture>
  );
}
