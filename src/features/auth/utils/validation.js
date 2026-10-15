/** Client-side checks mirroring the backend's /auth rules, so most mistakes never hit the network. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;
export const DISPLAY_NAME_MAX = 80;

function emailError(email) {
  if (!email.trim()) return 'Email address is required.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Please enter a valid email address (e.g. name@domain.com).';
  return undefined;
}

/** Drop keys whose value is undefined so `Object.keys(errors).length` means "has errors". */
function compact(errors) {
  return Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
}

export function validateSignIn({ email, password }) {
  return compact({
    email: emailError(email),
    password: password ? undefined : 'Password is required.',
  });
}

export function validateSignUp({ displayName, email, password, confirmPassword, agreeTerms }) {
  const name = displayName.trim();
  let passwordError;
  if (!password) passwordError = 'Password is required.';
  else if (password.length < PASSWORD_MIN) passwordError = `Password must be at least ${PASSWORD_MIN} characters.`;
  else if (password.length > PASSWORD_MAX) passwordError = `Password must be at most ${PASSWORD_MAX} characters.`;

  return compact({
    displayName: !name
      ? 'Your name is required.'
      : name.length > DISPLAY_NAME_MAX
        ? `Name must be at most ${DISPLAY_NAME_MAX} characters.`
        : undefined,
    email: emailError(email),
    password: passwordError,
    confirmPassword: !confirmPassword
      ? 'Please confirm your password.'
      : confirmPassword !== password
        ? 'Passwords do not match.'
        : undefined,
    agreeTerms: agreeTerms ? undefined : 'Please accept the terms to continue.',
  });
}
