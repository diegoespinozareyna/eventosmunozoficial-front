'use client'

import React, { useState } from 'react'
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

import { LoginForm } from '../../components/login/LoginForm';
import { Apis } from '@/app/configs/proyecto/proyectCurrent';
import useApi from '@/app/hooks/fetchData/useApi';
import { jwtDecode } from 'jwt-decode';

export const Login = () => {
    // const { user, setUser, loading, setLoading } = useUserStore()
    const { getValues, setValue, handleSubmit, control } = useForm()
    // const [showPassword, setShowPassword] = useState(false)
    const { apiCall, loading, error } = useApi()

    // const [session, setSession] = useState<any>(null);

    const onSubmit = async (data: any) => {
        console.log(data)
        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/login`
        const jsonData = {
            ...data,
        };

        try {
            const dataLogin = await apiCall({ method: "post", endpoint: url, data: jsonData });
            console.log("dataLogin", dataLogin);
            console.log(error);
            localStorage.setItem("auth-token", dataLogin.token)
            const decoded: any = jwtDecode(dataLogin.token as string);
            console.log('Datos del usuario:', decoded?.user);
            // setSession(decoded?.user);

            Swal.fire({
                title: 'Ingresó con éxito',
                // text: "Esta acción no se puede deshacer",
                icon: 'success',
                showConfirmButton: false,
            });
            setTimeout(() => {
                window.location.href = `/dashboard/proyectos`;
                // if (decoded?.user?.userType !== "admin") {
                //     window.location.href = `/dashboard/proyectos`;
                // } else {
                //     window.location.href = `/dashboard/proyectos`;
                // }
            }, 500);

        } catch (error) {
            Swal.fire({
                title: 'Ocurrio un error, verifique su usuario y/o contraseña',
                text: '',
                icon: 'warning',
                // showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'OK',
                // cancelButtonText: 'No',
                showLoaderOnConfirm: true,
                allowOutsideClick: false,
                preConfirm: () => {
                    // window.location.href = '/';
                    localStorage.removeItem("auth-token");
                    return
                },
            });
            console.error("Error al consultar el DNI:", error);
        }

    }

    return (
        <div className="flex flex-col items-center justify-center">
            <LoginForm {...{ handleSubmit, apiCall, onSubmit, getValues, setValue, control, loading }} />
        </div>
    )
}