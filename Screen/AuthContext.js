// AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};
