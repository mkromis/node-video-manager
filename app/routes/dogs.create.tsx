import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { route } from "routes-gen";
import { z } from "zod";
import { db } from "~/db/config.server";
import { dogs } from "~/db/schema.server";

// const validator = withZod(
//     z.object({
//         name: z.string().min(1).max(34),
//         breed: z.string().min(1).max(34),
//     })
// )

export const loader = () => {
    return json({
        defaultValues: {
            name: "qwerty",
            breed: "kitsune"
        }
    })
}

export const action = async ({params, request}: ActionFunctionArgs) => {
    const formData = await request.formData()
    const name = String(formData.get("name"))
    const breed = String(formData.get("breed"))

    // Track for parsing errors
    const errors = {}

    // Track errors
    if (name.length == 0 || name.length > 34) {
        errors.name = "Invalid dog name";
    }

    if (breed.length == 0 || breed.length > 34) {
        errors.breed = "Invalid dog name";
    }

    if (Object.keys(errors).length > 0) {
        return json({errors})
    }
    
    try {
        db.insert(dogs).values({
            name, breed
        }).run();
    } catch (error) {
        console.log(error)
    }
    return redirect(route("/dogs"))
}

export default function DogInsertion() {
    const {defaultValues} = useLoaderData<typeof loader>()
    // const form = useForm({validator});

    return (
        <div>
            <div className="mb-8">
                <h2 className="mb-2 text-xl">Add a new doggo</h2>
                <p className="text-grey-600">Listen, every doggo is a good boy/girl.</p>
            </div>

            <Form 
                className="space-y-6"
                method="post">

                <span className="flex flex-col">
                    <label className="mb-3">Name</label>
                    <input name="name" className="input input-bordered, w-full, max-w-xs" />
                    {/* {error && <span className="label-text-alt mt-3">{error}</span>} */}
                </span>
                <span className="flex flex-col">
                    <label className="mb-3">Breed</label>
                    <input name="breed" className="input input-bordered, w-full, max-w-xs" />
                    {/* {error && <span className="label-text-alt mt-3">{error}</span>} */}
                </span>

                {/* <Input name="name" label="Name" placeholder="Your doggo's name..." />
                <Input name="breed" label="Breed" placeholder="Your doggo's breed..." /> */}

                <button className="btn btn-accent" type="submit">Submit</button>
            </Form>
        </div>
    )
}