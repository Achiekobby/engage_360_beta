export const DEMO_CREDENTIALS = {
  email: 'guest@engage360.com',
  password: 'demo1234',
};

export const DEMO_USER = {
  id: 'guest-001',
  name: 'Guest User',
  email: DEMO_CREDENTIALS.email,
  role: 'guest',
};

export function isDemoLogin(email, password) {
  return (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    password === DEMO_CREDENTIALS.password
  );
}
