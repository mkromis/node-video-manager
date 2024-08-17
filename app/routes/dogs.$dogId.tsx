import { MetaFunction } from "@remix-run/node";
import { Link, useParams } from "@remix-run/react";
import { route, RouteParams } from "routes-gen";

export const meta:MetaFunction = () => {
    return [{title: "Dogs Details Page"}]
}

export default function DogDetails() {
    const {dogId} = useParams<RouteParams["/dogs/:dogId"]>()

    return (
        <div className="flex flex-row space-x-12">
            <ul className="menu bg-base-100 w-56 rounded-box">
                <li>
                    <Link to={route("/dogs/:dogId/details", {
                        dogId: dogId ?? "",
                    })}>Details</Link>
                </li>
                <li>
                    <Link to={route("/dogs/:dogId/update", {
                        dogId: dogId ?? "",
                    })}>Update</Link>
                </li>
                <li className="text-red-600">
                    <Link to={route("/dogs/:dogId/remove", {
                        dogId: dogId ?? ""
                    })}>Remove</Link>
                </li>
            </ul>
        </div>
    )
}