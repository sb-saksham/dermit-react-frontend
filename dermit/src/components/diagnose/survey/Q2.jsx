import React from "react";
import { Field, ErrorMessage , Formik } from "formik";
const Q2 = () => {
  return (
    <>
      <div id="my-radio-group">Question 1</div>
      <div role="group" className="flex flex-col bg-orange-300">
        <label>
          <Field type="radio" name="formVal2" value="One" />
          One
        </label>
        <label>
          <Field type="radio" name="formVal2" value="Two" />
          Two
        </label>
        <label>
          <Field type="radio" name="formVal2" value="Three" />
          Three
        </label>
        <label>
          <Field type="radio" name="formVal2" value="Four" />
          Four
        </label>
        <ErrorMessage name="formVal2" component="div" className="error" />
      </div>
    </>
  );
};

export default Q2;