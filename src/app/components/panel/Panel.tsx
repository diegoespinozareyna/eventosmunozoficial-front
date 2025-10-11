'use client'

import { useEffect, useState } from 'react'
import { FaPowerOff } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
// import Image from 'next/image';
import Link from 'next/link'
import { FaArrowLeft } from "react-icons/fa";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { GiAutoRepair } from "react-icons/gi";
import { IconButton } from '@mui/material';
import { Apis } from '@/app/configs/proyecto/proyectCurrent';
import { useConfigStore, useUserStore } from '@/app/store/userStore';
import { useRouter } from 'next/navigation';
import { Bus, LogOut, MapIcon, OutdentIcon, Presentation } from 'lucide-react';

function Panel({ open, setOpen }: any) {

    const router = useRouter()

    const user = useUserStore((state) => state.user)

    const config = useConfigStore((state) => state.config)

    // console.log(user)

    // console.log(session)

    const [menus, setMenus] = useState<any>([])

    useEffect(() => {
        if (user?.role === "user asesor" || user?.role === "user lider" || user?.role === "admin" || user?.role === "super admin") {
            setMenus([
                {
                    id: 1,
                    title: "Eventos",
                    href: `/dashboard/proyectos`,
                    icon: <Presentation />,
                    display: true,
                    outSession: false
                },
                // {
                //     id: 1,
                //     title: "Pasajes",
                //     href: `/dashboard/pasajes`,
                //     icon: <Bus />,
                //     display: true,
                //     outSession: false
                // },
                {
                    id: 5,
                    title: "Cerrar Sesión",
                    href: "/dashboard/plano",
                    icon: <LogOut />,
                    spacing: true,
                    display: true,
                    outSession: true,
                },
            ])
        }

    }, [user?.role, config])

    return (
        <>
            {
                (user?.role !== "user temporal") &&
                <div
                    className='flex'
                    style={{
                        minHeight: "100%",
                    }} >
                    <div
                        className={`bg-[#3a8db7] h-screen p-1 pt-8 ${open ? "w-72" : "w-10"} relative z-50 duration-300`}
                        style={{
                            minHeight: "100%",
                        }}
                    >
                        {
                            user?.role === "user temporal" || true &&
                            <FaArrowLeft onClick={() => setOpen(!open)} className={`bg-white text-slate-700 text-2xl rounded-full absolute z-50 -right-2 p-1 cursor-pointer border border-slate-700 mt-1 ${!open && "rotate-180"}`} />
                        }
                        <div className={`'pt-2' ${!open && "scale-0"} inline-flex`}>
                            <div className='flex flex-col'>
                                <div className='flex gap-3 items-center'>
                                    <div className='rounded-full overflow-hidden relative z-50 flex h-20 min-w-20'>
                                        <img
                                            src={"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logosinfondo-EglD0O3xz0n42RcG4LzJodIqwwEehL.jpg"}
                                            alt="Inmobiliaria Muñoz Logo"
                                            className="h-20 min-w-20 mx-auto relative z-10"
                                        />
                                    </div>

                                    <h1 className={`text-white origin-left text-2xl ${!open && "scale-0"} pr-4 font-bold`}>
                                        {Apis.NAME_PROYECT}
                                    </h1>
                                </div>
                                <div id="profile" className="px-0 mt-10 mb-5">
                                    <a href="#" className="inline-flex space-x-2 items-center">
                                        <span>
                                        </span>
                                        <div className='flex flex-col gap-0'>
                                            <span className="text-sm md:text-base font-bold text-white">
                                                {"Bienvenido"}
                                            </span>
                                            <div className='flex gap-2 items-center'>
                                                <span className="text-sm md:text-base font-bold uppercase">
                                                    {`${user?.nombres} ${user?.apellidoPaterno} ${user?.apellidoMaterno}`}
                                                </span>
                                                {/* {
                                                    (user?.role === "super admin") &&
                                                    <Link href={"/dashboard/configuracionesgenerales"}>
                                                        <IconButton
                                                            // color="gray"
                                                            aria-label="close"
                                                        >
                                                            <GiAutoRepair />
                                                        </IconButton>
                                                    </Link>
                                                } */}
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <ul className={`'pt-0' ${!open && "scale-0"} duration-300 overflow-auto`}>
                            {
                                menus?.filter((x: any) => x.display !== false)?.map((menu: any, index: any) => {
                                    return (
                                        <div
                                            style={{
                                                marginTop: "0px"
                                            }}
                                            key={index}
                                        >
                                            {
                                                menu.display === true &&
                                                <li
                                                    onClick={() => {
                                                        if (menu.outSession) {
                                                            localStorage.removeItem("auth-token")
                                                            router.push("/")
                                                        }
                                                        else {
                                                            router.push(menu.href)
                                                        }
                                                    }
                                                    } key={index} className={`text-white text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-blue-500 rounded-md mt-4 border-1 border-[rgba(0,0,0,0.05)] border-solid`}
                                                >
                                                    <span className='text-2xl block float-left'>
                                                        {menu.icon}
                                                    </span>
                                                    <span className={`text-base font-medium flex-1 ${!open && "hidden"}`}>
                                                        {menu.title}
                                                    </span>
                                                </li>
                                            }
                                        </div>
                                    )
                                })
                            }

                            {/* <div className='flex flex-col gap-0 mt-5'>
                    <div className='text-white opacity-30 text-xs'>
                        Desarrollado por Lotexpres
                    </div>
                    <div className='text-white opacity-30 text-xs'>
                        contacto: +51 992 830 820
                    </div>
                </div> */}
                        </ul>

                    </div>
                </div>
            }
        </>
    )
}

export default Panel