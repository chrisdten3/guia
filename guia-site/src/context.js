import React, { createContext, useState } from 'react';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const [currentRepo, setCurrentRepo] = useState('');

    return (
        <Context.Provider value={{ currentRepo, setCurrentRepo }}>
            {children}
        </Context.Provider>
    );
};
