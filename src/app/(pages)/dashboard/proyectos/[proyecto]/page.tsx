"use client"

import { Evento200 } from "@/app/components/Escenarios/Evento200/Evento200"
import { Evento250 } from "@/app/components/Escenarios/Evento250/Evento250"
import { Evento300 } from "@/app/components/Escenarios/Evento300/Evento300"
import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import { NewEvents } from "@/app/containers/Events/NewEvents"
import useApi from "@/app/hooks/fetchData/useApi"
import { Button, IconButton } from "@mui/material"
import axios from "axios"
import { ArrowLeft, ArrowLeftCircleIcon, ArrowLeftFromLine, ArrowLeftSquareIcon, Backpack, ChevronsLeft } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Swal from "sweetalert2"

export default function ProyectoId() {

    const params = useParams()
    const router = useRouter()

    const { getValues, setValue, handleSubmit, control, watch, reset } = useForm()
    const { apiCall, loading, error } = useApi()
    watch(["capacity"])

    const [info, setInfo] = useState<any>(null)

    const fetchEventId = async (id: string | string[]) => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/getEventId`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                    id: id,
                }
            });
            console.log("responseEventId: ", response?.data);
            setInfo(response?.data);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }

    useEffect(() => {
        if (params?.proyecto !== "new" && params?.proyecto !== "" && params?.proyecto !== undefined && params?.proyecto !== null) {
            fetchEventId(params?.proyecto)
        }
    }, [params?.proyecto])

    useEffect(() => {
        console.log("params?.proyecto: ", params?.proyecto)
        if (params?.proyecto !== "new") {
            reset({
                capacity: info?.capacity,
                title: info?.title,
                dateEvent: info?.dateEvent,
                flyerEvent: {
                    fileUrl: info?.urlFlyer,
                },
                precioEntradaGeneral: info?.precioEntradaGeneral,
                precioEntradaPremium: info?.precioEntradaPremium,
                precioEntradaPlatinium: info?.precioEntradaPlatinium,

                cantidadGeneral: info?.cantidadGeneral,
                cantidadPremium: info?.cantidadPremium,
                cantidadPlatinium: info?.cantidadPlatinium,

                direccion: info?.direccion,
            })
        }
    }, [info])

    const onSubmit = async (data: any) => {
        console.log(data)
        if (params?.proyecto == "new") {
            try {
                if (!getValues()?.fileEvent) return alert("Selecciona una imagen");
                const formData = new FormData();
                formData.append("image", getValues()?.fileEvent);
                const res = await axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV2}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.status == 200) {
                    console.log(res);
                    const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/newEvent`

                    const jsonSend = {
                        ...data,
                        urlFlyer: res.data.url,
                        proyecto: Apis.PROYECTCURRENT,
                    }
                    const response = await apiCall({
                        method: "post", endpoint: url, data: jsonSend, params: {
                            proyecto: Apis.PROYECTCURRENT,
                        }
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
                            router.push(`/dashboard/proyectos`)
                        }, 800);
                    }
                }
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
        else if (params?.proyecto !== "new") {
            if (getValues()?.fileEvent !== "" && getValues()?.fileEvent !== undefined && getValues()?.fileEvent !== null) {
                try {
                    // if (!getValues()?.fileEvent && !getValues(`flyerEvent`)?.fileUrl) return alert("Selecciona una imagen");
                    const formData = new FormData();
                    formData.append("image", getValues()?.fileEvent);
                    const res = await axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV2}/upload`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    if (res.status == 200) {
                        console.log(res);
                        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/patchEventId`

                        const jsonSend = {
                            ...data,
                            urlFlyer: res.data.url,
                            proyecto: Apis.PROYECTCURRENT,
                        }
                        const response = await apiCall({
                            method: "patch", endpoint: url, data: jsonSend, params: {
                                id: params?.proyecto,
                                proyecto: Apis.PROYECTCURRENT,
                            }
                        });
                        console.log("responseEventId: ", response?.data);
                        if (response?.status === 200) {
                            Swal.fire({
                                title: 'Éxito',
                                text: "Evento editado con éxito",
                                icon: 'success',
                                showConfirmButton: false,
                                timer: 3000,
                            });
                            setTimeout(() => {
                                router.push(`/dashboard/proyectos`)
                            }, 800);
                        }
                    }
                } catch (error) {
                    console.error('Error al enviar datos:', error);
                    Swal.fire({
                        title: 'Ocurrio un error1',
                        text: "Evento no editado",
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            }
            else {
                try {
                    const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/patchEventId`
                    const jsonSend = {
                        ...data,
                        proyecto: Apis.PROYECTCURRENT,
                    }
                    const response = await apiCall({
                        method: "patch", endpoint: url, data: jsonSend, params: {
                            id: params?.proyecto,
                            proyecto: Apis.PROYECTCURRENT,
                        }
                    });
                    console.log("responseEventId: ", response?.data);
                    if (response?.status === 200) {
                        Swal.fire({
                            title: 'Éxito',
                            text: "Evento editado con éxito",
                            icon: 'success',
                            showConfirmButton: false,
                            timer: 3000,
                        });
                        setTimeout(() => {
                            router.push(`/dashboard/proyectos`)
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
            }
        }
    }

    return (
        <div>
            <div className="flex justify-start items-start gap-2 ml-5 mt-2">
                <IconButton
                    size={"large"}
                    onClick={() => {
                        router.push(`/dashboard/proyectos`)
                        reset()
                    }}
                    className="!border-[#efefef] hover:!bg-[#fff]"
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
                        <h1 className="mb-5 text-xl font-bold">Nuevo Proyecto</h1>
                        <NewEvents {...{ getValues, setValue, control, apiCall }} />
                        <div className="mt-2 relative z-50">
                            <Button className="w-full" variant="contained" color="success" type="submit">
                                {params?.proyecto == "new" ? "Crear" : "Editar"}
                            </Button>
                        </div>
                        {
                            getValues()?.capacity == "200" &&
                            <div className="text-center text-4xl">
                                <Evento200 />
                            </div>
                        }
                        {
                            getValues()?.capacity == "250" &&
                            <div className="text-center text-4xl">
                                <Evento250 />
                            </div>
                        }
                        {
                            getValues()?.capacity == "300" &&
                            <div className="text-center text-4xl">
                                <Evento300 />
                            </div>
                        }
                    </form>
                </div>
            </>
        </div>
    )
}