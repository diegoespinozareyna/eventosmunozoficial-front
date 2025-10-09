"use client"

import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2"
import { FormComprarTicket } from "../Forms/FormComprarTicket"
import { Controller } from "react-hook-form"
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material"
import { X } from "lucide-react"
import { usePopUp } from "@/app/hooks/popup/usePopUp"
import { changeDecimales } from "@/app/functions/changeDecimales"

export const PopUp = ({ onSubmit, handleSubmit, control, apiCall, loading, error, getValues, setValue, loadingUpload, reset, setOpen, dataAsientos, setOpenPopup, usuarioActivo }: any) => {

    // const { openPopup, setOpenPopup } = usePopUp()

    const [inputValue, setInputValue] = useState("")
    const [options, setOptions] = useState<any[]>([])
    const [loading22, setLoading22] = useState(false)

    const handleSearch = async (query: string) => {
        if (!query || query.length < 3) {
            setOptions([])
            return
        }

        setLoading22(true)
        try {
            const res = await fetch(`${Apis.URL_APOIMENT_BACKEND_DEV}/api/users/getPatrocinadoresUnique?query=${encodeURIComponent(query)}`)
            const data = await res.json()
            setOptions(data.data || [])
        } catch (err) {
            console.error("Error al buscar usuarios:", err)
        } finally {
            setLoading22(false)
        }
    }

    useEffect(() => {
        const selected = getValues("patrocinadorId")
        if (selected && typeof selected === "object") {
            setOptions([selected])
            setInputValue(selected.label)
        }
    }, [])

    //pago pasarela

    const openForm = () => {
        window?.VisanetCheckout?.open();
    }

    // useEffect(() => {
    //     setValue("montoPasarela", dataAsientos?.precio)
    // }, []);

    // const [openPopup, setOpenPopup] = useState<boolean>(false);
    const [loading2, setLoading2] = useState(false);
    const [tokenSession77, setTokenSession77] = useState<any>(null);
    const [sessionPaso2, setSessionPaso2] = useState<any>(null);
    const [initialized, setInitialized] = useState(false);
    const [paymentInitialized, setPaymentInitialized] = useState(false);
    const initializationRef = useRef(false);

    const initializePaymentGateway = useCallback(async () => {
        if (!getValues()?.pasarelaPay || initializationRef.current) return;

        // Marcar como inicializado inmediatamente
        initializationRef.current = true;
        setPaymentInitialized(true);

        console.log("reserva pasarelawedrfgfdsd")
        const MERCHANT_ID = "650245394";
        // const AMOUNT = "300";
        const AMOUNT = dataAsientos?.precio;
        // const AMOUNT = Apis.PRECIO_PASARELA;
        // const JS_URL = "https://static-content-qas.vnforapps.com/v2/js/checkout.js?qa=true"; // test
        const JS_URL = "https://static-content.vnforapps.com/v2/js/checkout.js"; // prod
        const PUCHASE_NUMBER = Math.floor(Math.random() * (999999999999 - 1 + 1)) + 1; // único por transacción
        let SECURITY_TOKEN = '';

        const loadInit = async () => {

            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'block';
            }

            try {
                setLoading2(true)
                // const res1 = await axios.get('https://nodejs-niubiz-lotexpres.onrender.com/api/auth/pasarelaNiubiz') // prd render servidor lento
                const res1 = await axios.get('https://nodejs-niubiz-munoz.vercel.app/api/auth/pasarelaNiubiz') // prd render servidor lento
                // const res1 = await axios.get('http://localhost:5000/api/auth/pasarelaNiubiz') // local
                console.log(res1)

                if (res1 == null) return;
                SECURITY_TOKEN = res1.data.data;
                // SECURITY_TOKEN = res1;
                // setTokenSession77(res1)
                setTokenSession77(res1)
                getTokenNiubizSesion(res1);

            } catch (error) {
                alert('Error al generar el token de seguridad');
                const loadingElement = document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                initializationRef.current = false;
                setPaymentInitialized(false);
            } finally {
                setLoading2(false)
            }
        }
        const getTokenNiubizSesion = async (securityToken: any) => {
            // console.log(securityToken)
            try {
                // const sessionKey = await getSessionKey(MERCHANT_ID, securityToken, AMOUNT)
                const sessionToken2 = {
                    codigoComercio: MERCHANT_ID,
                    tokenGenerado: securityToken.data.data,
                    montoPagar: AMOUNT,
                    //MDD
                    MDD4: "diegoespinozareyna@gmail.com", // ID del usuario correo
                    MDD21: 0, //
                    MDD32: "73505082", // ID del usuario dni
                    MDD75: 'Invitado', // Registrado o Invitado
                    MDD77: 100 // Registrado o Invitado
                }
                // console.log(sessionToken2)
                // const res2 = await axios.post('https://nodejs-niubiz-lotexpres.onrender.com/api/auth/pasarelaniubiz2', sessionToken2) // prd render servidor lento
                const res2 = await axios.post('https://nodejs-niubiz-munoz.vercel.app/api/auth/pasarelaniubiz2', sessionToken2) // prd
                // const res2 = await axios.post('http://localhost:5000/api/auth/pasarelaniubiz2', sessionToken2) // local
                console.log(res2)
                if (res2 == null) {
                    console.log("res2 null")
                    return
                };
                setSessionPaso2(res2?.data?.data)
                await addNiubizScript(res2?.data?.data);
            } catch (error) {
                alert('Error al generar el token de sesión');
                const loadingElement = document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
            } finally {
                // setLoading2(false)
            }
        }

        const addNiubizScript = async (sessionKey: any) => {
            const script = document.createElement('script');
            script.src = JS_URL;
            script.async = true;
            // console.log(sessionKey)
            script.onload = () => setConfigurationForm(sessionKey);
            document.head.appendChild(script);
        }

        const setConfigurationForm = async (sessionKey: any) => {
            //comprobar status
            const form1 = window?.VisanetCheckout?.configure({
                sessiontoken: `${sessionKey}`,
                channel: 'web',
                merchantid: "650245394",
                purchasenumber: `${PUCHASE_NUMBER}`,
                amount: AMOUNT,
                expirationminutes: '20',
                timeouturl: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/timeout` : 'http://localhost:3000/timeout',
                merchantlogo: 'https://files.readme.io/296927b-LOGO-NIUBIZ-LATEST.svg',
                // merchantlogo: <img src='https://res.cloudinary.com/dk5xdo8n1/image/upload/v1720914692/Niubiz_Logo_01_rjynld.png' alt="img" />,
                formbuttoncolor: '#000000',
                action: process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/transaction` : 'http://localhost:3000/transaction',
            });
            // console.log(form1)
            window?.VisanetCheckout?.open();
            // No considerar la siguiente línea si desea enviar los valores generados por el formulario a su backend

            if (window?.VisanetCheckout?.configuration) {
                window.VisanetCheckout.configuration.complete = completePayment;
            }
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }

        const completePayment = async (response: any) => {
            //comprobar status
            // console.log(response)
            // console.log(tokenSession77)
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.style.display = 'block';
            }
            const sessionToken3 = {
                codigoComercio: MERCHANT_ID,
                tokenGenerado2: response.token,
                montoPagar: AMOUNT,
                numeroAleatorio: PUCHASE_NUMBER,
                tokenSession: SECURITY_TOKEN,
                // tokenSession: tokenSession77?.data?.data,
                // tokenSession: sessionPaso2,
            }
            try {
                // console.log(sessionToken3)
                // const res3 = await axios.post('https://nodejs-niubiz-lotexpres.onrender.com/api/auth/pasarelanuibiz3', sessionToken3) // prd render sercidor lento
                const res3 = await axios.post('https://nodejs-niubiz-munoz.vercel.app/api/auth/pasarelanuibiz3', sessionToken3) // prd
                // const res3 = await axios.post('http://localhost:5000/api/auth/pasarelanuibiz3', sessionToken3) // local
                // const res3 = await getAuthorization(MERCHANT_ID, response.token, AMOUNT, PUCHASE_NUMBER, SECURITY_TOKEN)
                console.log("]Larespuesta final es: ", res3)
                // const authorizationResponse = await getAuthorization(MERCHANT_ID, response.token, AMOUNT, PUCHASE_NUMBER, SECURITY_TOKEN);
                const authorizationResponseElement = document.getElementById('authorizationResponse');
                if (authorizationResponseElement) {
                    authorizationResponseElement.innerHTML = JSON.stringify(res3, undefined, 4);
                }
                const loadingElement = document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.style.display = 'none';
                }
                // Redireccionar a una url front
                console.log("pago ok", res3)
                console.log("pago ok", res3?.data?.data?.dataMap?.STATUS)
                console.log("pago ok", res3?.data?.data?.dataMap?.STATUS == "Authorized")
                if (res3?.data?.data?.dataMap?.STATUS == "Authorized") {
                    Swal.fire({
                        icon: "success",
                        title: "Pago exitoso",
                        text: `Reservó su asiento con éxito, un ejecutivo se comunicará con usted en la brevedad posible`,
                    });
                    console.log("pago ok", res3)
                    console.log("pago ok")
                    onSubmit(getValues());
                    window.location.reload()
                }
                else if (res3?.data?.data?.dataMap?.STATUS !== "Authorized") {
                    console.log("pago ok", res3?.data?.data?.data?.ACTION_DESCRIPTION
                    )
                    Swal.fire({
                        icon: "warning",
                        title: "Ocurrió un inconveniente con su pago",
                        text: `Error: ${res3?.data?.data?.data?.ACTION_DESCRIPTION}, por su seguridad se le enviará a la página principal`,
                    });
                    if (process.env.NEXT_PUBLIC_API_URL) {
                        setTimeout(() => {
                            window.location.reload()
                        }, 7000)
                    }
                    else {
                        Swal.fire({
                            icon: "warning",
                            title: "Ocurrió un inconveniente con su pago",
                            text: `Error: ${res3?.data?.data?.data?.ACTION_DESCRIPTION}, por su seguridad se le enviará a la página principal`,
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 7000)
                    }
                }
            } catch (error) {
                Swal.fire({
                    icon: "warning",
                    title: "Alerta",
                    text: "Ocurrió un error con su pago, NO se hizo el cobro. Por su seguridad lo enviaremos a la página principal",
                });
                if (process.env.NEXT_PUBLIC_API_URL) {
                    setTimeout(() => {
                        window.location.replace(`${process.env.NEXT_PUBLIC_API_URL}`);
                    }, 5000)
                }
                else {
                    setTimeout(() => {
                        window.location.replace("http://localhost:3000/");
                    }, 5000)
                }
            } finally {
                setLoading2(false)
            }
        }
        //fin pasarela niubiz
        loadInit()
    }, [getValues]);

    // Efecto que se ejecuta solo cuando cambia pasarelaPay a true
    useEffect(() => {
        if (getValues()?.pasarelaPay && !paymentInitialized) {
            initializePaymentGateway();
        }
    }, [getValues()?.pasarelaPay, paymentInitialized, initializePaymentGateway]);

    return (
        <>
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50" />
            <div className="absolute flex flex-col bg-white pb-4 z-50 shadow-xl rounded-lg modal-slide-up justify-start">
                <div className="border-1 w-full text-center mb-3 cursor-pointer bg-blue-50 flex justify-center items-center rounded-t-lg" onClick={() => {
                    setOpenPopup(false)
                    getValues()?.comprarAsientos !== true && reset()
                    setOpen(false)
                }}><X color="blue" /></div>
                <div className="flex flex-col gap-2 bg-[rgba(255,255,255,0.8)] rounded-lg p-3 px-3 mt-0 w-[350px] mx-2">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {
                            getValues()?.siPasarelaPay && getValues()?.cambiarStatusAsiento !== true &&
                            <>
                                <div className="flex flex-col gap-3">
                                    <FormComprarTicket {...{ getValues, setValue, handleSubmit, control, apiCall, loading, error }} />
                                </div>
                                <div className="mt-3">
                                    <Controller
                                        name={"patrocinadorId"}
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={options}
                                                getOptionLabel={(option) => option?.label || ""}
                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                value={field.value || null}
                                                inputValue={inputValue}
                                                // Validation can be handled via the Controller or form logic
                                                onInputChange={(_, newInputValue) => {
                                                    setInputValue(newInputValue)
                                                    if (newInputValue.length >= 3) {
                                                        handleSearch(newInputValue)
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue)
                                                    if (newValue) {
                                                        setInputValue(newValue.label)
                                                        setOptions([newValue])
                                                    } else {
                                                        setInputValue("")
                                                    }
                                                }}
                                                loading={loading22}
                                                filterOptions={(x) => x}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        label="Patrocinador o Referido"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {loading22 && <CircularProgress size={20} />}
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
                                <div className="flex flex-row gap-3 w-full mt-2">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        onClick={() => {
                                            setValue("pasarelaPay", true)
                                        }}
                                        className="w-full"
                                        disabled={
                                            getValues()?.documentoUsuario == "" || getValues()?.documentoUsuario == null || getValues()?.documentoUsuario == undefined
                                            ||
                                            getValues()?.nombres == "" || getValues()?.nombres == null || getValues()?.nombres == undefined
                                            ||
                                            getValues()?.apellidoPaterno == "" || getValues()?.apellidoPaterno == null || getValues()?.apellidoPaterno == undefined
                                            ||
                                            getValues()?.apellidoMaterno == "" || getValues()?.apellidoMaterno == null || getValues()?.apellidoMaterno == undefined
                                            ||
                                            getValues()?.celular == "" || getValues()?.celular == null || getValues()?.celular == undefined
                                            ||
                                            getValues()?.patrocinadorId == "" || getValues()?.patrocinadorId == null || getValues()?.patrocinadorId == undefined
                                            ||
                                            getValues()?.pasarelaPay == true
                                        }
                                    >
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            Comprar Ticket
                                            {
                                                getValues()?.pasarelaPay &&
                                                <>
                                                    <CircularProgress size={24} className="text-white" />
                                                    Aperturando Pasarela de Pago, por favor espere...
                                                </>
                                            }
                                        </div>
                                    </Button>
                                </div>
                                {
                                    getValues()?.pasarelaPay &&
                                    <div className="uppercase text-center text-base font-bold text-black">
                                        {/* {"Datos Usuario"} */}
                                        <div className="App">
                                            <div className="loading" id='loading'></div>
                                            <div className='hidden content'>
                                                <div className="container mt-5">
                                                    <div className="hidden row">
                                                        <div className='col-12 mt-3'>
                                                            <button onClick={openForm} className='btn btn-primary'>Pagar</button>
                                                        </div>
                                                        <div className='col-12 mt-5'>
                                                            <label>Response</label>
                                                            <textarea id="authorizationResponse" className='form-control' readOnly rows={1}></textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                        {
                            getValues()?.noPasarelaPay && getValues()?.cambiarStatusAsiento !== true &&
                            <div className="flex flex-col gap-3">
                                <div className="uppercase text-center text-base font-bold text-black">
                                    {"Datos Usuario"}
                                </div>
                                <div className="flex flex-col justify-center items-center gap-1 mb-3">
                                    <div>
                                        {`Debe realizar el pago total de S/. ${changeDecimales(dataAsientos?.precio)} por cualquiera de los siguientes medios de pago: `}
                                    </div>
                                    <img src="/transferenciamunoz.jpg" alt="transferencia" className="w-[80%] h-auto" />
                                    <div className="flex flex-col justify-center items-center gap-0 mt-1">
                                        <div className="font-bold text-xs text-red-500 mt-1">
                                            {`* El voucher que seleccione debe ser de: S/. ${changeDecimales(dataAsientos?.precio)} `}
                                        </div>
                                        <div className="font-bold text-xs text-red-500 mt-1 uppercase">
                                            {`(Caso contrario se rechazará su reserva)`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <FormComprarTicket {...{ getValues, setValue, handleSubmit, control, apiCall, loading, error }} />
                                </div>
                                <div className="mt-0">
                                    <Controller
                                        name={"patrocinadorId"}
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={options}
                                                getOptionLabel={(option) => option?.label || ""}
                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                value={field.value || null}
                                                inputValue={inputValue}
                                                // Validation can be handled via the Controller or form logic
                                                onInputChange={(_, newInputValue) => {
                                                    setInputValue(newInputValue)
                                                    if (newInputValue.length >= 3) {
                                                        handleSearch(newInputValue)
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue)
                                                    if (newValue) {
                                                        setInputValue(newValue.label)
                                                        setOptions([newValue])
                                                    } else {
                                                        setInputValue("")
                                                    }
                                                }}
                                                loading={loading22}
                                                filterOptions={(x) => x}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        label="Buscar persona (DNI o nombres)"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {loading22 && <CircularProgress size={20} />}
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
                                <div className="flex flex-row gap-3 w-full">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        className="w-full"
                                        disabled={loading || loadingUpload}
                                    >
                                        Comprar Ticket
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setOpen(false)
                                            setOpenPopup(false)
                                            reset()
                                        }}
                                        variant="contained"
                                        color="error"
                                        type="button"
                                        // className="w-full"
                                        disabled={loading || loadingUpload}
                                    >
                                        {"Cancelar"}
                                    </Button>
                                    {/* <div className="border-0 w-full text-center mb-1 cursor-pointer flex justify-center items-center rounded-t-lg sm:rounded-t-none" onClick={() => {
                                        setOpen(false)
                                        setOpenPopup(false)
                                        reset()
                                    }}>
                                        <X className="rounded-full bg-blue-50 p-1" color="blue" />
                                    </div> */}
                                </div>
                            </div>
                        }
                        {
                            getValues()?.comprarAsientos &&
                            <div className="flex flex-col gap-3">
                                {/* <div className="uppercase text-center text-base font-bold text-black">
                                    {"Datos Usuario"}
                                </div> */}
                                <div className="flex flex-col justify-center items-center gap-1 mb-3">
                                    <div>
                                        {`Debe realizar el pago total de S/. ${changeDecimales(getValues()?.sumaTotalPago)} por cualquiera de los siguientes medios de pago: `}
                                    </div>
                                    <img src="/transferenciamunoz.jpg" alt="transferencia" className="w-[80%] h-auto" />
                                    <div className="flex flex-col justify-center items-center gap-0 mt-1">
                                        <div className="font-bold text-xs text-red-500 mt-1">
                                            {`* El voucher que seleccione debe ser VÁLIDO y del monto de: S/. ${changeDecimales(getValues()?.sumaTotalPago)} `}
                                        </div>
                                        <div className="font-bold text-xs text-red-500 mt-1 uppercase">
                                            {`${usuarioActivo?.role == "user asesor" ? "(Caso contrario se rechazará su compra y puede estar sujeto a sanción de parte de la inmobiliaria. Revise bien antes de subir el voucher)" : "(Caso contrario se rechazará su compra)"}`}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <FormComprarTicket {...{ getValues, setValue, handleSubmit, control, apiCall, loading, error }} />
                                </div>
                                {
                                    getValues()?.user?.length == 0 &&
                                    <div className="mt-0">
                                        <Controller
                                            name={"patrocinadorId"}
                                            control={control}
                                            render={({ field }) => (
                                                <Autocomplete
                                                    options={options}
                                                    getOptionLabel={(option) => option?.label || ""}
                                                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                    value={field.value || null}
                                                    inputValue={inputValue}
                                                    // Validation can be handled via the Controller or form logic
                                                    onInputChange={(_, newInputValue) => {
                                                        setInputValue(newInputValue)
                                                        if (newInputValue.length >= 3) {
                                                            handleSearch(newInputValue)
                                                        }
                                                    }}
                                                    onChange={(_, newValue) => {
                                                        field.onChange(newValue)
                                                        if (newValue) {
                                                            setInputValue(newValue.label)
                                                            setOptions([newValue])
                                                        } else {
                                                            setInputValue("")
                                                        }
                                                    }}
                                                    loading={loading22}
                                                    filterOptions={(x) => x}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            required
                                                            label="¿Quién lo invitó? (Escriba su nombre)"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <>
                                                                        {loading22 && <CircularProgress size={20} />}
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
                                <div className="flex flex-row gap-3 w-full">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        className="w-full"
                                        disabled={loading || loadingUpload}
                                    >
                                        {`Pagar: S/. ${changeDecimales(getValues()?.sumaTotalPago)}`}
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setOpen(false)
                                            setOpenPopup(false)
                                        }}
                                        variant="contained"
                                        color="error"
                                        type="button"
                                        // className="w-full"
                                        disabled={loading || loadingUpload}
                                    >
                                        {"Cancelar"}
                                    </Button>
                                </div>
                            </div>
                        }
                        {
                            getValues()?.cambiarStatusAsiento == true &&
                            <div className="flex flex-col gap-3">
                                <div className="uppercase text-center text-base font-bold text-black">
                                    {"Datos Usuario"}
                                </div>
                                <div className="flex flex-col gap-3">
                                    <FormComprarTicket {...{ getValues, setValue, handleSubmit, control, apiCall, loading, error }} />
                                </div>
                                <div className="mt-0">
                                    <Controller
                                        name={"patrocinadorId"}
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                options={options}
                                                getOptionLabel={(option) => option?.label || ""}
                                                isOptionEqualToValue={(option, value) => option?.value === value?.value}
                                                value={field.value || null}
                                                inputValue={inputValue}
                                                // Validation can be handled via the Controller or form logic
                                                onInputChange={(_, newInputValue) => {
                                                    setInputValue(newInputValue)
                                                    if (newInputValue.length >= 3) {
                                                        handleSearch(newInputValue)
                                                    }
                                                }}
                                                onChange={(_, newValue) => {
                                                    field.onChange(newValue)
                                                    if (newValue) {
                                                        setInputValue(newValue.label)
                                                        setOptions([newValue])
                                                    } else {
                                                        setInputValue("")
                                                    }
                                                }}
                                                loading={loading22}
                                                filterOptions={(x) => x}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        required
                                                        label="Buscar persona (DNI o nombres)"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <>
                                                                    {loading22 && <CircularProgress size={20} />}
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
                                <div className="flex flex-row gap-3 w-full">
                                    <Button
                                        variant="contained"
                                        color="success"
                                        type="submit"
                                        className="w-full"
                                        disabled={loading || loadingUpload}
                                    >
                                        Editar Datos
                                    </Button>
                                </div>
                            </div>
                        }
                    </form>
                </div>
            </div>
        </>
    )
}