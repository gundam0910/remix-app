import {
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";

import stylesheet from "./tailwind.css?url";
import globalStyle from "./global.css?url";
import Nav from "./components/navigation";
import { getToast } from "remix-toast";
import { useEffect } from "react";
import { ToastContainer, toast as notify } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  { rel: "stylesheet", href: globalStyle },
  { rel: "stylesheet", href: stylesheet },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

if (typeof window !== "undefined") {
  injectStyle();
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { toast, headers } = await getToast(request);
  return json({ toast }, { headers });
};

const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-600",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { toast } = useLoaderData<typeof loader>();
  // Hook to show the toasts
  useEffect(() => {
    if (toast?.type === "error") {
      notify.error(toast.message);
    }
    if (toast?.type === "success") {
      notify.dark(toast.message);
    }
  }, [toast]);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Nav />
        <main className="p-5">
          <div className="container mx-auto px-4">
            <ToastContainer
              toastClassName={(context) =>
                contextClass[context?.type || "default"] +
                " relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"
              }
              bodyClassName={() => "text-sm font-white font-med block p-3"}
              position="top-right"
              autoClose={3000}
               />
            {children}
          </div>
          </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
