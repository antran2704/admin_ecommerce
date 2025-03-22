import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { ComponentType } from "react";

import { PublicLayout, PrivateLayout } from "./layout";
import AuthenGuard from "./components/Guard/AuthenGuard";

import { MainRoutes, PublicRoutes } from "./routes";
import MainComponent from "./components/Main";
import NotFoundPage from "./page/404";
import { Can } from "./context/can";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        {PublicRoutes.map((route) => {
          const Element: ComponentType = route.element;
          return (
            <Route key={route.id} path={route.href} element={<Element />} />
          );
        })}
      </Route>

      {/* Private routes */}
      <Route
        element={
          <AuthenGuard>
            <PrivateLayout />
          </AuthenGuard>
        }
      >
        {MainRoutes.map((route) => {
          const Element: ComponentType = route.element;
          return (
            <Route
              key={route.id}
              path={route.href}
              element={
                route.action && route.subject ? (
                  <Can I={route.action} a={route.subject}>
                    <Element />
                  </Can>
                ) : (
                  <Element />
                )
              }
            />
          );
        })}
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

function App() {
  return (
    <MainComponent>
      <RouterProvider router={router} />
    </MainComponent>
  );
}

export default App;
