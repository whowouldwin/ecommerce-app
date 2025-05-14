import './test-form.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import { login, logout } from '../../services';

interface IFormState {
  login: string;
  password: string;
  isFormReadyToSubmit: boolean;
  isUserLogin: boolean;
}

const INITIAL_FORM_STATE: IFormState = {
  login: '',
  password: '',
  isFormReadyToSubmit: false,
  isUserLogin: false,
};

function TestForm() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);

  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFormState = {
      ...formState,
      [event.target.name]: event.target.value,
    };
    setFormState({
      ...newFormState,
      isFormReadyToSubmit: checkFormReadyToSubmit(newFormState),
    });
  };

  function checkFormReadyToSubmit(stateForm: IFormState): boolean {
    return !!formState.login && !!stateForm.password;
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({
      email: formState.login,
      password: formState.password,
    })
      .then((data) => {
        setFormState({
          ...formState,
          isUserLogin: true,
        });
        console.log('data', data);
      })
      .catch((error) => console.log('loginError', error));
  };

  return (
    <form className="test-form" onSubmit={submitForm}>
      {`formState.isFormReadyToSubmit ${formState.isFormReadyToSubmit}`}
      <h3 className="title">Login Form</h3>
      <label>Login: </label>
      <input
        name="login"
        type="email"
        value={formState.login}
        onChange={inputChange}
        disabled={formState.isUserLogin}
      />
      <label>Password: </label>
      <input
        name="password"
        type="password"
        value={formState.password}
        onChange={inputChange}
        disabled={formState.isUserLogin}
      />
      <button
        type="submit"
        disabled={!formState.isFormReadyToSubmit || formState.isUserLogin}
      >
        login
      </button>
      <button
        onClick={() => {
          setFormState({
            ...INITIAL_FORM_STATE,
          });
          logout();
        }}
        disabled={!formState.isUserLogin}
      >
        logout
      </button>
    </form>
  );
}

export default TestForm;
