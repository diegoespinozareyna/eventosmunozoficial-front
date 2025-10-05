"use client"

import { useEffect, useState } from 'react'
import { useUserStore } from '@/app/store/userStore'
import { Sprinter10 } from '@/app/components/sprinterssvg/Sprinter10'
import { Bus50 } from '@/app/components/sprinterssvg/Bus50'
import useApi from '@/app/hooks/fetchData/useApi'
import { Apis } from '@/app/configs/proyecto/proyectCurrent'

export default function Pag() {

    const user = useUserStore((state) => state.user)
    const { apiCall, loading, error } = useApi()

    const [visitas, setVisitas] = useState<any>([])

    const fetchAsientosIdMatrix = async () => {
        try {
            // const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/getAsientosIdMatrix`
            // const response = await apiCall({
            //     method: "get", endpoint: url, data: null, params: {
            //         proyecto: Apis.PROYECTCURRENT,
            //         idMatrix: params?.eventos?.split("-")[1],
            //     }
            // });
            // console.log("responseEventId: ", response?.data);
            // setDataAsientosComprados(response?.data?.filter((x: any) => x?.status !== "3"));
            // console.log(info?.dateEvent)

            // if (response?.data?.length > 0) {
            const paths = document.querySelectorAll(`#${Apis.PROYECTCURRENT} path`);
            paths.forEach(obj1 => {
                // const match = response?.data?.find((obj2: any) => obj2?.codAsiento === obj1?.id && obj2?.status !== "3");
                // console.log("match: ", match)
                // const hoy = new Date();
                // const fechaFin = new Date(match?.fechaFin); // Asegúrate de que sea Date
                // // console.log("fechaFin: ", fechaFin)
                // const fechaEvento = new Date(info?.dateEvent) // Asegúrate de que sea Date
                // // if (fechaEvento !== null && fechaEvento !== undefined) {
                // //     console.log(info?.dateEvent, fechaEvento)
                // // }

                // const milisegundosEnUnDia = 24 * 60 * 60 * 1000;
                // const diferencia = fechaFin.getTime() - hoy.getTime();
                // const diferencia2 = fechaEvento.getTime() - hoy.getTime();
                // // console.log("diferencia: ", diferencia);

                // if (match?.status == "4") {
                //     // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                //     obj1?.setAttribute('fill', "#61baed");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else {
                obj1?.setAttribute('fill', "#efefef");
                obj1?.setAttribute('stroke', '#333');
                obj1?.setAttribute('stroke-width', '0.3')
                // }
            })
        }
        catch (error) {
            console.error("Error fetching asientos:", error);
        }
    }

    useEffect(() => {
        fetchAsientosIdMatrix()
    }, [])

    return (
        <>
            <div className='flex flex-col bg-[#efefef] justify-start items-center gap-4 p-4 w-full px-5 overflow-y-auto'>
                <div className='flex flex-col justify-center items-center w-full md:w-3/4 max-w-4xl gap-4'>
                    <div className='flex gap-4 justify-center items-center'>
                        <h1 className='text-center text-2xl font-bold'>
                            Venta de Pasajes
                        </h1>
                    </div>

                    {/* tipo buses */}
                    <div id='typeBuses' className='flex flex-col w-full gap-2'>
                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex w-full justify-between'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className='scale-200 -mt-2'>
                                        🚐
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold'>
                                            {`${"Sprinter 10"}`}
                                        </h1>
                                        <p className='text-sm font-semibold'>
                                            {`${"Capacidad: 10 pasajeros"}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-1'>
                                    <div className='rounded-lg border border-slate-400 bg-white p-1 text-center'>
                                        {`${"0"}/10`}
                                    </div>
                                    <div>
                                        <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                            Activo
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex w-full justify-between'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className='scale-200 -mt-2'>
                                        🚌
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold'>
                                            {`${"Sprinter 17"}`}
                                        </h1>
                                        <p className='text-sm font-semibold'>
                                            {`${"Capacidad: 17 pasajeros"}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-1'>
                                    <div className='rounded-lg border border-slate-400 bg-white p-1 text-center'>
                                        {`${"0"}/17`}
                                    </div>
                                    <div>
                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                        Activo
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex w-full justify-between'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className='scale-200 -mt-2'>
                                        🚌
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold'>
                                            {`${"Sprinter 20"}`}
                                        </h1>
                                        <p className='text-sm font-semibold'>
                                            {`${"Capacidad: 20 pasajeros"}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-1'>
                                    <div className='rounded-lg border border-slate-400 bg-white p-1 text-center'>
                                        {`${"0"}/20`}
                                    </div>
                                    <div>
                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                        Activo
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex w-full justify-between'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className='scale-200 -mt-2'>
                                        🚍
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold'>
                                            {`${"Mini Bus 30"}`}
                                        </h1>
                                        <p className='text-sm font-semibold'>
                                            {`${"Capacidad: 30 pasajeros"}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-1'>
                                    <div className='rounded-lg border border-slate-400 bg-white p-1 text-center'>
                                        {`${"0"}/30`}
                                    </div>
                                    <div>
                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                        Activo
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex w-full justify-between'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className='scale-200 -mt-2'>
                                        🚌
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold'>
                                            {`${"Bus 50"}`}
                                        </h1>
                                        <p className='text-sm font-semibold'>
                                            {`${"Capacidad: 50 pasajeros"}`}
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-1'>
                                    <div className='rounded-lg border border-slate-400 bg-white p-1 text-center'>
                                        {`${"0"}/50`}
                                    </div>
                                    <div>
                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                        Activo
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* contadores */}
                    <div id='counters' className='flex flex-col w-full gap-2'>
                        <div className='flex justify-start items-start gap-4 font-bold uppercase'>
                            Contadores
                        </div>
                        <div className='flex w-full flex-col md:flex-row gap-1 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex flex-col w-full px-2 py-1 border rounded-lg border-green-100 bg-green-50'>
                                <div>
                                    Total Pasajeros:
                                </div>
                                <div className='font-bold text-green-400'>
                                    {`${"10"}`}
                                </div>
                            </div>
                            <div className='flex flex-col w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                <div>
                                    Buses Completados:
                                </div>
                                <div className='font-bold text-blue-400'>
                                    {`${"1"}`}
                                </div>
                            </div>
                            <div className='flex flex-col w-full px-2 py-1 border rounded-lg border-orange-100 bg-orange-50'>
                                <div>
                                    Vehiculo Actual:
                                </div>
                                <div className='font-bold text-orange-400'>
                                    {`${"Sprinter 10"}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* asientosBuses */}
                    <div id='asientosBuses' className='flex flex-col w-full gap-2'>
                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                            <div className='flex w-full justify-between'>
                                <div className='flex justify-center items-center gap-4'>
                                    <div className='scale-200 -mt-2'>
                                        🚐
                                    </div>
                                    <div>
                                        <h1 className='text-xl font-bold'>
                                            {`${"Sprinter 10"}`}
                                        </h1>
                                    </div>
                                </div>
                                <div className='flex justify-center items-center gap-1'>
                                    <div className='bg-white p-1 text-center'>
                                        {`Ocupados: ${"0"}/10`}
                                    </div>
                                    <div>
                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                        Activo
                                    </button> */}
                                    </div>
                                </div>
                            </div>
                            <div className='relative w-full grid grid-cols-1 md:grid-cols-2'>
                                {/* asientos svgx */}
                                <div className='relative w-full h-[600px] border border-slate-300'>
                                    {/* <Sprinter10 /> */}
                                    <Bus50 />
                                </div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
