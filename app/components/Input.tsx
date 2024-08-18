import type { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
}

export const Input: FC<InputProps> = ({ name, label, ...rest}) => {
    const { error, getInputProps} = useField(name);

    return (
        <span className="flex flex-col">
            <label htmlFor={name} className="mb-3">
                {label}
            </label>
            <input
                className="input input-bordered, w-full, max-w-xs"
                {...rest}
                {...getInputProps({ id: name})}
            />

            {error && <span className="label-text-alt mt-3">{error}</span>}
        </span>
    )
}