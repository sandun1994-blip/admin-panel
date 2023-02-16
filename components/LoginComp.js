import Layout from "components/Layout";
import { withPublic } from "hooks/route";
import Link from "next/link";
import { useForm } from "react-hook-form";

function LoginComp({ auth }) {
  const {
    signWithEmailandPW
  } = auth;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    signWithEmailandPW(email, password);
  };

 

  return (
   
      <div className="login flex flex-col h-screen justify-center items-center">
        <div className="login-form">
          <form
            action="#"
            className="space-y-4 md:space-y-6"
            onSubmit={handleSubmit(submitHandler)}
          >
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 w-96 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block p-4"
                placeholder="name@email.com"
                required={true}
                autoFocus
                {...register("email", {
                  required: "Please enter email",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: "Please enter valid email",
                  },
                })}
              />
              {errors.email && (
                <div className="text-red-500">{errors.email.message}</div>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded focus:ring-primary-600 focus:border-primary-600 block w-full p-4"
                required=""
                {...register("password", {
                  required: "Please enter password",
                  minLength: {
                    value: 6,
                    message: "password is more than 5 chars",
                  },
                })}
              />
              {errors.password && (
                <div className="text-red-500 ">{errors.password.message}</div>
              )}
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  aria-describedby="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                  required=""
                />
              </div>
             
            </div>
            <button
              type="submit"
              className="w-96 text-white bg-indigo-600 hover:bg-indigo-500 focus:ring-4 transition duration-300 focus:outline-none focus:ring-lit-blue font-medium rounded text-sm px-5 py-4 text-cente"
            >
              Login
            </button>
            
          </form>
        </div>
        
      </div>
   
  );
}

export default withPublic(LoginComp);
