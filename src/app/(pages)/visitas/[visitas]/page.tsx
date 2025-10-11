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
import { ChevronsLeft, Circle, CircuitBoard, Edit2Icon, File, FileText, Octagon, OctagonIcon, SquaresExclude, Upload, X } from "lucide-react"
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
// import { jsPDF } from "jspdf";
// import "jspdf-autotable";

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

type AsientoRaw = any; // adapta según tu tipado real

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
    console.log("formValues: ", formValues)

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
                    obj1?.setAttribute('stroke', match?.patrocinadorId == usuarioActivo?._id ? "#f00" : '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.status == "99") {
                    // console.log("match?.status", match)
                    // obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('fill', "#fff");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.7')
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
                    obj1?.setAttribute('stroke', match?.patrocinadorId == usuarioActivo?._id ? "#f00" : '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.status == "99") {
                    // console.log("match?.status", match)
                    // obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('fill', "#fff");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.7')
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
                        status: "1", // "0": pendiente, "1": aprobado, "2": rechazado, "3": anulado
                        documentoUsuario: null,
                        nombres: null,
                        apellidoPaterno: null,
                        apellidoMaterno: null,
                        celular: null,
                        email: null,
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
            if (asientoSelect !== undefined && (usuarioActivo?.role == "admin" || usuarioActivo?.role == "super admin")) {
                handleEditAsiento(asientoSelect, codAsiento)
            }
            else if (usuarioActivo?._id !== asientoSelect?.patrocinadorId) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "No tiene permiso para realizar esta acción",
                });
            }
            else if (asientoSelect == "99" && (usuarioActivo?._id == asientoSelect?.patrocinadorId && asientoSelect?.status !== "1") || (usuarioActivo?._id == asientoSelect?.patrocinadorId && (usuarioActivo?.role == "admin" || usuarioActivo?.role == "super admin"))) {
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
                status: "1", // "0": pendiente, "1": aprobado, "2": rechazado, "3": anulado
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
        const cleanData = dataAsientosComprados
            ?.filter((X: any) => X?.status === "1")
            .map((item: any) => ({
                Documento: item.documentoUsuario,
                Nombres: item.nombres,
                Paterno: item.apellidoPaterno,
                Materno: item.apellidoMaterno,
                Celular: item.celular || "",
                Asiento: item.codAsiento?.split("-")[1],
                Precio: item.precio,
                "Grupo de Asientos":
                    (item.grupoAsientosComprados?.includes("Fue editado único:"))
                        ? item.grupoAsientosComprados
                        :
                        item.grupoAsientosComprados?.split(",").map((x: any) => x.split("-")[1]).join(", "),
                RegistroPor: item.usuarioRegistro,
                FechaFin: item.fechaFin,
                FechaCreacion: item.createdAt,
                Estado:
                    item.status == "0"
                        ? "Pendiente Pago"
                        : item.status == "1"
                            ? "Vendido"
                            : item.status == "2"
                                ? "Liberado"
                                : "Bloqueado",
                "¿Pasarela?": item.isPasarela ? "Sí" : "No",
                "¿Compra Asesor/Invitado?": item.compraUserAntiguo ? "Asesor" : "Invitado",
                Vouchers: item.fileUrl,
            })) ?? [];

        // Si no hay filas, salimos o generamos un Excel con solo título
        if (cleanData.length === 0) {
            // Crear hoja vacía con título
            const wsEmpty: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[`${info?.titulo} / Fecha de Visita: ${moment.tz(info?.fechaVisita, "America/Lima").format("DD/MM/YYYY")}`]]);
            // opcional: merges no necesarios (solo 1 columna)
            const wbEmpty = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wbEmpty, wsEmpty, "Reporte");
            const bufferEmpty = XLSX.write(wbEmpty, { bookType: "xlsx", type: "array" });
            saveAs(new Blob([bufferEmpty], { type: "application/octet-stream" }), "reporte.xlsx");
            return;
        }

        // 1) Crear worksheet con los datos empezando en A2 para dejar A1 para el título
        //    json_to_sheet escribiría encabezados en la fila 2.
        const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([[]]); // Create an empty worksheet
        XLSX.utils.sheet_add_json(worksheet, cleanData, { origin: "A2" }); // Add JSON data starting at A2

        // 2) Añadir título en A1
        XLSX.utils.sheet_add_aoa(worksheet, [[`${info?.titulo} / Fecha de Visita: ${moment.tz(info?.fechaVisita, "America/Lima").format("DD/MM/YYYY")}`]], { origin: "A1" });

        // 3) Determinar cuántas columnas existen para combinar desde A1 hasta la última columna
        let totalColumnsIndex = 0;
        if (worksheet["!ref"]) {
            const range = XLSX.utils.decode_range(worksheet["!ref"]);
            totalColumnsIndex = range.e.c; // índice 0-based de la última columna
        } else {
            // fallback seguro: número de columnas = keys del primer objeto - 1 (0-based)
            totalColumnsIndex = Object.keys(cleanData[0]).length - 1;
        }

        // 4) Combinar la fila del título (A1 -> últimaColumna1)
        const merge = {
            s: { r: 0, c: 0 }, // start row 0 (A1)
            e: { r: 0, c: totalColumnsIndex }, // end same row, last column
        };
        worksheet["!merges"] = worksheet["!merges"] ? [...worksheet["!merges"], merge] : [merge];

        // 5) (Opcional) Intentar aplicar estilo al título y a la fila encabezado.
        // Nota: la librería xlsx (sheetjs) no aplica estilos al exportar por defecto.
        // Para estilos reales en XLSX necesitarías xlsx-style o una solución server-side.
        try {
            // título en A1
            if (!worksheet["A1"]) worksheet["A1"] = { t: "s", v: `${info?.titulo} / Fecha de Visita: ${moment.tz(info?.fechaVisita, "America/Lima").format("DD/MM/YYYY")}` } as any;
            (worksheet["A1"] as any).s = {
                font: { bold: true, sz: 14 },
                alignment: { horizontal: "center" },
            };

            // encabezados están en la fila 2 -> r = 1 (fila 2), iteramos columnas A..ultima
            const headerRowIndex = 1; // 0-based
            for (let c = 0; c <= totalColumnsIndex; c++) {
                const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c });
                if (worksheet[cellAddress]) {
                    (worksheet[cellAddress] as any).s = {
                        font: { bold: true },
                        alignment: { horizontal: "center" },
                    };
                }
            }
        } catch (e) {
            // ignorar si la librería no soporta estilos en la build actual
            // console.warn("No se pudieron aplicar estilos (si usas xlsx-style se verán).", e);
        }

        // 6) Crear workbook y descargar
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "reporte.xlsx");
    };

    // const formatPrice = (p: any) => {
    //     const n = Number(p) || 0;
    //     return n.toFixed(2);
    // };

    // const handleDownloadPDF = (dataAsientosComprados: AsientoRaw[] | undefined) => {
    //     // 1) preparar datos filtrados
    //     const cleanData = (dataAsientosComprados ?? [])
    //         .filter((x: any) => x?.status === "1")
    //         .map((item: any) => ({
    //             Documento: item.documentoUsuario ?? "",
    //             Nombres: item.nombres ?? "",
    //             Paterno: item.apellidoPaterno ?? "",
    //             Materno: item.apellidoMaterno ?? "",
    //             Celular: item.celular || "",
    //             Asiento: item.codAsiento?.split("-")[1] ?? "",
    //             Precio: formatPrice(item.precio),
    //             "Grupo de Asientos": item.grupoAsientosComprados
    //                 ? item.grupoAsientosComprados.split(",").map((x: string) => x.split("-")[1]).join(", ")
    //                 : "",
    //             RegistroPor: item.usuarioRegistro ?? "",
    //             FechaFin: item.fechaFin ?? "",
    //             FechaCreacion: item.createdAt ?? "",
    //             Estado:
    //                 item.status == "0"
    //                     ? "Pendiente Pago"
    //                     : item.status == "1"
    //                         ? "Vendido"
    //                         : item.status == "2"
    //                             ? "Liberado"
    //                             : "Bloqueado",
    //             "¿Pasarela?": item.isPasarela ? "Sí" : "No",
    //             "¿Compra Asesor/Invitado?": item.compraUserAntiguo ? "Asesor" : "Invitado",
    //             Vouchers: Array.isArray(item.fileUrl) ? item.fileUrl.join(", ") : item.fileUrl || "",
    //         }));

    //     // 2) crear doc
    //     const doc = new jsPDF({
    //         orientation: "landscape", // más ancho para muchas columnas
    //         unit: "pt",
    //         format: "a4",
    //     });

    //     const title = "Visita a proyecto";
    //     const fecha = new Date().toLocaleString(); // si quieres fecha en título, usa `${title} - ${fecha}`
    //     const pageWidth = doc.internal.pageSize.getWidth();

    //     // Título (centrado)
    //     doc.setFontSize(18);
    //     doc.setFont("helvetica", "bold");
    //     doc.text(title, pageWidth / 2, 40, { align: "center" });
    //     doc.setFontSize(10);
    //     doc.setFont("helvetica", "normal");
    //     doc.text(`Generado: ${fecha}`, pageWidth - 40, 40, { align: "right" });

    //     // si no hay datos, generar PDF con solo título
    //     if (cleanData.length === 0) {
    //         doc.setFontSize(12);
    //         doc.text("No hay registros para mostrar.", pageWidth / 2, 120, { align: "center" });
    //         doc.save("reporte.pdf");
    //         return;
    //     }

    //     // 3) preparar headers y rows para autoTable
    //     const headers = Object.keys(cleanData[0]).map((k) => ({ header: k, dataKey: k }));

    //     const body = cleanData.map((row) => {
    //         // asegúrate que las celdas sean string o number
    //         const mapped: Record<string, string | number> = {};
    //         for (const key of Object.keys(row)) {
    //             mapped[key] = (row as Record<string, any>)[key] ?? "";
    //         }
    //         return mapped;
    //     });

    //     // 4) configurar autoTable
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore - autoTable no está en los tipos de jsPDF por defecto en algunas versiones
    //     (doc as any).autoTable({
    //         startY: 70, // debajo del título
    //         head: [headers.map((h) => h.header)],
    //         body: body.map((r) => Object.values(r)),
    //         styles: {
    //             fontSize: 9,
    //             cellPadding: 6,
    //         },
    //         headStyles: {
    //             fillColor: [22, 78, 159], // azulish
    //             textColor: 255,
    //             halign: "center",
    //             valign: "middle",
    //             fontStyle: "bold",
    //         },
    //         alternateRowStyles: {
    //             fillColor: [245, 245, 245],
    //         },
    //         columnStyles: {
    //             // por ejemplo, ajustar ancho para columna Precio o Documento
    //             5: { cellWidth: 40 }, // Asiento (ajusta según posición de columna)
    //             // puedes mapear dinámicamente si conoces índices
    //         },
    //         // margin: { top: 70, left: 20, right: 20, bottom: 40 },
    //         didDrawPage: (dataArg: any) => {
    //             // cabecera adicional / pie de página si quieres
    //             const page = doc.getNumberOfPages();
    //             doc.setFontSize(9);
    //             doc.text(`Página ${page}`, pageWidth - 40, doc.internal.pageSize.getHeight() - 10, {
    //                 align: "right",
    //             });
    //         },
    //         // opciones de paginado y overflow automáticas
    //         showHead: "everyPage",
    //     });

    //     // 5) guardar pdf
    //     doc.save("reporte.pdf");
    // };

    useEffect(() => {
        setValue("sumaTotalPago", getValues()?.asientos?.reduce((acum: any, item: any) => {
            return Number(acum) + Number(item.precio)
        }, 0))
    }, [change1])

    const onValid = (data: any) => {
        window.scrollTo({
            top: document.body.scrollHeight / 2 - window.innerHeight / 2,
            left: 0,
            behavior: 'smooth'
        });
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
        if (asientoSelect?.status == "99") {
            Swal.fire({
                title: `Asiento ${asientoSelect?.codAsiento?.split("-")[1]}`,
                text: "",
                icon: "info",
                confirmButtonText: "Editar",
                confirmButtonColor: "#2563eb", // azul
                allowOutsideClick: true,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log("Se presionó Editar");
                    setOpenPopupFinal(true)
                }
            });
        }
        else {
            Swal.fire({
                title: `Asiento ${asientoSelect?.codAsiento?.split("-")[1]}`,
                text: "Selecciona una acción",
                icon: "warning",
                showDenyButton: true,  // botón secundario
                showCancelButton: true, // usamos este como tercer botón
                confirmButtonText: "Ver Datos",
                denyButtonText: "Editar",
                cancelButtonText: "Liberar",
                confirmButtonColor: "#2563eb", // azul
                denyButtonColor: "#f59e0b", // amarillo
                cancelButtonColor: "#dc2626", // rojo
                allowOutsideClick: true,
                allowEscapeKey: false,
            }).then((result) => {
                if (result.isDenied) {
                    console.log("Se presionó Editar");
                    setOpenPopupFinal(true)
                }
                else if (result.dismiss === Swal.DismissReason.cancel) {
                    console.log("Se presionó Liberar");
                    Swal.fire({
                        title: "Liberar",
                        text: "¿Estás seguro de liberar este asiento?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí",
                        cancelButtonText: "No",
                        confirmButtonColor: "#3085d6", // azul (Tailwind blue-600)
                        cancelButtonColor: "#dc2626", // rojo (Tailwind red-600)
                        allowOutsideClick: false, // no cerrar al hacer click fuera
                        allowEscapeKey: false, // no cerrar con escape
                    }).then((result2) => {
                        if (result2.isConfirmed) {
                            console.log("Se presionó Sí");
                            console.log("Se presionó Sí", asientoSelect);
                            try {
                                const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/pasajes/editAsientoAll`

                                const jsonAsientosAll = {
                                    id: asientoSelect?._id,
                                    status: "99",
                                    documentoUsuario: " ",
                                    nombres: " ",
                                    apellidoPaterno: " ",
                                    apellidoMaterno: " ",
                                    celular: " ",
                                    email: " ",
                                    fileUrl: " ",
                                    grupoAsientosComprados: " ",
                                }
                                console.log("jsonAsientosAll: ", jsonAsientosAll)

                                apiCall({
                                    method: "patch", endpoint: url, data: jsonAsientosAll
                                }).then((response) => {
                                    console.log("responsefuianl: ", response)
                                    if (response.status === 201) {
                                        Swal.fire({
                                            title: 'Éxito',
                                            text: 'Se liberó el asiento con éxito',
                                            icon: 'success',
                                            confirmButtonText: 'OK',
                                            confirmButtonColor: '#3085d6',
                                            showLoaderOnConfirm: true,
                                            allowOutsideClick: false,
                                        });
                                        fetchAsientosIdMatrix2()
                                    } else {
                                        Swal.fire({
                                            title: 'Error!',
                                            text: 'No se ha podido editar el asiento',
                                            icon: 'error',
                                            confirmButtonText: 'OK',
                                            showCancelButton: true,
                                            confirmButtonColor: '#3085d6',
                                            cancelButtonColor: '#d33',
                                            showLoaderOnConfirm: true,
                                            allowOutsideClick: false,
                                        });
                                    }
                                });
                            }
                            catch (error) {
                                console.error('Error al enviar datos:', error);
                            }
                        } else {
                            console.log("Se presionó No");
                        }
                    });
                }
                else if (result.isConfirmed) {
                    console.log("Se presionó ver datos");
                    Swal.fire({
                        title: `Asiento N° ${asientoSelect.codAsiento?.split("-")[1]}`,
                        html: `
                        <div style="text-align: left; font-size: 15px;">
                            <p><b>DNI:</b> ${asientoSelect.documentoUsuario}</p>
                            <p><b>Cliente:</b> ${asientoSelect.nombres} ${asientoSelect.apellidoPaterno} ${asientoSelect.apellidoMaterno}</p>
                            <p><b>Celular:</b> ${asientoSelect.celular}</p>
                            <p><b>Email:</b> ${asientoSelect.email}</p>
                            <p><b>Precio:</b> S/. ${changeDecimales(asientoSelect.precio)}</p>
                            <p><b>Grupo de asientos:</b> ${asientoSelect.grupoAsientosComprados?.split(',').map((x: any) => x.split('-')[1]).join(', ')}</p>
                            <p><b>Voucher subido:</b></p>
                            <div style="text-align: center; margin-top: 15px;">
                              <img 
                                src="${asientoSelect.fileUrl}" 
                                alt="Imagen del asiento" 
                                id="img-asiento"
                                style="max-width: 200px; border-radius: 10px; cursor: pointer; transition: transform 0.2s;"
                              />
                            </div>
                          </div>
                        `,
                        showConfirmButton: true,
                        confirmButtonText: "Cerrar",
                        confirmButtonColor: "#2563eb",
                        width: 400,
                    });
                }
            });
        }
    }

    const handleEditAsientoFinal = async () => {

        if (valorAsientoPatch?.status == "99") {
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
                        fileUrl: res.data.url,
                        grupoAsientosComprados: `Fue editado único: ${valorAsientoPatch?.codAsiento?.split("-")[1]}`,
                    }
                    console.log("jsonAsientosAll: ", jsonAsientosAll)

                    const response = await apiCall({
                        method: "patch", endpoint: url, data: jsonAsientosAll
                    })
                    console.log("responsefuianl: ", response)
                    if (response.status === 201) {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Se editó el asiento con éxito.',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#3085d6',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                        });
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                    } else {
                        Swal.fire({
                            title: 'Error!',
                            text: 'No se ha podido editar el asiento',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                        });
                    }
                } catch (error) {
                    console.error('Error al enviar datos:', error);
                }
            }
        }
        else {
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
                        text: 'Se editó el asiento con éxito..',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false,
                    });
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se ha podido editar el asiento',
                        icon: 'error',
                        confirmButtonText: 'OK',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false,
                    });
                }
            } catch (error) {
                console.error('Error al enviar datos:', error);
            }
        }


    }

    return (
        <div className="bg-blue-500 h-[100vh]">
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
                                        {
                                            (usuarioActivo?.role == "admin" || usuarioActivo?.role == "super admin") &&
                                            <div className='flex w-full flex-col md:flex-row gap-1 justify-center items-center bg-white rounded-lg px-3 py-2'>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-green-100 bg-green-50'>
                                                    <div>
                                                        Total Pasajeros:
                                                    </div>
                                                    <div className='font-bold text-green-400'>
                                                        {`${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length}`}
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    <div>
                                                        {"Bus 10:"}
                                                    </div>
                                                    <div className='font-bold text-blue-400'>
                                                        {`${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length <= 10 ? "1" : "0"}`}
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    <div>
                                                        {"Buses 17:"}
                                                    </div>
                                                    <div className='font-bold text-blue-400'>
                                                        {`${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length >= 11 && dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length <= 17 ? "1" : "0"}`}
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    <div>
                                                        {"Buses 20:"}
                                                    </div>
                                                    <div className='font-bold text-blue-400'>
                                                        {`${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length >= 18 && dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length <= 20 ? "1" : "0"}`}
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    <div>
                                                        {"Buses 30:"}
                                                    </div>
                                                    <div className='font-bold text-blue-400'>
                                                        {`${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length >= 21 && dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length <= 30 ? "1" : "0"}`}
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    <div>
                                                        {"Buses 50:"}
                                                    </div>
                                                    <div className='font-bold text-blue-400'>
                                                        {`${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length >= 31 && dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length <= 50 ? "1" : "0"}`}
                                                    </div>
                                                </div>
                                                <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    {/* <div>
                                                        {"Buses 50:"}
                                                    </div> */}
                                                    <div onClick={handleDownload} className='font-bold text-green-400 flex justify-start items-center gap-2'>
                                                        <File className="h-5 w-5 text-green-400" />
                                                        <div>
                                                            Excel Pasajeros
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <div className='flex flex-row gap-2 w-full px-2 py-1 border rounded-lg border-blue-100 bg-blue-50'>
                                                    <div onClick={() => handleDownloadPDF(dataAsientosComprados)} className='font-bold text-green-400 flex justify-start items-center gap-2'>
                                                        <File className="h-5 w-5 text-green-400" />
                                                        <div>
                                                            PDF Pasajeros
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        }
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
                                                        {/* <div className='scale-100 -mt-2 flex justify-center items-center gap-2'>
                                                            <Circle className="h-5 w-5 bg-[#f9bc38] rounded-full" />
                                                            <div>
                                                                <h1 className='text-md font-bold'>
                                                                    {`${"Reservado"}`}
                                                                </h1>
                                                            </div>
                                                        </div> */}
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
                                                        🚌{`Ocupados: ${dataAsientosComprados?.filter((x: any) => x?.status == "1")?.length}/50`}
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
                                                                                            // rules={{
                                                                                            //     required: "El correo es obligatorio",
                                                                                            //     pattern: {
                                                                                            //         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                                            //         message: "Debe ser un correo válido",
                                                                                            //     },
                                                                                            // }}
                                                                                            render={({ field, fieldState }) => (
                                                                                                <TextField
                                                                                                    {...field}
                                                                                                    label="Correo"
                                                                                                    variant="outlined"
                                                                                                    size="small"
                                                                                                    type="text"
                                                                                                    fullWidth
                                                                                                    // disabled={item.disabled}
                                                                                                    // error={!!fieldState.error}
                                                                                                    // helperText={fieldState.error?.message}
                                                                                                    InputLabelProps={{
                                                                                                        shrink: true,
                                                                                                    }}
                                                                                                    required={false}
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
                                                                                            // rules={{
                                                                                            //     required: "El correo es obligatorio",
                                                                                            //     pattern: {
                                                                                            //         value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                                            //         message: "Debe ser un correo válido",
                                                                                            //     },
                                                                                            // }}
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
                                                                                                    required={false}
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
                                                                window.scrollTo({ top: document.body.scrollHeight, left: 0, behavior: 'smooth' });
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
                                                                    {`Asiento(s) Seleccionado(s): ${arrAsientoSeleccionados?.map((x: any) => (x?.split("-")[1]))?.join(', ')}`}
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
                                                        required={valorAsientoPatch?.status == "99" && true}
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
                                                    required={valorAsientoPatch?.status == "99" && true}
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
                                                    required={valorAsientoPatch?.status == "99" && true}
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
                                                                required={valorAsientoPatch?.status == "99" && true}
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
                                        {
                                            valorAsientoPatch?.status == "99" &&
                                            <div>
                                                <Controller
                                                    name={"fileUrl"}
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => {
                                                            return `Voucher es obligatorio`
                                                        }
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <div className="flex flex-col gap-1 justify-start items-start">
                                                            <div>
                                                                <Button
                                                                    variant="contained"
                                                                    component="label"
                                                                    style={{ textTransform: "none" }}
                                                                >
                                                                    {"Seleccionar Voucher (Obligatorio)"}
                                                                    <input
                                                                        type="file"
                                                                        accept="image/*,application/pdf"
                                                                        hidden
                                                                        onChange={(e: any) => {
                                                                            const file = e.target.files[0];
                                                                            if (file) {
                                                                                const fileUrl = URL.createObjectURL(file); // Crear URL para previsualización
                                                                                field.onChange({ file, fileUrl }); // Guardar archivo y URL en el campo
                                                                            }
                                                                            setValue("fileEvent", e.target.files[0]);
                                                                        }}
                                                                    />
                                                                </Button>
                                                            </div>

                                                            {getValues("fileUrl") !== "" && getValues("fileUrl") !== undefined && getValues("fileUrl") !== null && (
                                                                <>
                                                                    <>
                                                                        <div
                                                                            className="relative z-50 cursor-pointer"
                                                                            onClick={() => {
                                                                                // setPreviewUrl(null)
                                                                                setValue("fileUrl", null);
                                                                            }}
                                                                        >
                                                                            <X color="red" size={20} />
                                                                        </div>
                                                                    </>
                                                                    <div
                                                                        className="cursor-pointer"
                                                                        onClick={() => window.open(getValues("fileUrl")?.fileUrl ?? getValues("fileUrl"), "_blank")}
                                                                    >
                                                                        <img
                                                                            src={getValues("fileUrl")?.fileUrl}
                                                                            alt="Vista previa"
                                                                            style={{ width: 100, height: "auto", marginTop: 8, borderRadius: 4 }}
                                                                        />
                                                                    </div>
                                                                </>
                                                            )}

                                                            {/* Mensaje de error si no hay archivo */}
                                                            {fieldState.error && (
                                                                <span style={{ color: "red", fontSize: "0.8rem" }}>{fieldState.error.message}</span>
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        }
                                    </div>
                                    <div>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            type="button"
                                            className="w-full"
                                            onClick={() => {
                                                if (
                                                    (getValues()?.documentoUsuario == "" || getValues()?.documentoUsuario == null || getValues()?.documentoUsuario == undefined)
                                                    &&
                                                    (getValues()?.nombres == "" || getValues()?.nombres == null || getValues()?.nombres == undefined)
                                                    &&
                                                    (getValues()?.apellidoPaterno == "" || getValues()?.apellidoPaterno == null || getValues()?.apellidoPaterno == undefined)
                                                    &&
                                                    (getValues()?.apellidoMaterno == "" || getValues()?.apellidoMaterno == null || getValues()?.apellidoMaterno == undefined)
                                                    &&
                                                    (getValues()?.celular == "" || getValues()?.celular == null || getValues()?.celular == undefined)
                                                    &&
                                                    (getValues()?.paradero == "" || getValues()?.paradero == null || getValues()?.paradero == undefined)
                                                    &&
                                                    (getValues()?.fileUrl == "" || getValues()?.fileUrl == null || getValues()?.fileUrl == undefined)
                                                ) {
                                                    Swal.fire({
                                                        title: "Error!",
                                                        text: "Debes completar los campos",
                                                        icon: "error",
                                                        confirmButtonText: "OK",
                                                    });
                                                }
                                                else {
                                                    handleEditAsientoFinal()
                                                }
                                            }}
                                        >
                                            {`Guardar`}
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