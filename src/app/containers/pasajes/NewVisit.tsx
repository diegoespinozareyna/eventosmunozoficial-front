import { formCrearUsuario, formCrearVisita } from "@/app/configs/dataforms/dataForms";
import { Apis } from "@/app/configs/proyecto/proyectCurrent";
import { handleApiReniec } from "@/app/functions/handleApiReniec";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import moment from "moment-timezone";
import { Controller } from "react-hook-form";
import { IoMdEye } from "react-icons/io";

export const NewVisit = ({ getValues, setValue, control, apiCall }: any) => {

    return (
        <>
            <div className="flex flex-col gap-3">
                {
                    formCrearVisita?.map((item: any, index: any) => {
                        return (
                            <div key={index}>
                                {
                                    (item.type === "text" || item.type === "number" || item.type === "date") &&
                                    <div key={index} className="mt-0">
                                        <Controller
                                            key={index}
                                            name={`${item?.name}`}
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    label={item.label}
                                                    variant="outlined"
                                                    size="small"
                                                    type={item.type === "date" ? "date" : "text"}
                                                    fullWidth
                                                    // disabled={item.disabled}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    required={item.required}
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
                                    <div key={index} className="mt-0">
                                        <Controller
                                            name={`${item.name}`}
                                            control={control}
                                            rules={item.required ? { required: `${item.label} es obligatorio` } : {}}
                                            render={({ field, fieldState }) => (
                                                <Autocomplete
                                                    options={Apis?.SEDES_VISITA_BUS ?? item.options}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    value={(Apis?.SEDES_VISITA_BUS ?? item.options).find((opt: any) => opt.value === field.value) || null}
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
                                {
                                    item.type == "file" &&
                                    <div key={index}>
                                        <Controller
                                            name={item.name}
                                            control={control}
                                            rules={{
                                                validate: (value) => {
                                                    if (item?.required) {
                                                        if (!value || !value.file) return `${item?.label} es obligatorio`;
                                                    }
                                                    return true;
                                                }
                                            }}
                                            render={({ field, fieldState }) => (
                                                <div className="flex flex-row gap-2 justify-start items-start">
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        // disabled={row?.status !== SendStatus?.APPROVED}
                                                        style={{ textTransform: "none" }}
                                                    >
                                                        Seleccionar Imagen de Flyer
                                                        <input
                                                            type="file"
                                                            accept="image/*,application/pdf"
                                                            hidden
                                                            onChange={(e: any) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const fileUrl = URL.createObjectURL(file); // Crear URL para previsualización
                                                                    field.onChange({ file, fileUrl }); // Guardar archivo y URL en el campo
                                                                }
                                                                setValue("fileEvent", e.target.files[0]);
                                                            }}
                                                        />
                                                    </Button>

                                                    {getValues(`${item.name}`) !== "" && getValues(`${item.name}`) !== undefined && getValues(`${item.name}`) !== null && (
                                                        <IconButton
                                                            onClick={() => window.open(getValues(`${item.name}`)?.fileUrl, "_blank")}
                                                            color="primary"
                                                            aria-label="Ver imagen"
                                                        >
                                                            <IoMdEye />
                                                        </IconButton>
                                                    )}

                                                    {/* Mensaje de error si no hay archivo */}
                                                    {fieldState.error && (
                                                        <span style={{ color: "red", fontSize: "0.8rem" }}>{fieldState.error.message}</span>
                                                    )}
                                                </div>
                                            )}
                                        />
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}