import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm, validationError } from "remix-validated-form";
import { route } from "routes-gen";
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

export const loader = () => {
    return json({
        defaultValues: {
            name: "qwerty",
            breed: "kitsune"
        }
    })
}

export const action = async ({params, request}: ActionFunctionArgs) => {
    console.log(params)
    const fieldValues = await validator.validate(request.formData)
    if (fieldValues.error) return validationError(fieldValues.error)

    try {
        db.insert(dogs).values(fieldValues.data).run();
    } catch (error) {
        console.log(error)
    }
    return redirect(route("/dogs"))
}

export default function DogInsertion() {
    const {defaultValues} = useLoaderData<typeof loader>()

    return (
        <div>
            <div className="mb-8">
                <h2 className="mb-2 text-xl">Add a new doggo</h2>
                <p className="text-grey-600">Listen, every doggo is a good boy/girl.</p>
            </div>

            <ValidatedForm
                className="space-y-6"
                method="post"
                validator={validator}
                defaultValues={defaultValues}
            >
                <Input name="name" label="Name" placeholder="Your doggo's name..." />
                <Input name="breed" label="Breed" placeholder="Your doggo's breed..." />

                <button className="btn btn-accent" type="submit">
                    Submit
                </button>
            </ValidatedForm>
        </div>
    )
}