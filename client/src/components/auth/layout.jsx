import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center
      bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500
      px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-xl w-full space-y-8 bg-white bg-opacity-90 backdrop-blur-md p-12 rounded-3xl shadow-xl min-h-[600px]">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 drop-shadow-md">
            Welcome to Holistae
          </h1>
        </div>

        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
