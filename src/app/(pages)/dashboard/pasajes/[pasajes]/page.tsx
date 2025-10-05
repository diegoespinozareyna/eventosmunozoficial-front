"use client"

import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import { NewVisit } from "@/app/containers/pasajes/NewVisit"
import useApi from "@/app/hooks/fetchData/useApi"
import { Button, IconButton } from "@mui/material"
import axios from "axios"
import { ArrowLeft, ArrowLeftCircleIcon, ArrowLeftFromLine, ArrowLeftSquareIcon, Backpack, ChevronsLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"

export default function VisitasId() {

    const params = useParams()
    const router = useRouter()

    console.log("params?.pasajes: ", params)

    const { getValues, setValue, handleSubmit, control, watch, reset } = useForm()
    const { apiCall, loading, error } = useApi()
    watch(["capacity"])

    const [info, setInfo] = useState<any>(null)

    const fetchEventId = async (id: string | string[]) => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/getPasajesId`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    // proyecto: Apis.PROYECTCURRENT,
                    id: id,
                }
            });
            console.log("responseEventId: ", response?.data);
            setInfo(response?.data?.[0]);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }

    useEffect(() => {
        if (params?.pasajes !== "new" && params?.pasajes !== "" && params?.pasajes !== undefined && params?.pasajes !== null) {
            fetchEventId(params?.pasajes)
        }
    }, [params?.pasajes])

    useEffect(() => {
        console.log("params?.pasajes: ", params?.pasajes)
        if (params?.pasajes !== "new") {
            reset({
                titulo: info?.titulo,
                fechaVisita: info?.fechaVisita,
                destino: info?.destino, // paracas, vallehermoso, etc
                precioAsiento: info?.precioAsiento,
            })
        }
    }, [info])

    const onSubmit = async (data: any) => {
        console.log(data)
        if (params?.pasajes == "new") {
            try {
                // if (!getValues()?.fileEvent) return alert("Selecciona una imagen");
                // const formData = new FormData();
                // formData.append("image", getValues()?.fileEvent);
                // const res = await axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV2}/upload`, formData, {
                //     headers: {
                //         "Content-Type": "multipart/form-data",
                //     },
                // });
                // if (res.status == 200) {
                // console.log(res);
                const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/newPasajesAll`

                const jsonSend = {
                    ...data,
                    // urlFlyer: res.data.url,
                    // proyecto: Apis.PROYECTCURRENT,
                }
                console.log("jsonSend: ", jsonSend);
                const response = await apiCall({
                    method: "post", endpoint: url, data: jsonSend
                });
                console.log("responseEventId: ", response?.data);
                if (response?.status === 201) {
                    Swal.fire({
                        title: 'Éxito',
                        text: "Evento creado con éxito",
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                    setTimeout(() => {
                        router.push(`/dashboard/pasajes`)
                    }, 800);
                }
                // }
            } catch (error) {
                console.error('Error al enviar datos:', error);
                Swal.fire({
                    title: 'Ocurrio un error',
                    text: "Evento no creado",
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
        }
        else if (params?.pasajes !== "new") {
            // if (getValues()?.fileEvent !== "" && getValues()?.fileEvent !== undefined && getValues()?.fileEvent !== null) {
            //     try {
            //         // if (!getValues()?.fileEvent && !getValues(`flyerEvent`)?.fileUrl) return alert("Selecciona una imagen");
            //         const formData = new FormData();
            //         formData.append("image", getValues()?.fileEvent);
            //         const res = await axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV2}/upload`, formData, {
            //             headers: {
            //                 "Content-Type": "multipart/form-data",
            //             },
            //         });
            //         if (res.status == 200) {
            //             console.log(res);
            //             const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/patchEventId`

            //             const jsonSend = {
            //                 ...data,
            //                 urlFlyer: res.data.url,
            //                 proyecto: Apis.PROYECTCURRENT,
            //             }
            //             const response = await apiCall({
            //                 method: "patch", endpoint: url, data: jsonSend, params: {
            //                     id: params?.pasajes,
            //                     proyecto: Apis.PROYECTCURRENT,
            //                 }
            //             });
            //             console.log("responseEventId: ", response?.data);
            //             if (response?.status === 200) {
            //                 Swal.fire({
            //                     title: 'Éxito',
            //                     text: "Evento editado con éxito",
            //                     icon: 'success',
            //                     showConfirmButton: false,
            //                     timer: 3000,
            //                 });
            //                 setTimeout(() => {
            //                     router.push(`/dashboard/pasajes`)
            //                 }, 800);
            //             }
            //         }
            //     } catch (error) {
            //         console.error('Error al enviar datos:', error);
            //         Swal.fire({
            //             title: 'Ocurrio un error1',
            //             text: "Evento no editado",
            //             icon: 'error',
            //             showConfirmButton: false,
            //             timer: 3000,
            //         });
            //     }
            // }
            // else {
            try {
                const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/patchPasajestId`
                const jsonSend = {
                    ...data,
                    // proyecto: Apis.PROYECTCURRENT,
                }
                const response = await apiCall({
                    method: "patch", endpoint: url, data: jsonSend, params: {
                        id: params?.pasajes,
                        proyecto: Apis.PROYECTCURRENT,
                    }
                });
                console.log("responseEventId: ", response?.data);
                if (response?.status === 201) {
                    Swal.fire({
                        title: 'Éxito',
                        text: "Evento editado con éxito",
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 2000,
                    });
                    setTimeout(() => {
                        router.push(`/dashboard/pasajes`)
                    }, 800);
                }
            } catch (error) {
                console.error('Error al enviar datos:', error);
                Swal.fire({
                    title: 'Ocurrio un error2',
                    text: "Evento no editado",
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000,
                });
            }
            // }
        }
    }

    return (
        <div>
            <div className="flex justify-start items-start gap-2 ml-5 mt-2">
                <IconButton
                    size={"large"}
                    onClick={() => {
                        router.push(`/dashboard/pasajes`)
                        reset()
                    }}
                    className="!border-[#efefef] hover:!bg-[#00f]"
                >
                    <div className="-ml-[2px]">
                        <ChevronsLeft
                            color={"#1976d2"}
                        />
                    </div>
                </IconButton>

            </div>
            <>
                <div className="w-[calc(100vw-65px)] h-[calc(100vh-50px)] overflow-y-auto flex flex-col gap-2 pl-3 pt-2 justify-start  items-center">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-3/4 border-1 border-gray-100 rounded-md px-3 py-3 shadow-md mb-3">
                        <h1 className="mb-5 text-xl font-bold">Nueva Visita</h1>
                        <NewVisit {...{ getValues, setValue, control, apiCall }} />
                        <div className="mt-2 relative z-50">
                            <Button className="w-full" variant="contained" color="success" type="submit">
                                {params?.pasajes == "new" ? "Crear" : "Editar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </>
        </div>
    )
}