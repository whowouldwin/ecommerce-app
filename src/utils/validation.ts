export const validateEmail = (email: string): string => {
  const trimmed = email.trim();

  if (!trimmed) return 'Email is required';
  if (trimmed !== email) return 'No leading or trailing spaces allowed';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed))
    return 'Enter a valid email address';
  return '';
};

export const validatePassword = (password: string): string => {
  const trimmed = password.trim();

  if (!trimmed) return 'Password is required';
  if (trimmed !== password) return 'No leading or trailing spaces allowed';
  if (trimmed.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(trimmed)) return 'At least one uppercase letter required';
  if (!/[a-z]/.test(trimmed)) return 'At least one lowercase letter required';
  if (!/[0-9]/.test(trimmed)) return 'At least one number required';
  return '';
};

export const validatePasswordConfirmation = (
  password: string,
  confirm: string,
): string => {
  if (!confirm.trim()) return 'Please confirm your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
};

export const validateName = (
  value: string,
  field: 'firstName' | 'lastName',
): string => {
  const trimmed = value.trim();
  const nameRegex = /^[A-Za-zА-Яа-яёЁ\s-]+$/;

  if (!trimmed) {
    return 'This field is required.';
  }

  if (!nameRegex.test(trimmed)) {
    return `${field === 'firstName' ? 'First' : 'Last'} name should not contain numbers or special characters.`;
  }

  return '';
};

export const validateDateOfBirth = (dateString: string): string => {
  if (!dateString) return 'Date of birth is required';

  const birthDate = new Date(dateString);
  const today = new Date();

  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  const d = today.getDate() - birthDate.getDate();

  const isTooYoung = age < 13 || (age === 13 && (m < 0 || (m === 0 && d < 0)));

  if (isTooYoung) {
    return 'You must be at least 13 years old.';
  }

  return '';
};

export const validateStreet = (value: string): string => {
  if (!value) return 'Street is required.';
  const validStreet = /^[a-zA-Z\s]+$/;
  if (!validStreet.test(value.trim())) {
    return 'Street must only contain letters and spaces.';
  }

  return '';
};

export const validateCity = (value: string): string => {
  if (!value) return 'City is required';
  const validCity = /^[a-zA-Z\s]+$/;
  if (!validCity.test(value.trim())) {
    return 'City must only contain letters and spaces.';
  }

  return '';
};

export const validatePostalCode = (value: string): string => {
  if (!value) return 'Postal code is required';

  const validPostalCode = /^[0-9\s]{3,10}$/;

  if (!validPostalCode.test(value.trim())) {
    return 'Invalid postal code format';
  }

  return '';
};
const allowedCountries = ['DE', 'PL', 'BY'];
export const validateCountry = (value: string): string => {
  if (!value) return 'Country is required';
  if (!allowedCountries.includes(value)) return 'Invalid country selected';
  return '';
};
