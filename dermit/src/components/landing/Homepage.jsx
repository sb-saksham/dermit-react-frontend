import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

export default function Conversations() {
  const { user, authAxios } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [convers, setConvers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchConvers() {
      const res = await fetch("http://127.0.0.1:8000/api/conversations/", {
        headers: {
          Authorization: `Token ${user?.token}`,
        },  
      });
      const data = await res.json();
      setConvers(data);
    }
    fetchConvers();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: ""
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { name } = values;
      const res = await authAxios.post(`conversations/`, { name });
      if (res.error && res.data) {
        if (res.data && res.data.detail) {
          setError(res.data.detail);
        }
      } else {
        navigate(`/chats/${res.data.id}/`);
      }
      setSubmitting(false);
    }
  });

  return (
    <div className="container grid p-3">
      <div className="grid-cols-4 gap-4 mb-12">
        <h2 className="text-lg">Your Previous Conversations: </h2>
        {convers
          .map((c, i) => (
            <Link
              key={c.id}
              to={`chats/${c.id}`}
            >
              <div>{i+1}. {c.name}</div>
            </Link>
          ))}
      </div>
      <hr/>
      <div className="w-64 grid-cols-4 gap-4 mt-6">
        <h2 className="text-lg">Create New Converations</h2>
        <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
          {error && <div>{JSON.stringify(error)}</div>}
 
          <div className="-space-y-px rounded-md">
            <input
              value={formik.values.name}
              onChange={formik.handleChange}
              type="text"
              name="name"
              placeholder="Conversation Title"
              className="border-gray-300 text-gray-900 placeholder-gray-300 focus:ring-gray-500 focus:border-gray-500 block w-full pr-10 focus:outline-none sm:text-sm rounded-md"
            />
          </div>
 
          <button
            disabled={formik.isSubmitting}
            type="submit"
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-sky-600 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            {formik.isSubmitting ? "Creating New Conversation..." : "Create New Conversation"}
          </button>
        </form>
      </div>
    </div>
  );
}