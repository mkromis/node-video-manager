import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css?url" // explicit import
import { Navbar } from "./components/Navbar";

export const meta: MetaFunction = () => [
  { charSet: "utf-8"},
  { viewport: "width=device-width, initial-scale=1"},
  { title: "Doggo Tutorial"},
]

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet}
]

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
