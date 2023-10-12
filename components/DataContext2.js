// DataContext2.js
import React, { createContext, useContext, useReducer } from "react";

const DataContext2 = createContext();

export const useDataContext2 = () => useContext(DataContext2);

const initialData2 = "";

const reducer2 = (state, action) => {
  switch (action.type) {
    case "UPDATE_DATA2":
      return action.payload;
    default:
      return state;
  }
};

export const DataProvider2 = ({ children }) => {
  const [data2, dispatch2] = useReducer(reducer2, initialData2);

  return (
    <DataContext2.Provider value={{ data2, dispatch2 }}>
      {children}
    </DataContext2.Provider>
  );
};
