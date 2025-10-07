import { dataCambiarStatusAsiento, dataComprarAsientos, dataComprarTicket, dataComprarTicketPasarela } from "@/app/configs/dataforms/dataForms";
import { Apis } from "@/app/configs/proyecto/proyectCurrent";
import { handleApiReniec } from "@/app/functions/handleApiReniec";
import { Autocomplete, Button, CircularProgress, IconButton, TextField } from "@mui/material";
import { X } from "lucide-react";
import moment from "moment-timezone";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { IoMdEye } from "react-icons/io";

export const FormComprarTicket = ({ getValues, setValue, handleSubmit, control, apiCall }: any) => {

    console.log("getValues uduario antiguo: ", getValues("UsuarioAntiguo"));
    const userOld = getValues("UsuarioAntiguo");

    const [inputValues, setInputValues] = useState<Record<string, string>>({});


    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // 🔍 Buscar en el backend cada vez que el usuario escribe
    const handleSearch = async (query: any) => {
        setLoading(true);
        try {
            const res = await fetch(`${Apis.URL_APOIMENT_BACKEND_DEV}/api/users/getPatrocinadoresUnique`);
            const data = await res.json();
            setOptions(data.users); // tu backend debe retornar `users`
        } catch (err) {
            console.error("Error al buscar usuarios:", err);
        } finally {
            setLoading(false);
        }
    };

    console.log("getValues cambiarStatusAsiento: ", getValues()?.cambiarStatusAsiento)

    return (
        <>
            <div className="flex flex-col gap-3">
                {
                    (getValues()?.comprarAsientos == true ? dataComprarAsientos : getValues()?.cambiarStatusAsiento == true ? dataCambiarStatusAsiento : getValues()?.siPasarelaPay == true && getValues()?.cambiarStatusAsiento !== true ? dataComprarTicketPasarela : getValues()?.siPasarelaPay == false && getValues()?.cambiarStatusAsiento !== true ? dataComprarTicket : dataComprarTicket)?.map((item: any, index: any) => {
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
                                                    required={item.required}
                                                    disabled={item.disabled === true ? true : false}
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
                                                    options={getValues()?.usersPatrocinadores ?? item.options}
                                                    getOptionLabel={(option) => option.label}
                                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                                    value={getValues()?.usersPatrocinadores?.find((opt: any) => opt.value === field.value) || null}
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
                                    item.type === "selectSpecial" &&
                                    <div className="mt-0">
                                        <Controller
                                            name={item.name}
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={options}
                                                    getOptionLabel={(option) =>
                                                        typeof option === "string"
                                                            ? option
                                                            : `${option.nombres ?? ""} ${option.apellidoPaterno ?? ""} ${option.apellidoMaterno ?? ""} - ${option.documentoUsuario ?? ""}`
                                                    }
                                                    isOptionEqualToValue={(opt, val) => opt._id === val._id}
                                                    value={field.value || null}
                                                    inputValue={inputValue}
                                                    onInputChange={(_, newInputValue) => {
                                                        setInputValue(newInputValue);
                                                        if (newInputValue.length >= 3) {
                                                            handleSearch(newInputValue);
                                                        }
                                                    }}
                                                    onChange={(_, newValue) => {
                                                        field.onChange(newValue);
                                                        if (newValue) {
                                                            setInputValue(
                                                                `${newValue.nombres ?? ""} ${newValue.apellidoPaterno ?? ""} ${newValue.apellidoMaterno ?? ""}`
                                                            );
                                                            setOptions([newValue]);
                                                        } else {
                                                            setInputValue("");
                                                        }
                                                    }}
                                                    loading={loading}
                                                    filterOptions={(x) => x} // evitamos el filtrado interno
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Patrocinador o Referido"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <>
                                                                        {loading && <CircularProgress size={20} />}
                                                                        {params.InputProps.endAdornment}
                                                                    </>
                                                                ),
                                                            }}
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
                                                <div className="flex flex-col gap-1 justify-start items-start">
                                                    <div>
                                                        <Button
                                                            variant="contained"
                                                            component="label"
                                                            style={{ textTransform: "none" }}
                                                        >
                                                            {"Seleccionar Voucher (Obligatorio)"}
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
                                                    </div>

                                                    {getValues(`${item.name}`) !== "" && getValues(`${item.name}`) !== undefined && getValues(`${item.name}`) !== null && (
                                                        <>
                                                            <>
                                                                <div
                                                                    className="relative z-50 cursor-pointer"
                                                                    onClick={() => {
                                                                        // setPreviewUrl(null)
                                                                        setValue(`${item.name}`, null);
                                                                    }}
                                                                >
                                                                    <X color="red" size={20} />
                                                                </div>
                                                            </>
                                                            <div
                                                                className="cursor-pointer"
                                                                onClick={() => window.open(getValues(`${item.name}`)?.fileUrl ?? getValues(`${item.name}`), "_blank")}
                                                            >
                                                                <img
                                                                    src={getValues(`${item.name}`)?.fileUrl}
                                                                    alt="Vista previa"
                                                                    style={{ width: 100, height: "auto", marginTop: 8, borderRadius: 4 }}
                                                                />
                                                            </div>
                                                        </>
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
                            </>
                        )
                    })
                }
            </div>
        </>
    )
}