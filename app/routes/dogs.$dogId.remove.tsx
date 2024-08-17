import { ActionFunctionArgs } from "@remix-run/node"
import { Form, redirect } from "@remix-run/react"
import { eq } from "drizzle-orm"
import { route, RouteParams } from "routes-gen"
import { db } from "~/db/config.server"
import { dogs } from "~/db/schema.server"

export const action = async ({params}:ActionFunctionArgs) => {
    const {dogId} = params as RouteParams["/dogs/:dogId/remove"]

    db.delete(dogs)
        .where(eq(dogs.id, Number(dogId)))
        .run()

    return redirect(route("/dogs"))
}

export default function DogDetailsRemove() {
    return (
        <div>
            <label htmlFor="my-modal-6" className="btn btn-wide">Delete</label>

            <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Delete Database Entry</h3>
                    <p className="modal-action">
                        <Form method="POST">
                            <input type="hidden" name="_method" value="delete" />
                            <button className="btn">Yes</button>
                        </Form>
                    </p>
                </div>
            </div>
        </div>
    )
}