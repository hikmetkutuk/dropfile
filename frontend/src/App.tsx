import { Routes, Route, Link } from "react-router-dom";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <>
            <section id="center">
              <h1>Dropfile</h1>
              <p>
                <Link to="/sign-in">Sign in</Link> or{" "}
                <Link to="/sign-up">create an account</Link> to get started.
              </p>
            </section>
            <div className="ticks" />
            <section id="spacer" />
          </>
        }
      />
      <Route
        path="/sign-in"
        element={
          <section id="center">
            <SignInForm />
          </section>
        }
      />
      <Route
        path="/sign-up"
        element={
          <section id="center">
            <SignUpForm />
          </section>
        }
      />
    </Routes>
  );
}

export default App;
