import React from "react";
import { Route, Redirect } from "react-router-dom";
import { readCookie } from "./readCookie";
function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = readCookie('token');

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="login" />
      }
    />
  );
}

export default ProtectedRoute;
