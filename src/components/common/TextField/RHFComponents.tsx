import { useFormContext, Controller } from "react-hook-form";
import TextField from "@/components/common/TextField/TextField";
import TextArea from "@/components/common/TextField/TextArea";
import AutoComplete from "@/components/common/AutoComplete/AutoComplete";

export const RHFTextField = ({ name, placeholder, props, disabled }: any) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, name } }) => (
                <TextField
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    props={props}
                    disabled={disabled}
                />
            )}
        />
    );
};

export const RHFTextArea = ({ name, placeholder, props, disabled }: any) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, name } }) => (
                <TextArea
                    name={name}
                    value={value ?? ""}
                    onChange={onChange}
                    placeholder={placeholder}
                    props={props}
                    disabled={disabled}
                />
            )}
        />
    );
};

export const RHFAutoComplete = ({ name, options, placeholder, props, className, getOptionLabel, isOptionEqualToValue, onChangeCallback, disabled }: any) => {
    const { control } = useFormContext();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value } }) => (
                <AutoComplete
                    className={className}
                    options={options}
                    value={value ?? null}
                    onChange={(_, newValue) => {
                        onChange(newValue);
                        if (onChangeCallback) onChangeCallback(newValue);
                    }}
                    placeholder={placeholder}
                    props={props}
                    disabled={disabled}
                    getOptionLabel={getOptionLabel}
                    isOptionEqualToValue={isOptionEqualToValue}
                />
            )}
        />
    );
};
