import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { route } from "routes-gen"
import { db } from "~/db/config.server"
import { dogs } from "~/db/schema.server"

export const loader = () => {
    const result = db.select().from(dogs).all()
    return json(result)
}

export default function DogList() {
    const data = useLoaderData<typeof loader>()
    return (
        <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Breed</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((item) => (
                        <tr key={item.id}>
                        <th>
                            <Link to={route("/dogs/:dogId", {
                                dogId: item.id.toString(),
                            })}><kbd className="kbd">{item.id}</kbd></Link>
                        </th>
                        <td>{item.name}</td>
                        <td>{item.breed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}