"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Panel from "@/app/components/panel/Panel";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Apis } from "@/app/configs/proyecto/proyectCurrent";
import { useConfigStore, useUserStore } from "@/app/store/userStore";
import useApi from "@/app/hooks/fetchData/useApi";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const [session, setSession] = useState<any>(null);
    const [open, setOpen] = useState(false);

    const setUser = useUserStore((state) => state.setUser);
    const setConfig = useConfigStore((state) => state.setConfig);
    const { apiCall } = useApi()

    const fetchConfigs = async () => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/getConfig`;
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                }
            });
            console.log("responseConfigs: ", response?.data?.find((x: any) => x.proyecto === Apis.PROYECTCURRENT));
            setConfig(response?.data?.find((x: any) => x.proyecto === Apis.PROYECTCURRENT));
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            localStorage.removeItem("auth-token");
        }
    }

    useEffect(() => {
        try {
            const token = localStorage.getItem('auth-token');
            const decoded: any = jwtDecode(token as string);
            console.log('Datos del usuario:', decoded?.user);
            setUser(decoded?.user);
            // setSession(decoded?.user);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            localStorage.removeItem("auth-token");
            window.location.href = '/';
        }

        fetchConfigs();

    }, [])

    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <div className="flex flex-row gap-0 justify-start max-h-screen">
                    <Panel {...{ open, setOpen }} />
                    {children}
                </div>
            </body>
        </html>
    );
}
