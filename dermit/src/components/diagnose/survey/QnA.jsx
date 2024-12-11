import React from "react";
import { Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AIModelContext } from "../../../contexts/AIModelContext";
import { useMultiStepForm } from "./useMultiStepForm";
import * as Yup from "yup";
import Q1 from "./Q1";
import Q2 from "./Q2";
import Q3 from "./Q3";


// Form TO DO
// 1. Individual question is not required (list of react nodes [Q1, Q2, Q3]), render the form with json
// 2. Console log on CV is logging twice
// 3. Fix current validation -> May need to implement a state manager because there are individual radio fields i.e. 3 * 5 fields
// 


const QnA = () => {
  const navigate = useNavigate();
  const {
    formSteps,
    currentStepIndex,
    formStep,
    next,
    back,
    isFirstStep,
    isLastStep,
  } = useMultiStepForm([<Q1 />, <Q2 />, <Q3 />]);
  const { formValues, setFormValues } = useContext(AIModelContext);

  return (
    <section className="bg-blue-100 min-h-screen w-full flex items-center justify-center">
      <Formik
        initialValues={formValues}
        validationSchema={Yup.object().shape({
          formVal1: Yup.string().required("This field is required"),
          formVal2: Yup.string().required("This field is required"),
          formVal3: Yup.string().required("This field is required"),
        })}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);
          setFormValues(values);
          navigate('/diagnose/cv');
        }}
      >
        <Form>
          <div className="min-w-[45vw] bg-purple-300 h-[50vh] flex flex-col">
            <p>
              {currentStepIndex + 1} / {formSteps.length}
            </p>
            {formStep}
            <div className="space-x-2">
              <button
                disabled={isFirstStep}
                className="bg-blue-400"
                type="button"
                onClick={back}
              >
                Back
              </button>
              <button className="bg-blue-500" type="button" onClick={next}>
                {!isLastStep && "Next"}
              </button>

              <button className="bg-blue-500" type="submit">
                {isLastStep && "Submit"}
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </section>
  );
};

export default QnA;

