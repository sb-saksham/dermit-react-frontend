import { createContext, useState } from "react";


export const AIModelContext = createContext();

export const AIModelContextProvider = ({ children }) => {
  const [formValues, setFormValues] = useState({
    formVal1: "",
    formVal2: "",
    formVal3: "",
  });

  const [CVValue, setCVValue] = useState({
    symptom1: "acne",
    symptom2: "acne 2",
    symptom3: "acne 3",
  });

  return (
    <AIModelContext.Provider value={{ formValues, setFormValues, CVValue, setCVValue }}>
      {children}
    </AIModelContext.Provider>
  );
};
