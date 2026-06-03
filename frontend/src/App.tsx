import { Routes, Route, Link } from 'react-router-dom'
import SignUpForm from './components/SignUpForm'
import './App.css'

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
                <Link to="/sign-up">Create an account</Link>
                {' '}
                to get started.
              </p>
            </section>
            <div className="ticks" />
            <section id="spacer" />
          </>
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
  )
}

export default App
