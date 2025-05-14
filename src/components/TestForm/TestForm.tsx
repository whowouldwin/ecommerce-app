import './test-form.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import {
  loginUser,
  logoutUser,
  selectUser,
} from '../../features/user/userSlice.ts';
import { useAppDispatch, useAppSelector } from '../../store/hooks.ts';

interface IFormState {
  login: string;
  password: string;
  isFormReadyToSubmit: boolean;
}

const INITIAL_FORM_STATE: IFormState = {
  login: '',
  password: '',
  isFormReadyToSubmit: false,
};

function TestForm() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

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
    return !!stateForm.login && !!stateForm.password;
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(
      loginUser({ email: formState.login, password: formState.password }),
    );
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setFormState(INITIAL_FORM_STATE);
  };

  return (
    <form className="test-form" onSubmit={submitForm}>
      {`formState.isFormReadyToSubmit ${formState.isFormReadyToSubmit}`}
      <h3 className="title">Login Form</h3>
      <p>
        Status:{' '}
        {user.isAuthenticated ? `Logged in as ${user.email}` : 'Not logged in'}
      </p>
      <label>Login:</label>
      <input
        name="login"
        type="email"
        value={formState.login}
        onChange={inputChange}
        disabled={user.isAuthenticated}
      />
      <label>Password: </label>
      <input
        name="password"
        type="password"
        value={formState.password}
        onChange={inputChange}
        disabled={user.isAuthenticated}
      />
      <button
        type="submit"
        disabled={!formState.isFormReadyToSubmit || user.isAuthenticated}
      >
        login
      </button>
      <button
        type="button"
        onClick={handleLogout}
        disabled={!user.isAuthenticated}
      >
        logout
      </button>
    </form>
  );
}

export { TestForm };
