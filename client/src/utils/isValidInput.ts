interface InputTypes {
  username?: string;
  email?: string;
  password?: string;
}

export interface ValidInputs {
  username?: boolean;
  email?: boolean;
  password?: boolean;
}

const isValidUsername = (username: string): boolean => {
  const regex: RegExp = /^[a-zA-Z0-9_]+$/;
  return regex.test(username);
};

const isValidEmail = (email: string): boolean => {
  const regex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPassword = (password: string): boolean => {
  if (password.length < 8) {
    return false;
  } else if (!/[a-z]/.test(password)) {
    return false;
  } else if (!/[A-Z]/.test(password)) {
    return false;
  } else if (!/[@#$%^&+=]/.test(password)) {
    return false;
  } else if (!/\d/.test(password)) {
    return false;
  }

  return true;
};

const isValidInput = (inputs: InputTypes): ValidInputs => {
  const { username, email, password } = inputs;
  if (!username && !email && !password) return {};

  const validInputs: ValidInputs = {};
  if (username) validInputs.username = isValidUsername(username);
  if (email) validInputs.email = isValidEmail(email);
  if (password) validInputs.password = isValidPassword(password);

  return validInputs;
};

export default isValidInput;
