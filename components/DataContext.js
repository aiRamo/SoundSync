// DataContext.js

import React, { createContext, useContext, useReducer } from "react";

const DataContext = createContext();

export const useDataContext = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [data, dispatch] = useReducer(dataReducer, initialData);

  return (
    <DataContext.Provider value={{ data, dispatch }}>
      {children}
    </DataContext.Provider>
  );
};

const initialData = {
  key: "value",
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_DATA":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
