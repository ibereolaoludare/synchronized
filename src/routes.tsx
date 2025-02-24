import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.tsx";
export const router = createBrowserRouter([
    {
        path: "/",
        async lazy() {
            const Home = (await import("./pages/HomePage.tsx")).default;
            return {
                Component: Home,
            };
        },
        errorElement: <ErrorPage />,
    },
    {
        path: "/catalog",
        async lazy() {
            const Catalog = (await import("./pages/CatalogPage.tsx")).default;
            return {
                Component: Catalog,
            };
        },
        errorElement: <ErrorPage />,
    },
    {
        path: "/contact",
        async lazy() {
            const Contact = (await import("./pages/ContactPage.tsx")).default;
            return {
                Component: Contact,
            };
        },
        errorElement: <ErrorPage />,
    },
    {
        path: "/admin",
        async lazy() {
            const Admin = (await import("./pages/AdminPage.tsx")).default;
            return {
                Component: Admin,
            };
        },
        errorElement: <ErrorPage />,
    },{
        path: "/dashboard",
        async lazy() {
            const Dashboard = (await import("./pages/DashboardPage.tsx")).default;
            return {
                Component: Dashboard,
            };
        },
        errorElement: <ErrorPage />,
    },
]);
