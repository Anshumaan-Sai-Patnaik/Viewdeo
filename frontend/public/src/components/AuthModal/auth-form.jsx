import Button from '@mui/material/Button';

import api from '../../services/api.js'

import { useFlash } from '../../context/FlashContext.jsx';

function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const { showFlash } = useFlash();

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const name = isSignup ? formData.get('name') : 'null';
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const result = isSignup ? await api.post("/user/signup", {name, email, password}) : await api.post("/user/login", {emailID: email, password});

      if(result.data.success) {
        window.location.href = import.meta.env.VITE_PROTECTED_URL;
      }
    } catch (error) {
      console.error("Auth error:", error);
      const message = error.response?.data?.message || "An unexpected error occurred.";
      showFlash(message, 'error');
    }
  }

  return ( 
    <form className="auth-form" onSubmit={ handleSubmit }>
      {isSignup && (
        <div className="auth-field">
          <label htmlFor="auth-name">Full name</label>
          <input id="auth-name" name="name" type="text" placeholder="Ada Lovelace" autoComplete="name" required />
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="auth-email">Email</label>
        <input id="auth-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password">Password</label>
        <input id="auth-password" name="password" type="password" placeholder={isSignup ? "At least 8 characters" : "Your password"} minLength={8} autoComplete={isSignup ? "new-password" : "current-password"} required />
      </div>

      {!isSignup && (
        <p className="auth-forgot">
          <a href="#forgot">Forgot password?</a>
        </p>
      )}

      <Button className="auth-submit" variant="contained" size="large" type="submit">
        {isSignup ? 'Create account' : 'Log in'}
      </Button>

      {isSignup && (
        <p className="auth-terms">
          By creating an account you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
        </p>
      )}
    </form>
   );
}

export default AuthForm;
