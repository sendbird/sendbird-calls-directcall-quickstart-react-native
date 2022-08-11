import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useState } from 'react';

import type { User } from '@sendbird/calls-react-native';

import CallHistoryManager from '../libs/CallHistoryManager';
import type { ChildrenProps } from '../types/props';

const AuthContext = createContext<{ currentUser?: User; setCurrentUser: Dispatch<SetStateAction<User | undefined>> }>({
  setCurrentUser: (x) => x,
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>();

  useEffect(() => {
    if (currentUser) {
      CallHistoryManager.init(currentUser.userId);
    }
  }, [currentUser]);

  return <AuthContext.Provider value={{ currentUser, setCurrentUser }}>{children}</AuthContext.Provider>;
};
