import { dataComprarTicket } from "@/app/configs/dataforms/dataForms";
import { handleApiReniec } from "@/app/functions/handleApiReniec";
import { Autocomplete, TextField } from "@mui/material";
import moment from "moment-timezone";
import { Controller } from "react-hook-form";

export const FormComprarTicket = ({ getValues, setValue, handleSubmit, control, apiCall, loading, error }: any) => {

    return (
        <>
            <div className="flex flex-col gap-3">
                {
                    dataComprarTicket?.map((item: any, index: any) => {
                        return (
                            <>
                                {
                                    (item.type === "text" || item.type === "number" || item.type === "date") &&
                                    <div className="mt-0">
                                        <Controller
                                            key={index}
                                            name={`${item.name}`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label={item.label}
                                                    variant="outlined"
                                                    size="small"
                                                    type={item.type === "date" ? "datetime-local" : "text"}
                                                    fullWidth
                                                    // disabled={item.disabled}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={(e) => {
                                                        let value = e.target.value;
                                                        if (item.type === "date") {
                                                            // Convertir valor del input a zona horaria "America/Lima"
                                                            const limaTime = moment.tz(value, "YYYY-MM-DDTHH:mm", "America/Lima");
                                                            field.onChange(limaTime.format()); // ISO string con zona Lima (sin Z al final)
                                                        } else if (item.name === "documentoUsuario") {
                                                            value = value.replace(/[^0-9.,]/g, "");// Permite solo números
                                                            if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                                            if (value.length === 8) {
                                                                console.log("reniec");
                                                                handleApiReniec(value, "dniCliente", setValue, apiCall, "0");
                                                            }
                                                        } else if (item?.type === "number") {
                                                            value = value.replace(/[^0-9.,]/g, "");// Solo números positivos
                                                            if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                                        }

                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                    </div>
                                }
                                {
                                    item.type === "select" &&
                                    <div className="mt-0">
                                        <Controller
                                            name={`${item.name}`}
                                            control={control}
                                            rules={item.required ? { required: `${item.label} es obligatorio` } : {}}
                                            render={({ field, fieldState }) => (
                                                <Autocomplete
                                                    options={item.options}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    value={item.options.find((opt: any) => opt.value === field.value) || null}
                                                    onChange={(_, selectedOption) => {
                                                        field.onChange(selectedOption?.value ?? null);
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            // disabled={item.disabled}
                                                            label={item.label}
                                                            margin="dense"
                                                            fullWidth
                                                            error={!!fieldState.error}
                                                            helperText={fieldState.error ? fieldState.error.message : ""}
                                                        />
                                                    )}
                                                />
                                            )}
                                        />
                                    </div>
                                }
                            </>
                        )
                    })
                }
            </div>
        </>
    )
}