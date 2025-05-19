import React, { useEffect } from 'react';
import { TokenStore } from '@commercetools/ts-client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { verifyAuth, selectUser } from '../features/user/userSlice';
import { getDataFromLS } from '../services';
import { LocalStorageKey } from '../enums/appEnums';

const AuthVerifier: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isVerifying } = useAppSelector(selectUser);

  useEffect(() => {
    const sessionData: TokenStore | null = getDataFromLS(
      LocalStorageKey.SESSION,
    );

    if (sessionData?.token && !isVerifying) {
      dispatch(verifyAuth());
    }
  }, [dispatch, isVerifying]);

  return null;
};

export default AuthVerifier;
