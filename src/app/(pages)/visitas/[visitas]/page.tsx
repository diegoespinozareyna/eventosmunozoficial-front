"use client"

import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import useApi from "@/app/hooks/fetchData/useApi"
import { Autocomplete, Button, IconButton, TextField } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Controller, set, useFieldArray, useForm } from "react-hook-form"
import "./styleButton.css"
import { Evento200Sale } from "@/app/components/Escenarios/Evento200/Evento200Sale"
import { Evento250Sale } from "@/app/components/Escenarios/Evento250/Evento250Sale"
import { Evento300Sale } from "@/app/components/Escenarios/Evento300/Evento300Sale"
import Swal from "sweetalert2"
import { StatusLotes } from "@/app/configs/proyecto/statusLotes"
import { ChevronsLeft, Circle, CircuitBoard, Edit2Icon, FileText, Octagon, OctagonIcon, SquaresExclude, Upload, X } from "lucide-react"
import { changeDecimales } from "@/app/functions/changeDecimales"
import { usePopUp } from "@/app/hooks/popup/usePopUp"
import Image from "next/image"
import TicketLoaderMotion from "@/app/components/loader/TicketLoader"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { IoMdEye } from "react-icons/io"
import moment from "moment-timezone"
import { PopUp } from "@/app/components/popUp/PopUp"
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PiMicrosoftExcelLogoLight } from "react-icons/pi";
import { Bus50 } from "@/app/components/sprinterssvg/Bus50"
import { handleApiReniec } from "@/app/functions/handleApiReniec"
import { handleApiReniec2 } from "@/app/functions/handleApiReniec2"
import { useUserStore } from "@/app/store/userStore"

// Extend the Window interface to include VisanetCheckout
declare global {
    interface Window {
        VisanetCheckout?: {
            open: () => void;
            configure: (config: any) => any;
            configuration: {
                complete: (response: any) => void;
            };
        };
    }
}

export default function Eventos() {

    const [info, setInfo] = useState<any>(null)
    const router = useRouter()

    // const usuarioActivo = useUserStore(state => state.user)
    // console.log(usuarioActivo)

    useEffect(() => {
        console.log("info: ", info)
    }, [info])

    const params: any = useParams()
    // console.log("params: ", params?.visitas)

    const { getValues, setValue, handleSubmit, control, watch, reset } = useForm()

    const { fields, append, remove, insert } = useFieldArray({
        control,
        name: "asientos",
    });

    const formValues = watch();
    // console.log("formValues: ", formValues)

    const { apiCall, loading, error } = useApi()
    const { openPopup, setOpenPopup } = usePopUp()
    const [isLoading, setIsLoading] = useState(true);
    const [loadingUpload, setLoadigUpload] = useState(false)

    const [openAsientos, setOpenAsientos] = useState(false)

    const [open, setOpen] = useState(false)
    const [dataAsientos, setDataAsientos] = useState<any>(null)
    const [dataAsientosComprados, setDataAsientosComprados] = useState<any>(null)
    const [idAgregante, setIdAgregante] = useState<any>(2)
    const [valorRef, setValorRef] = useState<any>(2)
    const [change1, setChange1] = useState(false)
    const [arrAsientoSeleccionados, setArrAsientoSeleccionados] = useState<any>([])
    const [getInitialStateFirstAsiento, setGetInitialStateFirstAsiento] = useState(2)

    useEffect(() => {
        console.log("arrAsientoSeleccionados: ", arrAsientoSeleccionados)
    }, [arrAsientoSeleccionados])

    const usersPatrocinaddores = async () => {
        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/users/getUsersPatrocinadores`
        const response: any = await apiCall({
            method: "get", endpoint: url,
        });
        console.log("responseEventId: ", response?.data);

        const patrocinadores = response?.data?.map((item: any) => {
            return {
                value: item?._id,
                label: `${item?.documentoUsuario} - ${item?.nombres} ${item?.apellidoPaterno} ${item?.apellidoMaterno}`,
            }
        })

        setValue("usersPatrocinadores", patrocinadores)
    }

    const fetchAsientosIdMatrix = async () => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/getAsientosIdMatrix`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                    idMatrix: params?.visitas?.split("-")[1],
                }
            });
            console.log("responseEventId: ", response?.data);
            setDataAsientosComprados(response?.data?.filter((x: any) => x?.status !== "3"));
            console.log(info?.dateEvent)

            // let ref = 2;

            // if (idAgregante == 2) {
            //     ref = idAgregante

            // if (response?.data?.length > 0) {
            const paths: any = document.querySelectorAll(`#${Apis.PROYECTCURRENT} path`);
            const matchAll = response?.data?.filter((obj2: any) => obj2?.status !== "3")?.length;
            console.log("matchAll: ", matchAll)
            paths.forEach((obj1: any) => {
                const match = response?.data?.find((obj2: any) => obj2?.codAsiento === obj1?.id && obj2?.status !== "3");
                setGetInitialStateFirstAsiento(matchAll + 2)
                setValorRef(matchAll + 2)
                const hoy = new Date();
                const fechaFin = new Date(match?.fechaFin); // Asegúrate de que sea Date
                // console.log("fechaFin: ", fechaFin)
                const fechaEvento = new Date(info?.dateEvent) // Asegúrate de que sea Date
                // if (fechaEvento !== null && fechaEvento !== undefined) {
                //     console.log(info?.dateEvent, fechaEvento)
                // }

                const milisegundosEnUnDia = 24 * 60 * 60 * 1000;
                const diferencia = fechaFin.getTime() - hoy.getTime();
                const diferencia2 = fechaEvento.getTime() - hoy.getTime();


                if (match?.status == "1") {
                    // console.log("match?.status", match)
                    // obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.status == "0") {
                    // console.log("match?.status", match)
                    // obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('fill', "#f9bc38");
                    obj1?.setAttribute('stroke', match?.patrocinadorId == usuarioActivo?._id ? "#f00" : '#333');
                    obj1?.setAttribute('stroke-width', match?.patrocinadorId == usuarioActivo?._id ? "1" : '0.3')
                }
                else if (arrAsientoSeleccionados?.find((x: any) => x == obj1?.id)) {
                    // console.log("arrAsientoSeleccionados", arrAsientoSeleccionados)
                    // console.log("obj1?.id", obj1?.id)
                    // console.log("valorRef", valorRef)
                    obj1?.setAttribute('fill', "#ccf"); // azul asiento no disponible
                    obj1?.setAttribute('stroke', '#00f');
                    obj1?.setAttribute('stroke-width', '0.7')
                }
                // else if (obj1?.id == idAgregante) {
                //     obj1?.setAttribute('fill', "#aaf"); // azul asiento no disponible
                //     obj1?.setAttribute('stroke', '#f00');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                else if (Number(obj1?.id?.split("-")[1]) == 1) {
                    // console.log("arrAsientoSeleccionados", arrAsientoSeleccionados)
                    // console.log("obj1?.id", obj1?.id)
                    // console.log("valorRef", valorRef)
                    obj1?.setAttribute('fill', "#aaa"); // plomo asiento no disponible
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (Number(obj1?.id?.split("-")[1]) == (matchAll + 2) && Number(obj1?.id?.split("-")[1]) != 1) {
                    // console.log("arrAsientoSeleccionados", arrAsientoSeleccionados)
                    // console.log("obj1?.id", obj1?.id)
                    // console.log("valorRef", valorRef)
                    obj1?.setAttribute('fill', "#fff"); // amarillo claro asiento disponible
                    obj1?.setAttribute('stroke', '#000');
                    obj1?.setAttribute('stroke-width', '0.6')
                }
                else {
                    // console.log("arrAsientoSeleccionados", arrAsientoSeleccionados)
                    // console.log("obj1?.id", obj1?.id)
                    // console.log("valorRef", valorRef)

                    obj1?.setAttribute('fill', "#aaa");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                // setValorRef((prev: any) => (prev) + 1)
            })
            // }
            // }
            return (response?.data?.filter((x: any) => x?.status !== "3"))
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }

    const fetchAsientosIdMatrix2 = async () => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/getAsientosIdMatrix`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                    idMatrix: params?.visitas?.split("-")[1],
                }
            });
            console.log("responseEventId: ", response?.data);
            setDataAsientosComprados(response?.data?.filter((x: any) => x?.status !== "3"));
            console.log(info?.dateEvent)
            const paths = document.querySelectorAll(`#${Apis.PROYECTCURRENT} path`);
            paths.forEach(obj1 => {
                const match = response?.data?.find((obj2: any) => obj2?.codAsiento === obj1?.id && obj2?.status !== "3");
                const matchAll = response?.data?.filter((obj2: any) => obj2?.codAsiento === obj1?.id && obj2?.status !== "3")?.length;
                console.log("matchAll: ", matchAll)
                if (match?.status == "1") {
                    // console.log("match?.status", match)
                    // obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.status == "0") {
                    obj1?.setAttribute('fill', "#f9bc38");
                    obj1?.setAttribute('stroke', match?.patrocinadorId == usuarioActivo?._id ? "#f00" : '#333');
                    obj1?.setAttribute('stroke-width', match?.patrocinadorId == usuarioActivo?._id ? "1" : '0.3')
                }
                else if (arrAsientoSeleccionados?.find((x: any) => x == obj1?.id)) {
                    obj1?.setAttribute('fill', "#ccf"); // azul asiento no disponible
                    obj1?.setAttribute('stroke', '#00f');
                    obj1?.setAttribute('stroke-width', '0.7')
                }
                else if (Number(obj1?.id?.split("-")[1]) == 1) {
                    obj1?.setAttribute('fill', "#aaa"); // plomo asiento no disponible
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (Number(obj1?.id?.split("-")[1]) == valorRef && Number(obj1?.id?.split("-")[1]) != 1) {
                    obj1?.setAttribute('fill', "#fff"); // amarillo claro asiento disponible
                    obj1?.setAttribute('stroke', '#000');
                    obj1?.setAttribute('stroke-width', '0.6')
                }
                else {
                    obj1?.setAttribute('fill', "#aaa");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
            })
            return (response?.data?.filter((x: any) => x?.status !== "3"))
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }

    useEffect(() => {
        fetchAsientosIdMatrix()
        // usersPatrocinaddores()
    }, [info])

    useEffect(() => {
        fetchAsientosIdMatrix2()
        // usersPatrocinaddores()
    }, [change1])

    const fetchEventId = async (id: string | string[]) => {
        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/getPasajesId`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                    id: id,
                }
            });
            console.log("responseEventId: ", response?.data?.[0]);
            setInfo(response?.data?.[0]);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }

    useEffect(() => {
        if (params?.visitas !== "new" && params?.visitas !== "" && params?.visitas !== undefined && params?.visitas !== null) {
            fetchEventId(params?.visitas?.split("-")[1])
        }
    }, [params?.visitas])

    useEffect(() => {
        try {
            const user = localStorage.getItem('auth-token');
            const decoded: any = jwtDecode(user as string);
            console.log('Datos del usuario:', decoded?.user);
            setValue("user", decoded?.user);
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setValue("user", []);
        }
    }, [open, openAsientos, openPopup])

    const [usuarioActivo, setUsuarioActivo] = useState<any>(null)

    useEffect(() => {
        try {
            const user = localStorage.getItem('auth-token');
            const decoded: any = jwtDecode(user as string);
            console.log('Datos del usuario:', decoded?.user);
            setValue("user", decoded?.user);
            setUsuarioActivo(decoded?.user)
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
            setValue("user", []);
        }
    }, [])

    // useEffect(() => {
    //     console.log(usuarioActivo)
    // }, [usuarioActivo])

    const handleVouchersAsiento = async (codAsiento: any, eventoId: any, idIcketAsiento: any) => {
        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/eventos/vouchersEventosPorAsiento`
        const response: any = await apiCall({
            method: "get", endpoint: url, data: null, params: {
                codAsiento: codAsiento,
                id: eventoId,
                idIcketAsiento: idIcketAsiento,
                proyecto: Apis.PROYECTCURRENT,
            }
        });
        console.log("responseEventId: ", response?.data);
        setValue("vouchersAsiento", response?.data?.filter((x: any) => x?.status !== "3"));
    }

    // useEffect(() => {
    //     console.log("valorRef: ", valorRef)
    // }, [valorRef])

    const handleClickInformation = async (codAsiento: any, valueBoolean: boolean, precioAll: any) => {
        console.log('Click en la información', codAsiento);
        console.log('Click en la valueBoolean', valueBoolean);
        console.log('Click en la precioAll', precioAll);
        console.log('Click info', info);
        let ref = 2;

        if (Number(codAsiento?.split("-")[1]) == valorRef) {
            if (
                idAgregante == codAsiento
                &&
                Number(codAsiento?.split("-")[1]) !== getInitialStateFirstAsiento
            ) {
                console.log("entre99", Number(codAsiento?.split("-")[1]))
                null
            }
            else {
                console.log("entre2", Number(codAsiento?.split("-")[1]))
                setIdAgregante(codAsiento)
                setValorRef((prev: any) => Number(prev) + 1)
                setChange1(!change1)
                setArrAsientoSeleccionados([...arrAsientoSeleccionados, codAsiento])
                if (usuarioActivo?.role == "admin" || usuarioActivo?.role == "super admin" || usuarioActivo?.role == "user asesor") {

                    const montoTotalPasarela = getValues()?.asientos?.reduce((acum: any, item: any) => {
                        return (Number(acum) + Number(item.precio))
                    }, 0)
                    console.log("montoTotalPasarela: ", montoTotalPasarela)

                    const grupoAsientosComprados = getValues()?.asientos?.map((item: any, index: any) => {
                        return item.codAsiento
                    })

                    append({
                        status: "0", // "0": pendiente, "1": aprobado, "2": rechazado, "3": anulado
                        documentoUsuario: usuarioActivo.documentoUsuario,
                        nombres: usuarioActivo.nombres,
                        apellidoPaterno: usuarioActivo.apellidoPaterno,
                        apellidoMaterno: usuarioActivo.apellidoMaterno,
                        celular: usuarioActivo.celular,
                        email: usuarioActivo.email,
                        codAsiento: codAsiento, // numero de asiento
                        precio: info?.precioAsiento,
                        codMatrixTicket: info?._id, // codigo id de evento
                        // fileUrl: String,
                        compraUserAntiguo: true,
                        proyecto: Apis.PROYECTCURRENT,
                        usuarioRegistro: `${usuarioActivo?.documentoUsuario ?? "Invitado"} - ${usuarioActivo?.nombres ?? "Invitado"} ${usuarioActivo?.apellidoPaterno ?? "Invitado"} ${usuarioActivo?.apellidoMaterno ?? "Invitado"}`,
                        patrocinadorId: usuarioActivo._id,
                        fechaFin: moment.tz(new Date(), "America/Lima").add(7, "days").format("YYYY-MM-DDTHH:mm"),
                        montoPasarela: montoTotalPasarela?.toString(),
                        grupoAsientosComprados: grupoAsientosComprados.join(','),
                        paradero: "0",
                    })
                }
                else {
                    append({
                        codAsiento: codAsiento, // numero de asiento
                        precio: info?.precioAsiento,
                        codMatrixTicket: info?._id, // codigo id de evento
                    })
                }
            }
        }
        else {
            setValorRef(valorRef)
            setIdAgregante(codAsiento)
            setChange1(!change1)
            const asientoSelect = dataAsientosComprados.find((x: any) => x?.codAsiento == codAsiento)
            setValorAsientoPatch(asientoSelect)
            if (usuarioActivo?._id !== asientoSelect?.patrocinadorId) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "No tiene permiso para realizar esta acción",
                });
            }
            else if (usuarioActivo?._id == asientoSelect?.patrocinadorId && asientoSelect?.status !== "1") {
                handleEditAsiento(asientoSelect, codAsiento)
            }
            console.log("asientoSelect: ", asientoSelect)
        }
    }

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    const handleAddVoucherAsiento = async (data: any, codAsiento: any) => {
        const urlVoucher = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/eventos/newVoucherEventos`
        const jsonPagoAsiento = {
            //id reconocimiento
            codEvento: params?.eventos?.split("-")[1],
            idTicketAsiento: data?._id,
            nOperacion: new Date().getTime(),
            codAsiento: codAsiento,
            //datos pago
            fechaPago: moment.tz(new Date(), "America/Lima").format("YYYY-MM-DDTHH:mm"),
            documentoUsuario: data?.documentoUsuario,
            proyecto: Apis.PROYECTCURRENT,
            // url: res.data.url, despues de subir la img al servidor se agrega
            // status
            status: "0", // "0" pendiente, "1" aprobado, "2" rechazado
        }
        try {
            setLoadigUpload(true)
            const formData = new FormData();
            formData.append("image", getValues()?.fileEvent);
            const res = await axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV2}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (res.status == 200) {
                const responseVoucher = await apiCall({
                    method: "post", endpoint: urlVoucher, data: { ...jsonPagoAsiento, url: res.data.url }
                })
                console.log("responseVoucher: ", responseVoucher)
                if (responseVoucher.status === 201) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Se agregó el voucher con éxito',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        // showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        // cancelButtonColor: '#d33',
                        // cancelButtonText: 'No',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false,
                        // preConfirm: () => {
                        //     router.push(`/dashboard/verUsuarios`);
                        //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
                        //     return
                        // },
                    });
                    handleVouchersAsiento(jsonPagoAsiento?.codAsiento, params?.eventos?.split("-")[1], data?._id)
                    setValue(`fileUrl`, "")
                    fetchAsientosIdMatrix()
                }
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
        finally {
            setLoadigUpload(false)
        }
    }

    const onSubmit = async (data: any) => {
        // console.log(data)
        try {
            const user = localStorage.getItem('auth-token');
            const decoded: any = jwtDecode(user as string);
            // console.log('Datos del usuario:', decoded?.user);
            setValue("userVenta", decoded?.user);
        } catch (error) {
            setValue("userVenta", null);
        }

        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/compraAsientoAll`
        const url2 = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/editarAsiento`
        const jsonSend = {
            asientos: data?.asientos,
            status: "0",
            proyecto: Apis.PROYECTCURRENT,
            usuarioRegistro: `${getValues()?.userVenta?.documentoUsuario ?? "Invitado"} - ${getValues()?.userVenta?.nombres ?? "Invitado"} ${getValues()?.userVenta?.apellidoPaterno ?? "Invitado"} ${getValues()?.userVenta?.apellidoMaterno ?? "Invitado"}`,
            compraUserAntiguo: getValues(`UsuarioAntiguo`),
            fechaFin: moment.tz(new Date(), "America/Lima").add(7, "days").format("YYYY-MM-DDTHH:mm"),
        }
        console.log("jsonSend: ", jsonSend)

        const montoTotalPasarela = getValues()?.asientos?.reduce((acum: any, item: any) => {
            return (Number(acum) + Number(item.precio))
        }, 0)
        console.log("montoTotalPasarela: ", montoTotalPasarela)

        const grupoAsientosComprados = getValues()?.asientos?.map((item: any, index: any) => {
            return item.codAsiento
        })

        const jsonAsientosAll = getValues()?.asientos?.map((item: any, index: any) => {
            return {
                status: (usuarioActivo?.role !== "super admin" && usuarioActivo?.role !== "admin" && usuarioActivo?.role !== "user asesor") ? "1" : "0", // "0": pendiente, "1": aprobado, "2": rechazado, "3": anulado
                documentoUsuario: item.documentoUsuario,
                nombres: item.nombres,
                apellidoPaterno: item.apellidoPaterno,
                apellidoMaterno: item.apellidoMaterno,
                celular: item.celular,
                email: item.email,
                codAsiento: item.codAsiento, // numero de asiento
                precio: item.precio,
                codMatrixTicket: item.codMatrixTicket, // codigo id de evento
                // fileUrl: String,
                compraUserAntiguo: item.UsuarioAntiguo,
                proyecto: Apis.PROYECTCURRENT,
                usuarioRegistro: `${getValues()?.userVenta?.documentoUsuario ?? "Invitado"} - ${getValues()?.userVenta?.nombres ?? "Invitado"} ${getValues()?.userVenta?.apellidoPaterno ?? "Invitado"} ${getValues()?.userVenta?.apellidoMaterno ?? "Invitado"}`,
                patrocinadorId: item?.patrocinadorId,
                fechaFin: moment.tz(new Date(), "America/Lima").add(7, "days").format("YYYY-MM-DDTHH:mm"),
                montoPasarela: montoTotalPasarela?.toString(),
                grupoAsientosComprados: grupoAsientosComprados.join(','),
                paradero: item.paradero,
            }
        })
        console.log("jsonAsientosAll: ", jsonAsientosAll)

        if (getValues()?.fileEvent !== "" && getValues()?.fileEvent !== undefined && getValues()?.fileEvent !== null) {
            try {
                setLoadigUpload(true)
                // if (!getValues()?.fileEvent && !getValues(`flyerEvent`)?.fileUrl) return alert("Selecciona una imagen");
                const formData = new FormData();
                formData.append("image", getValues()?.fileEvent);
                const res = await axios.post(`${Apis.URL_APOIMENT_BACKEND_DEV2}/upload`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.status == 200) {
                    // const response = await apiCall({
                    //     method: "post", endpoint: url, data: { ...jsonSend, fileUrl: res.data.url }
                    // })
                    // console.log("responsefuianl: ", response)
                    const response = await apiCall({
                        method: "post", endpoint: url, data: jsonAsientosAll?.map((item: any, index: any) => {
                            return {
                                ...item,
                                fileUrl: res.data.url,
                                patrocinadorId: getValues()?.patrocinadorId?._id ?? usuarioActivo?._id,
                            }
                        })
                    })
                    console.log("response: ", response)
                    if (response.status === 201) {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Se compró el/los asiento(s) con éxito',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            // showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            // cancelButtonColor: '#d33',
                            // cancelButtonText: 'No',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                            // preConfirm: () => {
                            //     router.push(`/dashboard/verUsuarios`);
                            //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
                            //     return
                            // },
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 800);
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'No se ha podido reservar asiento',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            // cancelButtonText: 'No',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                            // preConfirm: () => {
                            //     return
                            // },
                        });
                    }


                }
            }
            catch (error) {
                console.error('Error al enviar datos:', error);
            }
            finally {
                // setLoadigUpload(false)
                // fetchAsientosIdMatrix()
            }
        }
        // else if (getValues()?.cambiarStatusAsiento !== true) {
        //     try {
        //         const response = await apiCall({
        //             method: "post", endpoint: url, data: { ...jsonSend, montoPasarela: getValues()?.montoPasarela }
        //         })
        //         console.log("responsefuianl: ", response)
        //         if (response.status === 201) {
        //             Swal.fire({
        //                 title: 'Éxito',
        //                 text: 'Se reservó asiento con éxito',
        //                 icon: 'success',
        //                 confirmButtonText: 'OK',
        //                 // showCancelButton: true,
        //                 confirmButtonColor: '#3085d6',
        //                 // cancelButtonColor: '#d33',
        //                 // cancelButtonText: 'No',
        //                 showLoaderOnConfirm: true,
        //                 allowOutsideClick: false,
        //                 timer: 3000,
        //                 // preConfirm: () => {
        //                 //     router.push(`/dashboard/verUsuarios`);
        //                 //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
        //                 //     return
        //                 // },
        //             });
        //             reset({
        //                 usersPatrocinadores: getValues()?.usersPatrocinadores,
        //             })
        //             setOpen(false)
        //             setOpenPopup(false)
        //         } else {
        //             Swal.fire({
        //                 title: 'Error!',
        //                 text: 'No se ha podido reservar asiento',
        //                 icon: 'error',
        //                 confirmButtonText: 'OK',
        //                 showCancelButton: true,
        //                 confirmButtonColor: '#3085d6',
        //                 cancelButtonColor: '#d33',
        //                 // cancelButtonText: 'No',
        //                 showLoaderOnConfirm: true,
        //                 allowOutsideClick: false,
        //                 // preConfirm: () => {
        //                 //     return
        //                 // },
        //             });
        //         }

        //     }
        //     catch (error) {
        //         console.error('Error al enviar datos:', error);
        //     }
        //     finally {
        //         fetchAsientosIdMatrix()
        //     }
        // }
        // else if (getValues()?.cambiarStatusAsiento == true) { // cambiar datos de usuario (editar)
        //     try {
        //         const response = await apiCall({
        //             method: "patch", endpoint: url2, data: {
        //                 id: getValues()?.idEditarAsiento,
        //                 nombres: data?.nombres,
        //                 apellidoPaterno: data?.apellidoPaterno,
        //                 apellidoMaterno: data?.apellidoMaterno,
        //                 celular: data?.celular,
        //                 documentoUsuario: data?.documentoUsuario,
        //                 patrocinadorId: data?.patrocinadorId,
        //                 compraUserAntiguo: getValues()?.UsuarioAntiguo,
        //             }
        //         })
        //         console.log("responsefuianl: ", response)
        //         if (response.status === 201) {
        //             Swal.fire({
        //                 title: 'Éxito',
        //                 text: 'Se edito asiento con éxito',
        //                 icon: 'success',
        //                 confirmButtonText: 'OK',
        //                 // showCancelButton: true,
        //                 confirmButtonColor: '#3085d6',
        //                 // cancelButtonColor: '#d33',
        //                 // cancelButtonText: 'No',
        //                 showLoaderOnConfirm: true,
        //                 allowOutsideClick: false,
        //                 timer: 3000,
        //                 // preConfirm: () => {
        //                 //     router.push(`/dashboard/verUsuarios`);
        //                 //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
        //                 //     return
        //                 // },
        //             });
        //             reset({
        //                 usersPatrocinadores: getValues()?.usersPatrocinadores,
        //             })
        //             setOpen(false)
        //             setOpenPopup(false)
        //         } else {
        //             Swal.fire({
        //                 title: 'Error!',
        //                 text: 'No se ha podido edito asiento',
        //                 icon: 'error',
        //                 confirmButtonText: 'OK',
        //                 showCancelButton: true,
        //                 confirmButtonColor: '#3085d6',
        //                 cancelButtonColor: '#d33',
        //                 // cancelButtonText: 'No',
        //                 showLoaderOnConfirm: true,
        //                 allowOutsideClick: false,
        //                 // preConfirm: () => {
        //                 //     return
        //                 // },
        //             });
        //         }

        //     }
        //     catch (error) {
        //         console.error('Error al enviar datos:', error);
        //     }
        //     finally {
        //         fetchAsientosIdMatrix()
        //     }
        // }
    }

    const handleChangeState = async (id: string, codAsiento: any, key: any) => {
        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/eventos/changeStatusAsiento`;
        const url2 = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/eventos/changeStatusVoucherAsiento`;
        console.log("url", url);

        const { isConfirmed } = await Swal.fire({
            title: `Cambiar estado`,
            html: key == "statusAsiento" ? `
            <select id="estado" class="swal2-input">
              <option value="">Selecciona un estado</option>
              <option value="0">Pendiente</option>
              <option value="1">Aprobado</option>
              <option value="3">Liberar</option>
              <option value="4">No Disponible Asesor</option>
              <option value="5">No Disponible Invitado</option>
            </select>
            <textarea id="comentario" class="swal2-textarea" placeholder="Escribe un comentario"></textarea>
          ` : key == "statusVoucher" && `
          <select id="estado" class="swal2-input">
            <option value="">Selecciona un estado</option>
            <option value="0">Pendiente</option>
            <option value="1">Aprobado</option>
            <option value="2">Rechazado</option>
          </select>
          <textarea id="comentario" class="swal2-textarea" placeholder="Escribe un comentario"></textarea>
        `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            width: '400px',
            allowOutsideClick: () => !Swal.isLoading(),
            showLoaderOnConfirm: true,
            preConfirm: async () => {
                const estado = (document.getElementById('estado') as HTMLSelectElement).value;
                const comentario = (document.getElementById('comentario') as HTMLTextAreaElement).value.trim();

                if (!estado) {
                    Swal.showValidationMessage('Debes seleccionar un estado');
                    return;
                }
                try {
                    if (key === "statusVoucher") {
                        console.log("entreliuberar voucher")
                        console.log("entreliuberar asiento", id, estado, comentario)
                        const response = await apiCall({
                            method: 'patch',
                            endpoint: url2,
                            data: {
                                status: estado,
                                comentario,
                                id
                            }
                        });
                        console.log("entreliuberar asiento", id, estado, comentario)
                        console.log("response", response)
                        if (response.status === 201) {
                            const ticketsAsientosno3 = await fetchAsientosIdMatrix()
                            handleVouchersAsiento(codAsiento, params?.eventos?.split("-")[1], ticketsAsientosno3?.find((x: any) => x?.codAsiento == codAsiento)?._id)
                        }
                    }
                    else if (key === "statusAsiento") {
                        console.log("entreliuberar asiento")
                        const response = await apiCall({
                            method: 'patch',
                            endpoint: url,
                            data: {
                                status: estado,
                                comentario,
                                id
                            }
                        });
                        console.log("entreliuberar asiento", id, estado, comentario)
                        console.log("response", response)
                        if (response.status === 201) {
                            fetchAsientosIdMatrix()
                        }
                    }
                } catch (error) {
                    Swal.showValidationMessage(`Error al actualizar: ${error}`);
                }


            }
        });

        if (isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Estado actualizado',
                text: `El estado del pedido fue actualizado correctamente.`,
                timer: 2000
            });

            // fetchData();
        }
    };

    const [options, setOptions] = useState([]);
    // const [loading, setLoading] = useState(false);

    const handleSearch = async (query: any) => {
        // setLoading(true);
        try {
            // const res = await axios.get(`/api/users/search?q=${query}`);
            // setOptions(res.data);

            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/users/getPatrocinadoresUnique`
            const response: any = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                    query: query,
                }
            });
            console.log("responseEventId: ", response?.data);
            setValue("usersPatrocinadores", response?.data);


        } catch (err) {
            console.error('Error fetching users:', err);
        }
        // setLoading(false);
    };

    const handleDownload = () => {
        const cleanData: any[] = dataAsientosComprados.map((item: any) => ({
            Documento: item.documentoUsuario,
            Nombres: item.nombres,
            Paterno: item.apellidoPaterno,
            Materno: item.apellidoMaterno,
            Celular: item.celular || '',
            Asiento: item.codAsiento,
            Precio: item.precio,
            // Proyecto: item.proyecto,
            RegistroPor: item.usuarioRegistro,
            FechaFin: item.fechaFin,
            FechaCreacion: item.createdAt,
            Estado: item.status == "0" ? 'Pendiente Pago' : item.status == "1" ? 'Vendido' : item.status == "2" ? 'Liberado' : 'Bloqueado',
            '¿Pasarela?': item.isPasarela ? 'Sí' : 'No',
            '¿Compra Asesor/Invitado?': item.compraUserAntiguo ? 'Asesor' : 'Invitado',
            Vouchers: item.vouchersTotales?.map((v: any) => v.url).join('\n') || ''
        }));

        const worksheet: any = XLSX.utils.json_to_sheet(cleanData);
        const workbook: any = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob: any = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'reporte.xlsx');
    };

    useEffect(() => {
        setValue("sumaTotalPago", getValues()?.asientos?.reduce((acum: any, item: any) => {
            return Number(acum) + Number(item.precio)
        }, 0))
    }, [change1])

    const onValid = (data: any) => {
        console.log("form validado, proceder con compra", data);
        setOpenPopup(true)
        setValue("comprarAsientos", true)
        setValue("pasarelaPay", false)
        setValue("siPasarelaPay", false)
        setValue("dataPoUp", {
            title: `Subir Voucher`,
            infoOrder: "new",
            action: "subirVoucher",
        })
    };

    const onInvalid = (errors: any) => {
        console.log("errores:", errors);
        // aquí podrías abrir el popup o mostrar mensajes
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "No se ha podido enviar el formulario, por favor verifica los campos",
        });
    };

    const [openPopupFinal, setOpenPopupFinal] = useState(false)
    const [valorAsientoPatch, setValorAsientoPatch] = useState<any>(null)

    const handleEditAsiento = async (asientoSelect: any, data: any) => {
        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/editarAsiento`
        setOpenPopupFinal(true)
    }

    const handleEditAsientoFinal = async () => {

        try {
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/editAsientoAll`

            const jsonAsientosAll = {
                id: valorAsientoPatch?._id,
                status: "1",
                documentoUsuario: getValues()?.documentoUsuario,
                nombres: getValues()?.nombres ?? "",
                apellidoPaterno: getValues()?.apellidoPaterno ?? "",
                apellidoMaterno: getValues()?.apellidoMaterno ?? "",
                celular: getValues()?.celular ?? "",
                email: getValues()?.email ?? "",
            }
            console.log("jsonAsientosAll: ", jsonAsientosAll)

            const response = await apiCall({
                method: "patch", endpoint: url, data: jsonAsientosAll
            })
            console.log("responsefuianl: ", response)
            if (response.status === 201) {
                Swal.fire({
                    title: 'Éxito',
                    text: 'Se edite el asiento con éxito',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    // showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    // cancelButtonColor: '#d33',
                    // cancelButtonText: 'No',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    // preConfirm: () => {
                    //     router.push(`/dashboard/verUsuarios`);
                    //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
                    //     return
                    // },
                });
                // reset({
                //     usersPatrocinadores: getValues()?.usersPatrocinadores,
                // })
                // setOpen(false)
                // setOpenPopup(false)
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: 'No se ha podido editar el asiento',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    // cancelButtonText: 'No',
                    showLoaderOnConfirm: true,
                    allowOutsideClick: false,
                    // preConfirm: () => {
                    //     return
                    // },
                });
            }
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    }

    return (
        <div className="bg-blue-500 h-[100vh]">
            {/* {isLoading && <TicketLoaderMotion />} */}
            <div className="!max-w-full relative z-20 w-full flex items-center justify-center bg-blue-500">
                {
                    true &&
                    <div className="bg-blue-500 flex flex-col -mt-3 w-full">
                        <div>
                            <button className="bg-blue-500 text-white px-2 py-2 relative z-20 font-bold text-xl cursor-pointer rounded-lg ml-0 mt-2 flex justify-center items-center"
                                onClick={() => {
                                    router.push(`/dashboard/pasajes`)
                                }}
                            >
                                <ChevronsLeft
                                    color={"#fff"}
                                />
                            </button>
                        </div>
                        <>
                            <div className='flex flex-col bg-blue-500 justify-start items-center gap-4 p-4 w-full px-1 overflow-y-auto'>
                                <div className='flex flex-col justify-center items-center w-full md:w-full max-w-4xl gap-4'>
                                    <div className='flex flex-col gap-1 justify-center items-center'>
                                        <h1 className='text-center text-white text-2xl font-bold'>
                                            {info?.titulo}
                                        </h1>
                                        <h1 className='text-center text-white text-2xl font-bold'>
                                            {moment.tz(info?.fechaVisita, "America/Lima").format("DD/MM/YYYY")}
                                        </h1>
                                    </div>

                                    {/* contadores */}
                                    <div id='counters' className='flex flex-col w-full gap-2'>
                                        <div className='text-white flex justify-start items-start gap-4 font-bold uppercase'>
                                            {/* Contadores */}
                                        </div>
                                        <div className='flex w-full flex-col md:flex-row gap-1 justify-center items-center bg-white rounded-lg px-3 py-2'>
                                            <div className='flex flex-col w-full px-2 py-1 border rounded-lg border-green-100 bg-green-50'>
                                                <div>
                                                    Total Pasajeros:
                                                </div>
                                                <div className='font-bold text-green-400'>
                                                    {`${getInitialStateFirstAsiento - 2}`}
                                                </div>
                                            </div>
                                            <div className='flex flex-col w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                <div>
                                                    {"Buses Completados: (50)"}
                                                </div>
                                                <div className='font-bold text-blue-400'>
                                                    {`${"0"}`}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* asientosBuses */}
                                    <div id='asientosBuses' className='flex flex-col w-full gap-2'>
                                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2 pb-20'>
                                            <div className='flex w-full justify-between'>
                                                <div className='flex justify-center items-center gap-4 mt-4'>
                                                    {/* <div className='scale-200 -mt-2'>
                                                        🚌
                                                    </div> */}
                                                    <div className='scale-100 -mt-2 flex flex-col md:flex-row justify-start items-start gap-2'>
                                                        <div className='scale-100 -mt-2 flex justify-center items-center gap-2'>
                                                            <Circle className="h-5 w-5 bg-[#61baed] rounded-full" />
                                                            <div>
                                                                <h1 className='text-md font-bold'>
                                                                    {`${"Vendido"}`}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <div className='scale-100 -mt-2 flex justify-center items-center gap-2'>
                                                            <Circle className="h-5 w-5 bg-[#f9bc38] rounded-full" />
                                                            <div>
                                                                <h1 className='text-md font-bold'>
                                                                    {`${"Reservado"}`}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <div className='scale-100 -mt-2 flex justify-center items-center gap-2'>
                                                            <Circle className="h-5 w-5 bg-[#fff] rounded-full" />
                                                            <div>
                                                                <h1 className='text-md font-bold'>
                                                                    {`${"Disponible"}`}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <div className='scale-100 -mt-2 flex justify-center items-center gap-2'>
                                                            <Circle color="#00f" className="h-5 w-5 bg-[#ccf] rounded-full border border-[00f]" />
                                                            <div>
                                                                <h1 className='text-md font-bold'>
                                                                    {`${"Seleccionado"}`}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                        <div className='scale-100 -mt-2 flex justify-center items-center gap-2'>
                                                            <Circle className="h-5 w-5 bg-[#ccc] rounded-full" />
                                                            <div>
                                                                <h1 className='text-md font-bold'>
                                                                    {`${"No Disponible"}`}
                                                                </h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h1 className='text-xl font-bold'>
                                                            {/* {`${"Sprinter 10"}`} */}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <div className='flex justify-center items-center gap-0'>
                                                    <div className='scale-110 bg-white p-1'>
                                                        🚌{`Ocupados: ${getInitialStateFirstAsiento - 2}/50`}
                                                    </div>
                                                    <div>
                                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                                                Activo
                                                            </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-center text-xs text-red-500 font-bold uppercase">
                                                {"Seleccione asientos Disponibles (Blancos) *"}
                                            </div>
                                            <form className="relative" onSubmit={handleSubmit(onValid, onInvalid)}>
                                                <div className='relative w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2 justify-between'>
                                                    {/* asientos svgx */}
                                                    <div>
                                                        <div className='relative w-full h-[1220px] md:h-[1120px] md:w-[450px] border border-slate-300 rounded-md'>
                                                            {/* <Sprinter10 /> */}
                                                            <Bus50 {...{ handleClickInformation }} />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-3 justify-start items-center">
                                                        Asientos Seleccionados:
                                                        {
                                                            fields.length == 0
                                                                ?
                                                                <div className="text-xs text-[#ffc] font-bold ml-10 bg-red-500 rounded-md px-2 py-1">
                                                                    "No ha seleccionado ningun asiento, SELECCIONE LOS ASIENTOS DISPONIBLES(COLOR BLANCO)"
                                                                </div>
                                                                :
                                                                (usuarioActivo?.role !== "admin" && usuarioActivo?.role !== "super admin" && usuarioActivo?.role !== "user asesor")
                                                                    ?
                                                                    <div>
                                                                        <div className="text-left text-xs text-red-500 font-bold uppercase mb-4">
                                                                            Completar Datos:
                                                                        </div>
                                                                        {
                                                                            fields.map((item: any, index: any) => {
                                                                                return (
                                                                                    <div key={index} className="flex flex-col gap-1 justify-start items-start border border-slate-300 rounded-md px-3 py-2 shadow-lg">
                                                                                        <div className="w-full flex gap-4 justify-between items-center pb-4">
                                                                                            <div className="text-xs font-bold">
                                                                                                {`Asiento: ${item.codAsiento?.split("-")[1]}`}
                                                                                            </div>
                                                                                            <div className="text-xs font-bold">
                                                                                                {`Precio: S/.${changeDecimales(item.precio)}`}
                                                                                            </div>
                                                                                            {
                                                                                                (index + 1 == fields.length) &&
                                                                                                <div
                                                                                                    className="cursor-pointer bg-red-500 text-white rounded-full p-1"
                                                                                                    onClick={() => {
                                                                                                        // if (Number(item.codAsiento?.split("-")[1]) !== 2) {
                                                                                                        remove(index)
                                                                                                        setIdAgregante(null)
                                                                                                        setValorRef((prev: any) => Number(prev) - 1)
                                                                                                        setChange1(!change1)
                                                                                                        setArrAsientoSeleccionados((prev: any) => prev.filter((x: any) => x !== item.codAsiento))
                                                                                                        // }
                                                                                                    }}
                                                                                                >
                                                                                                    <div className="flex flex-row gap-1 justify-center items-center">
                                                                                                        <X className="h-3 w-3" />
                                                                                                        <div>Eliminar</div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            }
                                                                                        </div>
                                                                                        <div className="flex flex-col gap-0 mb-3">
                                                                                            <Controller
                                                                                                name={`asientos[${index}].documentoUsuario`}
                                                                                                control={control}
                                                                                                rules={{
                                                                                                    required: "El documento es obligatorio",
                                                                                                    minLength: {
                                                                                                        value: 8,
                                                                                                        message: "Debe tener al menos 8 dígitos",
                                                                                                    },
                                                                                                }}
                                                                                                render={({ field, fieldState }) => (
                                                                                                    <TextField
                                                                                                        {...field}
                                                                                                        label="Documento Usuario"
                                                                                                        variant="outlined"
                                                                                                        size="small"
                                                                                                        type="text"
                                                                                                        fullWidth
                                                                                                        // disabled={item.disabled}
                                                                                                        error={!!fieldState.error}
                                                                                                        helperText={fieldState.error?.message}
                                                                                                        InputLabelProps={{
                                                                                                            shrink: true,
                                                                                                        }}
                                                                                                        required={true}
                                                                                                        onChange={(e) => {
                                                                                                            let value = e.target.value;
                                                                                                            if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                                                                                            if (value.length === 8) {
                                                                                                                console.log("reniec");
                                                                                                                handleApiReniec2(value, "dniCliente", setValue, apiCall, index);
                                                                                                            }

                                                                                                            field.onChange(value);
                                                                                                        }}
                                                                                                    />
                                                                                                )}
                                                                                            />
                                                                                            <div className="text-xs text-blue-500 font-bold uppercase">
                                                                                                {`${getValues()?.asientos?.[index]?.nombres ?? ""} ${getValues()?.asientos?.[index]?.apellidoPaterno ?? ""} ${getValues()?.asientos?.[index]?.apellidoMaterno ?? ""}`}
                                                                                            </div>
                                                                                        </div>
                                                                                        <Controller
                                                                                            name={`asientos.${index}.celular`}
                                                                                            control={control}
                                                                                            rules={{
                                                                                                required: "El celular es obligatorio",
                                                                                                pattern: {
                                                                                                    value: /^[0-9]{9}$/,
                                                                                                    message: "Debe tener 9 dígitos numéricos",
                                                                                                },
                                                                                            }}
                                                                                            render={({ field, fieldState }) => (
                                                                                                <TextField
                                                                                                    {...field}
                                                                                                    required={true}
                                                                                                    label="Celular"
                                                                                                    variant="outlined"
                                                                                                    size="small"
                                                                                                    type="text"
                                                                                                    fullWidth
                                                                                                    // disabled={item.disabled}
                                                                                                    error={!!fieldState.error}
                                                                                                    helperText={fieldState.error?.message}
                                                                                                    InputLabelProps={{
                                                                                                        shrink: true,
                                                                                                    }}
                                                                                                    onChange={(e) => {
                                                                                                        let value = e.target.value;
                                                                                                        field.onChange(value);
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                        />
                                                                                        <Controller
                                                                                            name={`asientos.${index}.email`}
                                                                                            control={control}
                                                                                            rules={{
                                                                                                required: "El correo es obligatorio",
                                                                                                pattern: {
                                                                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                                                    message: "Debe ser un correo válido",
                                                                                                },
                                                                                            }}
                                                                                            render={({ field, fieldState }) => (
                                                                                                <TextField
                                                                                                    {...field}
                                                                                                    label="Correo"
                                                                                                    variant="outlined"
                                                                                                    size="small"
                                                                                                    type="text"
                                                                                                    fullWidth
                                                                                                    // disabled={item.disabled}
                                                                                                    error={!!fieldState.error}
                                                                                                    helperText={fieldState.error?.message}
                                                                                                    InputLabelProps={{
                                                                                                        shrink: true,
                                                                                                    }}
                                                                                                    required={true}
                                                                                                    onChange={(e) => {
                                                                                                        let value = e.target.value;
                                                                                                        field.onChange(value);
                                                                                                    }}
                                                                                                />
                                                                                            )}
                                                                                        />
                                                                                        <div className="w-full">
                                                                                            <Controller
                                                                                                name={`asientos.${index}.paradero`}
                                                                                                control={control}
                                                                                                rules={{
                                                                                                    required: "Debe seleccionar un paradero",
                                                                                                }}
                                                                                                render={({ field, fieldState }) => (
                                                                                                    <Autocomplete
                                                                                                        options={
                                                                                                            info?.destino == 1 ?
                                                                                                                [
                                                                                                                    { value: 1, label: "Orbes" },
                                                                                                                    { value: 2, label: "Tottus Atocongo" },
                                                                                                                    { value: 3, label: "Parque Zonal" },
                                                                                                                    { value: 4, label: "Puente San Luis" },
                                                                                                                    { value: 5, label: "Km. 40" },
                                                                                                                    { value: 6, label: "Pucusana" },
                                                                                                                    { value: 7, label: "Ñaña" },
                                                                                                                    { value: 8, label: "Tottus Puente Piedra" },
                                                                                                                ]
                                                                                                                :
                                                                                                                info?.destino == 0 ?
                                                                                                                    [
                                                                                                                        { value: 1, label: "Orbes" },
                                                                                                                        { value: 2, label: "Tottus Atocongo" },
                                                                                                                        { value: 3, label: "Parque Zonal" },
                                                                                                                        { value: 4, label: "Puente San Luis" },
                                                                                                                        { value: 5, label: "Km. 40" },
                                                                                                                        { value: 6, label: "Pucusana" },
                                                                                                                        { value: 7, label: "Cerro Azul" },
                                                                                                                        { value: 8, label: "Ñaña" },
                                                                                                                        { value: 9, label: "Tottus Puente Piedra" },
                                                                                                                    ]
                                                                                                                    :
                                                                                                                    []
                                                                                                        }
                                                                                                        getOptionLabel={(option) => option.label}
                                                                                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                                                                                        value={(
                                                                                                            info?.destino == 1 ?
                                                                                                                [
                                                                                                                    { value: 1, label: "Orbes" },
                                                                                                                    { value: 2, label: "Tottus Atocongo" },
                                                                                                                    { value: 3, label: "Parque Zonal" },
                                                                                                                    { value: 4, label: "Puente San Luis" },
                                                                                                                    { value: 5, label: "Km. 40" },
                                                                                                                    { value: 6, label: "Pucusana" },
                                                                                                                    { value: 7, label: "Ñaña" },
                                                                                                                    { value: 8, label: "Tottus Puente Piedra" },
                                                                                                                ]
                                                                                                                :
                                                                                                                info?.destino == 0 ?
                                                                                                                    [
                                                                                                                        { value: 1, label: "Orbes" },
                                                                                                                        { value: 2, label: "Tottus Atocongo" },
                                                                                                                        { value: 3, label: "Parque Zonal" },
                                                                                                                        { value: 4, label: "Puente San Luis" },
                                                                                                                        { value: 5, label: "Km. 40" },
                                                                                                                        { value: 6, label: "Pucusana" },
                                                                                                                        { value: 7, label: "Cerro Azul" },
                                                                                                                        { value: 8, label: "Ñaña" },
                                                                                                                        { value: 9, label: "Tottus Puente Piedra" },
                                                                                                                    ]
                                                                                                                    :
                                                                                                                    []
                                                                                                        ).find((opt: any) => opt.value === field.value) || null}
                                                                                                        onChange={(_, selectedOption) => {
                                                                                                            field.onChange(selectedOption?.value ?? null);
                                                                                                        }}
                                                                                                        renderInput={(params) => (
                                                                                                            <TextField
                                                                                                                {...params}
                                                                                                                required={true}
                                                                                                                label={"Paradero"}
                                                                                                                margin="dense"
                                                                                                                fullWidth
                                                                                                                sx={{
                                                                                                                    height: "40px",
                                                                                                                    padding: "0px",
                                                                                                                    margin: "0px",
                                                                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                                                                        // borderColor: "transparent",
                                                                                                                        height: "45px",
                                                                                                                        paddingBottom: "5px",
                                                                                                                        marginBottom: "5px",
                                                                                                                    },
                                                                                                                }}
                                                                                                                error={!!fieldState.error}
                                                                                                                helperText={fieldState.error?.message}
                                                                                                            />
                                                                                                        )}
                                                                                                    />
                                                                                                )}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    :
                                                                    (usuarioActivo?.role == "admin" || usuarioActivo?.role == "super admin" || usuarioActivo?.role == "user asesor")
                                                                    &&
                                                                    fields.map((item: any, index: any) => {
                                                                        return (
                                                                            <div key={index} className="flex flex-col gap-1 justify-start items-start border border-slate-300 rounded-md px-3 py-2 shadow-xl bg-blue-50">
                                                                                <div className="w-full md:w-[300px] grid grid-cols-3 gap-4 justify-center items-center pb-4">
                                                                                    <div className="text-xs font-bold">
                                                                                        {`Asiento: ${item.codAsiento?.split("-")[1]}`}
                                                                                    </div>
                                                                                    <div className="text-xs font-bold">
                                                                                        {`Precio: S/.${changeDecimales(item.precio)}`}
                                                                                    </div>
                                                                                    {
                                                                                        (index + 1 == fields.length) &&
                                                                                        <div
                                                                                            className="cursor-pointer bg-red-500 text-white rounded-full p-1"
                                                                                            onClick={() => {
                                                                                                // if (Number(item.codAsiento?.split("-")[1]) !== 2) {
                                                                                                remove(index)
                                                                                                setIdAgregante(null)
                                                                                                setValorRef((prev: any) => Number(prev) - 1)
                                                                                                setChange1(!change1)
                                                                                                setArrAsientoSeleccionados((prev: any) => prev.filter((x: any) => x !== item.codAsiento))
                                                                                                // }
                                                                                            }}
                                                                                        >
                                                                                            <div className="flex flex-row gap-1 justify-center items-center">
                                                                                                <X className="h-3 w-3" />
                                                                                                <div>Eliminar</div>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                        }
                                                    </div>
                                                </div>
                                                {
                                                    getValues()?.asientos?.length > 0 &&
                                                    <div className="mt-1 w-full fixed bottom-1 left-0 right-0 px-3">
                                                        <Button
                                                            className="w-full"
                                                            variant="contained"
                                                            color={"success"}
                                                            type="submit"
                                                            onClick={() => {
                                                                (usuarioActivo?.role !== "admin" && usuarioActivo?.role !== "super admin" && usuarioActivo?.role !== "user asesor") && window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
                                                            }}
                                                        // onClick={() => {
                                                        //     setOpenPopup(true)
                                                        //     setValue("comprarAsientos", true)
                                                        //     setValue("pasarelaPay", false)
                                                        //     setValue("siPasarelaPay", false)
                                                        //     setValue("dataPoUp", {
                                                        //         title: `Subir Voucher`,
                                                        //         infoOrder: "new",
                                                        //         action: "subirVoucher",
                                                        //     })
                                                        // }}
                                                        >
                                                            <div>
                                                                <div>
                                                                    {`Asiento(s): ${arrAsientoSeleccionados?.map((x: any) => (x?.split("-")[1]))?.join(', ')}`}
                                                                </div>
                                                                <div className="text-base text-white">
                                                                    {`Total: S/. ${changeDecimales(getValues()?.sumaTotalPago)}`}
                                                                </div>
                                                                <div className="text-base text-white font-bold uppercase">
                                                                    {`COMPRAR AQUÍ`}
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    </div>
                                                }
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    </div>
                }
                {
                    openPopup &&
                    <>
                        <PopUp {...{ onSubmit, handleSubmit, control, apiCall, loading, error, getValues, setValue, reset, loadingUpload, handleSearch, setOpen, dataAsientos, setOpenPopup, usuarioActivo }} />
                    </>
                }
                {
                    openPopupFinal &&
                    <>
                        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-50" />
                        <div className="absolute flex flex-col bg-white pb-4 z-50 shadow-xl rounded-lg modal-slide-up justify-start">
                            <div className="border-1 w-full text-center mb-3 cursor-pointer bg-blue-50 flex justify-center items-center rounded-t-lg" onClick={() => {
                                setOpenPopupFinal(false)
                                reset({
                                    ...getValues(),
                                    documentoUsuario: null,
                                    nombres: null,
                                    apellidoPaterno: null,
                                    apellidoMaterno: null,
                                    celular: null,
                                    email: null,
                                    paradero: null,
                                })
                            }}><X color="blue" /></div>
                            <>
                                <form className="relative"
                                //  onSubmit={handleSubmit(onValid, onInvalid)}
                                >
                                    <div className="flex flex-col gap-1 justify-start items-start border border-slate-300 rounded-md px-3 py-2 shadow-lg">
                                        <div className="w-full flex gap-4 justify-between items-center pb-4">
                                            <div className="text-xs font-bold">
                                                {/* {`Asiento: ${item.codAsiento?.split("-")[1]}`} */}
                                                {`Asiento: `}
                                            </div>
                                            <div className="text-xs font-bold">
                                                {/* {`Precio: S/.${changeDecimales(item.precio)}`} */}
                                                {`Precio: S/.`}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-0 mb-3">
                                            <Controller
                                                name={`documentoUsuario`}
                                                control={control}
                                                rules={{
                                                    required: "El documento es obligatorio",
                                                    minLength: {
                                                        value: 8,
                                                        message: "Debe tener al menos 8 dígitos",
                                                    },
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <TextField
                                                        {...field}
                                                        label="Documento Usuario"
                                                        variant="outlined"
                                                        size="small"
                                                        type="text"
                                                        fullWidth
                                                        // disabled={item.disabled}
                                                        error={!!fieldState.error}
                                                        helperText={fieldState.error?.message}
                                                        InputLabelProps={{
                                                            shrink: true,
                                                        }}
                                                        required={true}
                                                        onChange={(e) => {
                                                            let value = e.target.value;
                                                            if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                                            if (value.length === 8) {
                                                                console.log("reniec");
                                                                handleApiReniec(value, "dniCliente", setValue, apiCall, "index");
                                                            }

                                                            field.onChange(value);
                                                        }}
                                                    />
                                                )}
                                            />
                                            <div className="text-xs text-blue-500 font-bold uppercase">
                                                {`${getValues()?.nombres ?? ""} ${getValues()?.apellidoPaterno ?? ""} ${getValues()?.apellidoMaterno ?? ""}`}
                                            </div>
                                        </div>
                                        <Controller
                                            name={`celular`}
                                            control={control}
                                            rules={{
                                                required: "El celular es obligatorio",
                                                pattern: {
                                                    value: /^[0-9]{9}$/,
                                                    message: "Debe tener 9 dígitos numéricos",
                                                },
                                            }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    required={true}
                                                    label="Celular"
                                                    variant="outlined"
                                                    size="small"
                                                    type="text"
                                                    fullWidth
                                                    // disabled={item.disabled}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    onChange={(e) => {
                                                        let value = e.target.value;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                        <Controller
                                            name={`email`}
                                            control={control}
                                            rules={{
                                                required: "El correo es obligatorio",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Debe ser un correo válido",
                                                },
                                            }}
                                            render={({ field, fieldState }) => (
                                                <TextField
                                                    {...field}
                                                    label="Correo"
                                                    variant="outlined"
                                                    size="small"
                                                    type="text"
                                                    fullWidth
                                                    // disabled={item.disabled}
                                                    error={!!fieldState.error}
                                                    helperText={fieldState.error?.message}
                                                    InputLabelProps={{
                                                        shrink: true,
                                                    }}
                                                    required={true}
                                                    onChange={(e) => {
                                                        let value = e.target.value;
                                                        field.onChange(value);
                                                    }}
                                                />
                                            )}
                                        />
                                        <div className="w-full">
                                            <Controller
                                                name={`paradero`}
                                                control={control}
                                                rules={{
                                                    required: "Debe seleccionar un paradero",
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <Autocomplete
                                                        options={
                                                            info?.destino == 1 ?
                                                                [
                                                                    { value: 1, label: "Orbes" },
                                                                    { value: 2, label: "Tottus Atocongo" },
                                                                    { value: 3, label: "Parque Zonal" },
                                                                    { value: 4, label: "Puente San Luis" },
                                                                    { value: 5, label: "Km. 40" },
                                                                    { value: 6, label: "Pucusana" },
                                                                    { value: 7, label: "Ñaña" },
                                                                    { value: 8, label: "Tottus Puente Piedra" },
                                                                ]
                                                                :
                                                                info?.destino == 0 ?
                                                                    [
                                                                        { value: 1, label: "Orbes" },
                                                                        { value: 2, label: "Tottus Atocongo" },
                                                                        { value: 3, label: "Parque Zonal" },
                                                                        { value: 4, label: "Puente San Luis" },
                                                                        { value: 5, label: "Km. 40" },
                                                                        { value: 6, label: "Pucusana" },
                                                                        { value: 7, label: "Cerro Azul" },
                                                                        { value: 8, label: "Ñaña" },
                                                                        { value: 9, label: "Tottus Puente Piedra" },
                                                                    ]
                                                                    :
                                                                    []
                                                        }
                                                        getOptionLabel={(option) => option.label}
                                                        isOptionEqualToValue={(option, value) => option.value === value.value}
                                                        value={(
                                                            info?.destino == 1 ?
                                                                [
                                                                    { value: 1, label: "Orbes" },
                                                                    { value: 2, label: "Tottus Atocongo" },
                                                                    { value: 3, label: "Parque Zonal" },
                                                                    { value: 4, label: "Puente San Luis" },
                                                                    { value: 5, label: "Km. 40" },
                                                                    { value: 6, label: "Pucusana" },
                                                                    { value: 7, label: "Ñaña" },
                                                                    { value: 8, label: "Tottus Puente Piedra" },
                                                                ]
                                                                :
                                                                info?.destino == 0 ?
                                                                    [
                                                                        { value: 1, label: "Orbes" },
                                                                        { value: 2, label: "Tottus Atocongo" },
                                                                        { value: 3, label: "Parque Zonal" },
                                                                        { value: 4, label: "Puente San Luis" },
                                                                        { value: 5, label: "Km. 40" },
                                                                        { value: 6, label: "Pucusana" },
                                                                        { value: 7, label: "Cerro Azul" },
                                                                        { value: 8, label: "Ñaña" },
                                                                        { value: 9, label: "Tottus Puente Piedra" },
                                                                    ]
                                                                    :
                                                                    []
                                                        ).find((opt: any) => opt.value === field.value) || null}
                                                        onChange={(_, selectedOption) => {
                                                            field.onChange(selectedOption?.value ?? null);
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                required={true}
                                                                label={"Paradero"}
                                                                margin="dense"
                                                                fullWidth
                                                                sx={{
                                                                    height: "40px",
                                                                    padding: "0px",
                                                                    margin: "0px",
                                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                                        // borderColor: "transparent",
                                                                        height: "45px",
                                                                        paddingBottom: "5px",
                                                                        marginBottom: "5px",
                                                                    },
                                                                }}
                                                                error={!!fieldState.error}
                                                                helperText={fieldState.error?.message}
                                                            />
                                                        )}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            type="button"
                                            className="w-full"
                                            onClick={() => {
                                                handleEditAsientoFinal()
                                            }}
                                        >
                                            {`Editar`}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        </div>
                    </>
                }
            </div >
        </div >
    )
}