import React from 'react'
import { useContext } from "react";
import { AIModelContext } from "../../../contexts/AIModelContext";
import { useNavigate } from "react-router-dom";

const CvTest = () => {
  const navigate = useNavigate();
  const { formValues, setFormValues } = useContext(AIModelContext);
  console.log(formValues);
  return (
    <div>
      CV
    </div>
  )
}

export default CvTest