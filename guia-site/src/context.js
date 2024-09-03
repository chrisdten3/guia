import React, {createContext, useState} from 'react'; 

export const Context = createContext()

export const ContextProvider = ({children})=> {
    const [url, setUrl] = useState('')
    return (
        <Context.Provider value={{ url, setUrl}}>
            {children}
        </Context.Provider>
    );
}