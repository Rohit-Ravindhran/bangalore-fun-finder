
import React from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-w2d-cream">
      <div className="text-center">
        <div className="mb-6 text-6xl">🙁</div>
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl text-gray-600 mb-8">
          We couldn't find what you're looking for
        </p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          <button className="bg-w2d-teal text-white py-2 px-6 rounded-full shadow hover:bg-opacity-90 transition-all">
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
