import Button from '@mui/material/Button';

function AuthForm({ mode }) {
  const isSignup = mode === 'signup';

  return ( 
    <form className="auth-form" onSubmit={(event) => event.preventDefault()}>
      {isSignup && (
        <div className="auth-field">
          <label htmlFor="auth-name">Full name</label>
          <input id="auth-name" name="name" type="text" placeholder="Ada Lovelace" autoComplete="name" />
        </div>
      )}

      <div className="auth-field">
        <label htmlFor="auth-email">Email</label>
        <input id="auth-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password">Password</label>
        <input id="auth-password" name="password" type="password" placeholder={isSignup ? "At least 8 characters" : "Your password"} autoComplete={isSignup ? "new-password" : "current-password"} />
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
