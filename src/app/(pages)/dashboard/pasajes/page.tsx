"use client";

import { Apis } from "@/app/configs/proyecto/proyectCurrent";
import useApi from "@/app/hooks/fetchData/useApi";
import { Button, Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { Bus, Calendar, Edit, Edit2Icon, ExternalLink, Eye, EyeIcon, Plus, Users } from "lucide-react";
import moment from "moment-timezone";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

export default function DashBoard() {

    const router = useRouter()
    const onlyUseffect = useRef(false)
    const { apiCall } = useApi()
    const [eventos, setEventos] = useState<any>([])

    const { setValue, getValues } = useForm()

    const fetchEventos = async () => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/getPasajesAll`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                }
            });
            console.log("responseEventos: ", response?.data);
            setEventos(response?.data);
        } catch (error) {
            console.error('Error al obtener datos de eventos:', error);
        }
    }

    useEffect(() => {
        if (onlyUseffect.current === false) {
            onlyUseffect.current = true
            fetchEventos()
        }
    }, [])

    const [busqueda, setBusqueda] = useState<string>("")

    const datosFiltrados = eventos?.filter((item: any) => {
        if (!busqueda) return true; // si no hay texto, mostrar todo

        const filtro = (
            item?.capacity?.toString().toLowerCase().includes(busqueda.toLowerCase()) ||
            item?.title?.toLowerCase().includes(busqueda.toLowerCase()) ||
            item?.dateEvent?.toLowerCase().includes(busqueda.toLowerCase())
        );
        return filtro;
    });

    useEffect(() => {
        try {
            const user = localStorage.getItem('auth-token');
            const decoded: any = jwtDecode(user as string);
            console.log('Datos del usuario:', decoded?.user);
            setValue("user", decoded?.user);

            console.log("decoded?.user: ", decoded?.user);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setValue("user", []);
        }
    }, [])

    return (
        <div className="px-3 py-1 max-h-[calc(100vh-50px)]">
            <h1 className="text-3xl font-bold mb-7">Pasajes</h1>
            <div className="flex flex-col gap-2">
                {
                    (getValues("user")?.userType == "admin" || getValues("user")?.userType == "super admin") &&
                    <>
                        <div className="-ml-2 p-0">
                            <IconButton
                                className="bg-blue-500 text-white rounded-full p-0"
                                aria-label="Add to event"
                                onClick={() => router.push(`/dashboard/pasajes/new`)}
                            >
                                <div className="flex flex-row justify-center items-center gap-2">
                                    <Plus className="w-7 h-7 bg-blue-500 text-white rounded-full p-1" />
                                    <div className="text-lg font-bold">
                                        {`Agregar Nueva Visita`}
                                    </div>
                                </div>
                            </IconButton>
                        </div>
                        {/* <div className="mb-1">
                            <div className="text-lg font-bold">
                                <input
                                    value={busqueda}
                                    onChange={(e: any) => setBusqueda(e.target.value)}
                                    className={`w-full sm:w-full md:w-1/2 bg-gray-100 rounded-md p-2 text-sm`}
                                    placeholder="Titulo, capacidad"
                                />
                            </div>
                        </div>
                        <div className="text-xs bg-white relative z-50 w-[80px] ml-2">Fecha Evento</div>
                        <div className="mb-5 -mt-3">
                            <div className="text-lg font-bold">
                                <input
                                    value={busqueda}
                                    type="date"
                                    onChange={(e: any) => setBusqueda(e.target.value)}
                                    className="w-full sm:w-full md:w-1/2 bg-gray-100 rounded-md p-2 text-sm"
                                    placeholder="Fecha de Evento"
                                />
                            </div>
                        </div> */}
                    </>
                }
                <div className={`w-[calc(100vwv)] md:w-[calc(100vw-320px)] ${(getValues("user")?.userType == "admin" || getValues("user")?.userType == "super admin") ? "h-[calc(100vh-280px)]" : "h-[calc(100vh-100px)]"} overflow-y-auto flex flex-col justify-items-center-center gap-4 pb-5 pr-5`}>
                    {
                        eventos?.length > 0 ?
                            eventos?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((evento: any, index: any) => {
                                return (
                                    <div key={index} className="w-full px-3 py-2 border-2 shadow-lg rounded-md">
                                        <div className="">
                                            <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
                                                <div className="">
                                                    <div className="text-xl font-bold text-gray-900 leading-tight text-center md:text-left">
                                                        {`${evento.titulo}`}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col md:flex-row gap-2">
                                                    <Button
                                                        disabled={getValues("user")?.userType !== "admin" && getValues("user")?.userType !== "super admin"}
                                                        onClick={() => router.push(`/dashboard/pasajes/${evento._id}`)}
                                                        variant="outlined"
                                                        className="gap-2 bg-transparent"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                        <div className="text-xs">Editar</div>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                                    <div className="p-2 bg-blue-100 rounded-full">
                                                        <Calendar className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Fecha Visita</p>
                                                        <p className="text-base font-semibold text-gray-900">{`${moment.tz(evento.fechaVisita, "America/Lima").format("DD/MM/YYYY")}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>

                                        <div className="pt-4 border-t bg-gray-50/50">
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-sm text-gray-500">{`Creado el ${moment.tz(evento.createdAt, "America/Lima").format("DD/MM/YYYY HH:mm")}`}</p>
                                                <div className="flex gap-2">
                                                    <Button onClick={() => router.push(`/visitas/${evento.titulo
                                                        ?.normalize("NFD")                       // separa tildes de las letras
                                                        ?.replace(/[\u0300-\u036f]/g, "")        // elimina las marcas de acento
                                                        ?.replace(/\s+/g, ".")                   // reemplaza espacios por guiones
                                                        ?.toUpperCase()}-${evento._id}`)} className="gap-2">
                                                        <Bus className="h-7 w-7" />
                                                        Ver Buses
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <div className="w-[calc(100vw-65px)] h-[calc(100vh-200px)] overflow-y-auto pr-0 flex flex-col justify-items-center-center gap-4 pb-5">
                                <div className="w-full px-3 py-2 border-2 shadow-lg rounded-md">
                                    <div className="">
                                        <div className="flex flex-col md:flex-row items-center gap-5 justify-between">
                                            <div className="">
                                                <div className="text-xl font-bold text-gray-900 leading-tight">
                                                    {`${"No hay visitas para mostrar"}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div >
    )
}