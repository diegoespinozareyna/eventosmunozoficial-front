import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { Controller, useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import { IoMdArrowRoundBack } from "react-icons/io";
import Swal from 'sweetalert2';
import { Autocomplete, Button, TextField } from "@mui/material";
import moment from 'moment-timezone';
import { formLogin } from '@/app/configs/dataforms/dataForms';
import { handleApiReniec } from '@/app/functions/handleApiReniec';

export const LoginForm = ({ handleSubmit, apiCall, onSubmit, getValues, setValue, control, loading }: any) => {
  return (
    <div
      // id='fondo-oro-verde' 
      className="w-full min-h-screen flex items-center justify-center !bg-oro-radial p-4 relative overflow-hidden bg-[#8dc5eb]"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div
          // id='fondo-oro-verde' 
          className="shadow-2xl rounded-lg overflow-hidden bg-[#79b1d6]"
        >
          <div className="p-8 relative">
            <div className="text-center mb-8">
              <div className='rounded-full overflow-hidden relative z-50 flex justify-center items-center mb-4'>
                <div className='rounded-full overflow-hidden relative z-50 flex'>
                  <img
                    src={"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logosinfondo-EglD0O3xz0n42RcG4LzJodIqwwEehL.jpg"}
                    alt="Inmobiliaria Muñoz Logo"
                    className="h-56 mx-auto relative z-10"
                  />
                </div>
              </div>
              <h2 className="text-xl font-bold text-gray-800">Bienvenido a</h2>
              <h2 className="text-2xl font-bold text-yellow-500">{"Eventos Muñoz"}</h2>
              <p className="text-gray-600">Acceda a su cuenta exclusiva</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col justify-center items-center gap-2 w-full">
                {
                  formLogin?.map((item: any, index: any) => {
                    return (
                      <>
                        {
                          (item.type === "text" || item.type === "number" || item.type === "date" || item.type === "password") &&
                          <div key={item.id} className="mt-1 w-full">
                            <div className="flex flex-col justify-start items-start gap-0 w-full">
                              <div className="uppercase text-sm font-bold text-white">{item.label}</div>
                              <Controller
                                name={`${item.name}`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    // label={item.label}
                                    variant="outlined"
                                    size="small"
                                    defaultValue={item.type === "date" ? moment.tz("America/Lima").format("YYYY-MM-DDTHH:mm") : ""}
                                    disabled={item.disabled}
                                    required={item.required}
                                    type={item.type === "date" ? "datetime-local" : item.type}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    multiline={item.multiline}
                                    minRows={item.rows}
                                    className="w-full"
                                    onChange={(e: any) => {
                                      let value = e.target.value;
                                      if (item.type === "date") {
                                        // Convertir valor del input a zona horaria "America/Lima"
                                        const limaTime = moment.tz(value, "YYYY-MM-DDTHH:mm", "America/Lima");
                                        field.onChange(limaTime.format()); // ISO string con zona Lima (sin Z al final)
                                      } else if (item.name === "documentoCliente") {
                                        value = value.replace(/[^0-9.,]/g, "");// Permite solo números
                                        if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                        if (value.length === 8) {
                                          console.log("reniec");
                                          handleApiReniec(value, "dniCliente", setValue, apiCall, "0");
                                        }
                                      } else if (item?.type === "number") {
                                        value = value.replace(/(?!^)-|[^0-9.,-]/g, "");// positivos y negativos
                                        if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                        // setChange(!change)
                                        if (item.name === "precioUnitario") {
                                          // Si es el campo precio, actualizamos el valor en el array
                                          setValue(`precioVenta`, (Number(getValues(`cantidad`)) ?? 0) * (Number(value) ?? 0));
                                        }
                                        else if (item.name === "cantidad") {
                                          // Si es el campo precio, actualizamos el valor en el array
                                          setValue(`precioVenta`, (Number(getValues(`precioUnitario`)) ?? 0) * (Number(value) ?? 0));
                                        }
                                      }
                                      // setChange(!change)
                                      field.onChange(value);
                                    }}
                                  />
                                )}
                              />
                            </div>
                          </div>
                        }
                        {
                          item.type === "select" && item.name === "nombreProducto" &&
                          <div key={item.id} className="mt-2 w-5/12">
                            <Controller
                              name={`${item.name}`}
                              control={control}
                              rules={item.required ? { required: `${item.label} es obligatorio` } : {}}
                              render={({ field, fieldState }) => (
                                <Autocomplete
                                  disabled={(item.disabled)}
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
                                      disabled={(item.disabled)}
                                      label={item.label}
                                      margin="dense"
                                      fullWidth
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
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
              </div >
              <Button disabled={loading} loading={loading} sx={{ width: "100%" }} variant="contained" color="primary" type="submit">
                Acceder
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}