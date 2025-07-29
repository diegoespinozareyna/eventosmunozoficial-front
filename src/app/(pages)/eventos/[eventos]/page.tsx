"use client"

import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import useApi from "@/app/hooks/fetchData/useApi"
import { Button } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import "./styleButton.css"
import { Evento200Sale } from "@/app/components/Escenarios/Evento200/Evento200Sale"
import { Evento250Sale } from "@/app/components/Escenarios/Evento250/Evento250Sale"
import { Evento300Sale } from "@/app/components/Escenarios/Evento300/Evento300Sale"
import Swal from "sweetalert2"
import { StatusLotes } from "@/app/configs/proyecto/statusLotes"
import { ChevronsLeft, X } from "lucide-react"
import { changeDecimales } from "@/app/functions/changeDecimales"

export default function Eventos() {

    const params: any = useParams()
    const router = useRouter()

    const { getValues, setValue, handleSubmit, control, watch, reset } = useForm()
    const { apiCall, loading, error } = useApi()
    watch(["capacity"])

    const [openAsientos, setOpenAsientos] = useState(false)

    const [info, setInfo] = useState<any>(null)
    const [open, setOpen] = useState(false)
    const [dataAsientos, setDataAsientos] = useState<any>(null)

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
        if (params?.eventos !== "new" && params?.eventos !== "" && params?.eventos !== undefined && params?.eventos !== null) {
            fetchEventId(params?.eventos?.split("-")[1])
        }
    }, [params?.eventos])

    const handleClickInformation = async (id: any, valueBoolean: boolean) => {
        console.log('Click en la información', id);
        console.log('Click en la valueBoolean', valueBoolean);
        setDataAsientos(
            {
                id: id,
                precio: "40"
            }
        )

        // const resp = await fetchPropiedades()
        // console.log("resp", resp)
        // const propUnique = resp?.data?.find(x => x.codLote === id)
        // setValue("propUniquePlano", propUnique)
        // console.log("propUnique", propUnique?.status)
        // console.log("propUnique2", propUnique?.documentoAsesor)
        // console.log("propUnique3", getValues()?.documentoAsesor)

        // if (
        //     (propUnique?.status === StatusLotes.STATUS_DISPONIBLE)
        //     ||
        //     (
        //         (
        //             (propUnique?.status === StatusLotes.STATUS_VENDIDO_CONTADO) ||
        //             (propUnique?.status === StatusLotes.STATUS_RESERVADO) ||
        //             (propUnique?.status === StatusLotes.STATUS_DISPONIBLE)
        //         )
        //         &&
        //         (
        //             (propUnique?.documentoAsesor == getValues()?.documentoAsesor) ||
        //             (user?.role == "admin") ||
        //             (user?.role == "user lider") ||
        //             (user?.role == "super admin")
        //         )
        //     )
        // ) {
        //     // toggleDrawer(true)
        //     console.log("reservado0")
        //     // setOpen(true)
        //     for (let index = 0; index < getValues()?.propiedades?.length; index++) {
        //         const element = getValues()?.propiedades?.[index];
        //         const pathElement = document.getElementById(element?.codLote);
        //         //  // console.log(pathElement)
        //         pathElement?.setAttribute('stroke', '#333') // Cambia el color de relleno del path
        //         pathElement?.setAttribute('stroke-width', '0.3'); // Cambia el color de relleno del path
        //     }
        //     const info = getValues()?.propiedades?.find((x: any) => x.codLote === id)
        //     setValue("currentLote", info)
        //     setValue("metros", info?.metros)
        //     setValue("referencia", info?.referencia)
        //     setValue("precioSoles", info?.precioSoles)
        //     //  // console.log(info)

        //     const pathElement = document.getElementById(id);
        //     if (pathElement) {
        //         pathElement?.setAttribute('stroke', '#f00') // Cambia el color de relleno del path
        //         pathElement?.setAttribute('stroke-width', '2') // Cambia el color de relleno del path
        //     }
        //     // setOpen(true)
        // }
        // else {
        //     // if (propUnique?.status === StatusLotes.STATUS_RESERVADO && (propUnique?.documentoAsesor !== getValues()?.documentoAsesor && getValues()?.nombresAsesor !== "Super")) {
        //     console.log("reservado1")
        //     setOpen(false)
        //     Swal.fire({
        //         title: 'Lo Sentimos...',
        //         text: 'Lote ya fue reservado por otro usuario...',
        //         icon: 'error',
        //         // showCancelButton: true,
        //         confirmButtonColor: '#3085d6',
        //         cancelButtonColor: '#d33',
        //         confirmButtonText: 'OK',
        //         // cancelButtonText: 'No',
        //         showLoaderOnConfirm: true,
        //         allowOutsideClick: false,
        //         preConfirm: () => {
        //             return toggleDrawer(false)
        //         },
        //     });
        //     // }
        // }
    }

    return (
        <div className="!max-w-full relative z-20 min-h-screen w-full flex items-center justify-center">
            {
                !openAsientos &&
                <div className="min-h-screen w-[650px] flex items-start justify-start p-0 relative overflow-hidden z-40">
                    <div
                        className="absolute inset-0 bg-center bg-no-repeat bg-contain"
                        style={{
                            backgroundImage: `url(${info?.urlFlyer})`,
                        }}
                    ></div>
                    <div className="flex justify-center items-center w-full mt-[calc(100vh*0.3)]">
                        <button
                            className="bg-green-500 text-white px-4 py-[1rem] w-[350px] relative z-50 font-bold text-xl button-attention cursor-pointer rounded-lg"
                            onClick={() => setOpenAsientos(true)}
                        >
                            COMPRAR ENTRADAS
                        </button>
                    </div>
                </div>
            }
            {
                openAsientos &&
                <div className="flex flex-col items-start justify-start w-full">
                    <div>
                        <button className="bg-blue-500 text-white px-3 py-3 relative z-20 font-bold text-xl cursor-pointer rounded-lg ml-5 mt-2 flex justify-center items-center"
                            onClick={() => setOpenAsientos(false)}
                        >
                            <ChevronsLeft
                                color={"#fff"}
                            />
                        </button>
                    </div>
                    {
                        (
                            info?.capacity === "200" &&
                            <div className="text-center text-4xl mb-10 px-8 pt-10 border-2 rounded-lg shadow-2xl mx-5 mt-5">
                                <Evento200Sale {...{ handleClickInformation, setOpen }} />
                            </div>
                        )
                    }
                    {
                        (
                            info?.capacity === "250" &&
                            <div className="text-center text-4xl mb-10 px-8 pt-10 border-2 rounded-lg shadow-2xl mx-5 mt-5">
                                <Evento250Sale {...{ handleClickInformation, setOpen }} />
                            </div>
                        )
                    }
                    {
                        (
                            info?.capacity === "300" &&
                            <div className="text-center text-4xl mb-10 px-8 pt-10 border-2 rounded-lg shadow-2xl mx-5 mt-5">
                                <Evento300Sale {...{ handleClickInformation, setOpen }} />
                            </div>
                        )
                    }
                </div>
            }
            {
                open &&
                <>
                    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20" />
                    <div onClick={() => setOpen(false)} className="min-h-[100vh] min-w-[100vw] bg-transparent absolute z-30 top-0 left-0"></div>
                    <div className="fixed bottom-0 left-0 w-full bg-white pb-4 z-50 shadow-xl rounded-t-sm modal-slide-up">
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="border-1 w-full text-center mb-3 cursor-pointer bg-blue-50 flex justify-center items-center" onClick={() => setOpen(false)}><X color="blue" /></div>
                            <div className="grid grid-cols-2 justify-start items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                <div className="font-bold">Asiento</div>
                                <div>{`: ${dataAsientos?.id}`}</div>
                                <div className="font-bold">Precio</div>
                                <div>{`: S/. ${changeDecimales(dataAsientos?.precio)}`}</div>
                            </div>
                            <div className="flex justify-center items-center gap-2 mt-2 px-3">
                                <button className="bg-green-500 text-[12px] text-white w-[20vw] py-2 px-2 rounded-lg font-bold text-xl cursor-pointer" onClick={() => setOpen(false)}>
                                    RESERVAR CON TARJETA
                                </button>
                                <button className="bg-blue-500 text-[12px] text-white w-[20vw] py-2 px-2 rounded-lg  font-bold text-xl cursor-pointer" onClick={() => setOpen(false)}>
                                    RESERVAR CON VOUCHER
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}