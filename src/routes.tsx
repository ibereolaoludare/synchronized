import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
export const router = createBrowserRouter([
    {
        path: "/" ,
        async lazy() {
            const Home = (await import("./pages/HomePage.tsx")).default;
            return {
                Component: Home,
            };
        },
        errorElement: <ErrorPage />,
    },    {
        path: "/catalog" ,
        async lazy() {
            const Catalog = (await import("./pages/CatalogPage.tsx")).default;
            return {
                Component: Catalog,
            };
        },
        errorElement: <ErrorPage />,
    }
]);
