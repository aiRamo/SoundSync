// DataContext1.js
import React, { createContext, useContext, useReducer } from "react";

const DataContext1 = createContext();

export const useDataContext = () => useContext(DataContext1);

const initialData1 = {
  key: "value",
};
const reducer1 = (state, action) => {
  switch (action.type) {
    case "UPDATE_DATA1":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export const DataProvider = ({ children }) => {
  const [data1, dispatch1] = useReducer(reducer1, initialData1);

  return (
    <DataContext1.Provider value={{ data1, dispatch1 }}>
      {children}
    </DataContext1.Provider>
  );
};
