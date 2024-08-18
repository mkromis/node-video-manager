import { json, ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { eq } from "drizzle-orm";
import { ValidatedForm, validationError } from "remix-validated-form";
import { route, RouteParams } from "routes-gen";
import { z } from "zod";
import { Input } from "~/components/Input";
import { db } from "~/db/config.server";
import { dogs } from "~/db/schema.server";

const validator = withZod(
    z.object({
        name: z.string().min(1).max(34),
        breed: z.string().min(1).max(34),
    })
)

export const loader = ({ params }: LoaderFunctionArgs) => {
    const { dogId} = params as RouteParams["/dogs/:dogId/update"]

    const { id, ...rest} = db
        .select()
        .from(dogs)
        .where(eq(dogs.id, Number(dogId)))
        .get()

    return json({ defaultValues: rest})
}

export const action = async({request, params}:ActionFunctionArgs) => {
    const fieldValues = await validator.validate(await request.formData())
    const {dogId} = params as RouteParams["/dogs/:dogId/update"]

    if (fieldValues.error) {
        return validationError(fieldValues.error);
    }

    db.update(dogs)
        .set(fieldValues.data)
        .where(eq(dogs.id, Number(dogId)))
        .run()

    return redirect(route("/dogs"))
}

export default function DogDetailsUpdate() {
    const {defaultValues} = useLoaderData<typeof loader>()

    return (
        <div>
            <h2 className="mb-5 text-xl">Update doggo entry</h2>

            <ValidatedForm
                className="space-y-6"
                method="POST"
                validator={validator}
                defaultValues={defaultValues}
            >
                <Input name="name" label="Name" placeholder="Your doggo's name..." />
                <Input name="breed" label="Breed" placeholder="Your doggo's breed..."/>
                <button className="btn btn-accent" type="submit">Update</button>
            </ValidatedForm>
        </div>
    )
}