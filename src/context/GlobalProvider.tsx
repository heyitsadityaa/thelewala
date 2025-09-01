import React, { ReactNode, createContext } from 'react';

type GlobalContextProps = {
  children: ReactNode;
};

type GlobalContextState = {
  // ...define your state and functions here...
};

export const GlobalContext = createContext<GlobalContextState | null>(null);

export const GlobalProvider = ({ children }: GlobalContextProps) => {
  

  return (
    <GlobalContext.Provider
      value={
        {
          // ...provide your state and functions here...
        }
      }>
      {children}
    </GlobalContext.Provider>
  );
};
