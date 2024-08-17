import { Link } from "@remix-run/react"
import { route } from "routes-gen"

export const Navbar = () => {
    return (
    <nav className="navbar bg-base-300 rounded-xl mt-4">
        <div className="flex w-full items-center">
            <ul className="menu menu-horizontal px-1 space-x-4">
                <li><Link to={route("/dogs")}>Dog Link</Link></li>
                <li><Link to={route("/dogs/create")}>New Dog</Link></li>
            </ul>
        </div>
    </nav>
    )
}