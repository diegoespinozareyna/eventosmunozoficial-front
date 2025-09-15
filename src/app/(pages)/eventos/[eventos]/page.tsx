"use client"

import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import useApi from "@/app/hooks/fetchData/useApi"
import { Button, IconButton } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import "./styleButton.css"
import { Evento200Sale } from "@/app/components/Escenarios/Evento200/Evento200Sale"
import { Evento250Sale } from "@/app/components/Escenarios/Evento250/Evento250Sale"
import { Evento300Sale } from "@/app/components/Escenarios/Evento300/Evento300Sale"
import Swal from "sweetalert2"
import { StatusLotes } from "@/app/configs/proyecto/statusLotes"
import { ChevronsLeft, Edit2Icon, FileText, SquaresExclude, Upload, X } from "lucide-react"
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

    useEffect(() => {
        console.log("info: ", info)
    }, [info])

    const params: any = useParams()
    console.log("params: ", params?.eventos)
    const router = useRouter()
    if (params?.eventos === "CONVENCION-BIENES-RAICES") {
        router.push(`/eventos/CONVENCIÓN%20EN%20BIENES%20RAÍCES-68857e9349183618fc16a323`)
    }
    if (params?.eventos === "MENTALIDAD-RIQUEZA-CON-STEFANNY-BERDEJO") {
        router.push(`/eventos/Mentalidad%20de%20Riqueza%20con%20Stefanny%20Berdejo-68c0ab127a2ea9f46af9ae24`)
    }
    if (params?.eventos === "GRAN-CONVENCION-BIENES-RAICES-CON-SANDRO-MELENDEZ") {
        router.push(`/eventos/GRAN%20CONVENCION%20BIENES%20RAICES%20CON%20SANDRO%20MELENDEZ-68b7631fc9be927a69141fc3`)
    }
    if (params?.eventos === "MENTALIDAD.DE.RIQUEZA.CON.STEFANNY.BERDEJO") {
        router.push(`/eventos/MENTALIDAD.DE.RIQUEZA.CON.STEFANNY.BERDEJO-68c0ab127a2ea9f46af9ae24`)
    }
    if (params?.eventos === "CONVENCION.PARA.AGENTES.INMOBILIARIOS") {
        router.push(`/eventos/CONVENCION.PARA.AGENTES.INMOBILIARIOS-68c4a54d7a2ea9f46af9b0c5`)
    }
    if (params?.eventos === "JAVIER_CUBAS") {
        router.push(`/eventos/CONVENCION.CON.JAVIER.CUBAS-68c4a54d7a2ea9f46af9b0c5`)
    }

    const { getValues, setValue, handleSubmit, control, watch, reset } = useForm()

    const formValues = watch();
    console.log("formValues: ", formValues)

    const { apiCall, loading, error } = useApi()
    const { openPopup, setOpenPopup } = usePopUp()
    const [isLoading, setIsLoading] = useState(true);
    const [loadingUpload, setLoadigUpload] = useState(false)

    const [openAsientos, setOpenAsientos] = useState(false)

    const [open, setOpen] = useState(false)
    // const [openPopup, setOpenPopup] = useState(false)
    const [dataAsientos, setDataAsientos] = useState<any>(null)
    const [dataAsientosComprados, setDataAsientosComprados] = useState<any>(null)
    // const [vouchersAsiento, setVouchersAsiento] = useState<any>(null)

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
            const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/getAsientosIdMatrix`
            const response = await apiCall({
                method: "get", endpoint: url, data: null, params: {
                    proyecto: Apis.PROYECTCURRENT,
                    idMatrix: params?.eventos?.split("-")[1],
                }
            });
            console.log("responseEventId: ", response?.data);
            setDataAsientosComprados(response?.data?.filter((x: any) => x?.status !== "3"));
            console.log(info?.dateEvent)

            // if (response?.data?.length > 0) {
            const paths = document.querySelectorAll(`#${Apis.PROYECTCURRENT} path`);
            paths.forEach(obj1 => {
                const match = response?.data?.find((obj2: any) => obj2?.codAsiento === obj1?.id && obj2?.status !== "3");
                // console.log("match: ", match)
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
                // console.log("diferencia: ", diferencia);

                if (match?.status == "4") {
                    // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                    obj1?.setAttribute('fill', "#61baed");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.status == "5") {
                    // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                    obj1?.setAttribute('fill', "#afa");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.isTicketsPendings > 0 && match?.status !== "1") {
                    obj1?.setAttribute('fill', "#ff0");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.isPasarela == true && match?.status !== "1") {
                    obj1?.setAttribute('fill', "#ff0");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (
                    (
                        diferencia <= 3 * milisegundosEnUnDia
                        || diferencia2 <= 6 * milisegundosEnUnDia
                    ) && diferencia > 0 && match?.status == "0") {
                    obj1?.setAttribute('fill', "#f55");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.compraUserAntiguo == true && match?.status == "1") {
                    obj1?.setAttribute('fill', "#61baed");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else if (match?.compraUserAntiguo == false && match?.status == "1") {
                    obj1?.setAttribute('fill', "#afa");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                // else if (match?.status == "1") {
                //     obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                else if (match?.status == "0") {
                    // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                    // obj1?.setAttribute('fill', "#efc600"); // color dorado
                    obj1?.setAttribute('fill', "#e9afdd"); // color rosado
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    obj1?.setAttribute('fill', "#efc600"); // color dorado asiento premium
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                        || obj1?.id?.includes("K")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                        || obj1?.id?.includes("K")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                    // obj1?.setAttribute('fill', "#6F0A6F");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                        || obj1?.id?.includes("K")
                        || obj1?.id?.includes("L")
                    )
                ) {
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                    // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                    obj1?.setAttribute('fill', "#efc600");
                    // obj1?.setAttribute('fill', "#8B5CF6");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                    obj1?.setAttribute('precio', info?.precioEntradaPremium)
                }
                // else if (obj1?.id?.includes("A") || obj1?.id?.includes("B")) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     obj1?.setAttribute('fill', "#efc600"); // color dorado
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (obj1?.id?.includes("C") || obj1?.id?.includes("D")) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                else {
                    obj1?.setAttribute('fill', "#efefef");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
            })
            const texts = document.querySelectorAll(`#${Apis.PROYECTCURRENT} text`);
            texts.forEach(obj1 => {
                const match = response?.data?.find((obj2: any) => obj2?.codAsiento === obj1?.id && obj2?.status !== "3");
                // console.log("match: ", match)
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
                // console.log("diferencia: ", diferencia);
                if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                    obj1?.setAttribute('fill', "#FFF");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                    obj1?.setAttribute('fill', "#FFF");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 10
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 10
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 20
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 20
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                    console.log("entro aqui 30-30");
                    obj1?.setAttribute('fill', "#FFF");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                    obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 30
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 30
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 40
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 40
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 50
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                        || obj1?.id?.includes("K")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 50
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("F")
                        || obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                        || obj1?.id?.includes("K")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                //
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("A")
                        || obj1?.id?.includes("B")
                        || obj1?.id?.includes("C")
                        || obj1?.id?.includes("D")
                        || obj1?.id?.includes("E")
                        || obj1?.id?.includes("F")
                    )
                ) {
                     obj1?.setAttribute('fill', "#fff");
                }
                else if (
                    (
                        info?.cantidadPlatinium == 60
                        && info?.cantidadPremium == 60
                    )
                    &&
                    (
                        obj1?.id?.includes("G")
                        || obj1?.id?.includes("H")
                        || obj1?.id?.includes("I")
                        || obj1?.id?.includes("J")
                        || obj1?.id?.includes("K")
                        || obj1?.id?.includes("L")
                    )
                ) {
                     obj1?.setAttribute('fill', "#000");
                }
                // else if (obj1?.id?.includes("A") || obj1?.id?.includes("B")) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     obj1?.setAttribute('fill', "#efc600"); // color dorado
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (obj1?.id?.includes("C") || obj1?.id?.includes("D")) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                else {
                    obj1?.setAttribute('fill', "#000");
                    // obj1?.setAttribute('stroke', '#333');
                    // obj1?.setAttribute('stroke-width', '0.3')
                }
            })
            // }
            return (response?.data?.filter((x: any) => x?.status !== "3"))
        } catch (error) {
            console.error('Error al obtener datos del usuario:', error);
        }
    }

    useEffect(() => {
        fetchAsientosIdMatrix()
        // usersPatrocinaddores()
    }, [info, openAsientos])

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

    const handleClickInformation = async (codAsiento: any, valueBoolean: boolean, precioAll: any) => {
        console.log('Click en la información', codAsiento);
        console.log('Click en la valueBoolean', valueBoolean);
        console.log('Click en la precioAll', precioAll);
        console.log('Click info', info);
        setDataAsientos(
            {
                id: codAsiento,
                precio: precioAll ?? info?.precioEntradaGeneral
            }
        )
        const ticketsAsientosno3 = await fetchAsientosIdMatrix()
        console.log("ticketsAsientosno3: ", ticketsAsientosno3)
        console.log("ticketsAsientosno3: ", ticketsAsientosno3?.find((x: any) => x?.codAsiento == codAsiento))
        handleVouchersAsiento(codAsiento, params?.eventos?.split("-")[1], ticketsAsientosno3?.find((x: any) => x?.codAsiento == codAsiento)?._id)
        // setValue("fileUrl", dataAsientosComprados?.find((x: any) => x?.codAsiento == id)?.fileUrl)
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
        console.log(data)
        try {
            const user = localStorage.getItem('auth-token');
            const decoded: any = jwtDecode(user as string);
            console.log('Datos del usuario:', decoded?.user);
            setValue("userVenta", decoded?.user);
        } catch (error) {
            setValue("userVenta", null);
        }

        const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/compraAsiento`
        const url2 = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/editarAsiento`
        const jsonSend = {
            ...data,
            status: "0",
            codAsiento: dataAsientos?.id,
            precio: dataAsientos?.precio,
            codMatrixTicket: params?.eventos?.split("-")[1],
            proyecto: Apis.PROYECTCURRENT,
            usuarioRegistro: `${getValues()?.userVenta?.documentoUsuario ?? "Invitado"} - ${getValues()?.userVenta?.nombres ?? "Invitado"} ${getValues()?.userVenta?.apellidoPaterno ?? "Invitado"} ${getValues()?.userVenta?.apellidoMaterno ?? "Invitado"}`,
            compraUserAntiguo: getValues(`UsuarioAntiguo`),
            fechaFin: moment.tz(new Date(), "America/Lima").add(7, "days").format("YYYY-MM-DDTHH:mm"),
        }
        console.log("jsonSend: ", jsonSend)

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
                    const response = await apiCall({
                        method: "post", endpoint: url, data: { ...jsonSend, fileUrl: res.data.url }
                    })
                    console.log("responsefuianl: ", response)
                    if (response.status === 201) {
                        Swal.fire({
                            title: 'Éxito',
                            text: 'Se reservó asiento con éxito',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            // showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            // cancelButtonColor: '#d33',
                            // cancelButtonText: 'No',
                            showLoaderOnConfirm: true,
                            allowOutsideClick: false,
                            timer: 3000,
                            // preConfirm: () => {
                            //     router.push(`/dashboard/verUsuarios`);
                            //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
                            //     return
                            // },
                        });
                        reset({
                            usersPatrocinadores: getValues()?.usersPatrocinadores,
                        });
                        setOpen(false)
                        setOpenPopup(false)

                        const urlVoucher = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/eventos/newVoucherEventos`
                        const jsonPagoAsiento = {
                            //id reconocimiento
                            codEvento: params?.eventos?.split("-")[1],
                            idTicketAsiento: response?.data?._id,
                            nOperacion: new Date().getTime(),
                            codAsiento: dataAsientos?.id,
                            //datos pago
                            fechaPago: moment.tz(new Date(), "America/Lima").format("YYYY-MM-DDTHH:mm"),
                            documentoUsuario: data?.documentoUsuario,
                            proyecto: Apis.PROYECTCURRENT,
                            url: res.data.url,
                            // status
                            status: "0", // "0" pendiente, "1" aprobado, "2" rechazado
                        }
                        const responseVoucher = await apiCall({
                            method: "post", endpoint: urlVoucher, data: jsonPagoAsiento
                        })
                        console.log("responseVoucher: ", responseVoucher)
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
                setLoadigUpload(false)
                fetchAsientosIdMatrix()
            }
        }
        else if (getValues()?.cambiarStatusAsiento !== true) {
            try {
                const response = await apiCall({
                    method: "post", endpoint: url, data: { ...jsonSend, montoPasarela: getValues()?.montoPasarela }
                })
                console.log("responsefuianl: ", response)
                if (response.status === 201) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Se reservó asiento con éxito',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        // showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        // cancelButtonColor: '#d33',
                        // cancelButtonText: 'No',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false,
                        timer: 3000,
                        // preConfirm: () => {
                        //     router.push(`/dashboard/verUsuarios`);
                        //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
                        //     return
                        // },
                    });
                    reset({
                        usersPatrocinadores: getValues()?.usersPatrocinadores,
                    })
                    setOpen(false)
                    setOpenPopup(false)
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
            catch (error) {
                console.error('Error al enviar datos:', error);
            }
            finally {
                fetchAsientosIdMatrix()
            }
        }
        else if (getValues()?.cambiarStatusAsiento == true) { // cambiar datos de usuario (editar)
            try {
                const response = await apiCall({
                    method: "patch", endpoint: url2, data: {
                        id: getValues()?.idEditarAsiento,
                        nombres: data?.nombres,
                        apellidoPaterno: data?.apellidoPaterno,
                        apellidoMaterno: data?.apellidoMaterno,
                        celular: data?.celular,
                        documentoUsuario: data?.documentoUsuario,
                        patrocinadorId: data?.patrocinadorId,
                        compraUserAntiguo: getValues()?.UsuarioAntiguo,
                    }
                })
                console.log("responsefuianl: ", response)
                if (response.status === 201) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Se edito asiento con éxito',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        // showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        // cancelButtonColor: '#d33',
                        // cancelButtonText: 'No',
                        showLoaderOnConfirm: true,
                        allowOutsideClick: false,
                        timer: 3000,
                        // preConfirm: () => {
                        //     router.push(`/dashboard/verUsuarios`);
                        //     // window.location.href = `/dashboard/${Apis.PROYECTCURRENT}`;
                        //     return
                        // },
                    });
                    reset({
                        usersPatrocinadores: getValues()?.usersPatrocinadores,
                    })
                    setOpen(false)
                    setOpenPopup(false)
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'No se ha podido edito asiento',
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
            catch (error) {
                console.error('Error al enviar datos:', error);
            }
            finally {
                fetchAsientosIdMatrix()
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

                // if (!comentario) {
                //     Swal.showValidationMessage('Debes escribir un comentario');
                //     return;
                // }

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

                    // if (response.status === 201) {
                    //     if (estado == "2") {
                    //         console.log("entreliuberar horarios")
                    //         // console.log("entreliuberar canchas", canchas)
                    //         // console.log("entreliuberar fecha", fecha)

                    //         // const liberarHorarios = { ...canchas, fecha: fecha }

                    //         // console.log("liberarHorarios", liberarHorarios)

                    //         // const urlPagoUrl = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/liberarHorarios`;

                    //         // const jsonSend = {
                    //         //     horarios: liberarHorarios,
                    //         //     proyecto: Apis.PROYECTCURRENT,
                    //         // }

                    //         // const response2 = await apiCall({
                    //         //     method: 'patch',
                    //         //     endpoint: urlPagoUrl,
                    //         //     data: jsonSend
                    //         // })
                    //         // console.log("responsefuianl: ", response2)

                    //     }
                    //     return { estado, comentario }; // Devuelve valores para usarlos fuera
                    // } else {
                    //     Swal.showValidationMessage('Error al actualizar el estado');
                    // }
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

    return (
        <div className="bg-blue-500 h-[100vh]">
            {isLoading && <TicketLoaderMotion />}
            <div className="!max-w-full relative z-20 w-full flex items-center justify-center">
                {
                    !openAsientos && info &&
                    <div className="relative flex flex-col min-h-screen w-full pt-0.5">
                        {/* Imagen ocupando el 90% */}
                        <Image
                            src={info?.urlFlyer}
                            alt="Flyer"
                            fill
                            className="object-contain object-top"
                            onLoad={handleImageLoad}
                            priority
                        />

                        {/* Botón ocupando el 10% */}
                        <div className="absolute w-full bg-transparent flex justify-center items-center bottom-[15%]">
                            <button
                                className="bg-green-500 w-full text-white px-18 py-4 font-bold text-xl rounded-lg z-50 button-attention cursor-pointer"
                                onClick={() => setOpenAsientos(true)}
                            >
                                COMPRAR ENTRADAS
                            </button>
                        </div>
                    </div>
                }
                {
                    openAsientos &&
                    <div className="flex flex-col -mt-3">
                        <div>
                            <button className="bg-transparent text-white px-2 py-2 relative z-20 font-bold text-xl cursor-pointer rounded-lg ml-5 mt-1 flex justify-center items-center"
                                onClick={() => {
                                    setIsLoading(true);
                                    setOpenAsientos(false)
                                }}
                            >
                                <ChevronsLeft
                                    color={"#fff"}
                                />
                            </button>
                        </div>
                        <div className="w-full text-center mb-0 font-bold text-base uppercase text-white -mt-1">
                            {info?.title}
                        </div>
                        <div className="pl-6 text-base font-bold uppercase flex justify-between items-center mb-3 -mt-3">
                            {/* <div>
                                Entradas:
                            </div> */}
                            {
                                (getValues()?.user?.role == "admin" || getValues()?.user?.role == "super admin") &&
                                <div className="pr-5">
                                    <button
                                        className="bg-green-600 text-white px-2 py-2 rounded-lg font-bold text-xl cursor-pointer flex justify-center items-center"
                                        onClick={handleDownload}>
                                        <PiMicrosoftExcelLogoLight className="h-5 w-5" />
                                    </button>
                                </div>
                            }
                        </div>

                        <div className="flex flex-col items-center justify-center w-full -mt">
                            {
                                (
                                    info?.capacity === "200" &&
                                    <div className="h-[80vh] md:h-[270vh] text-center text-4xl mx-3 px-1 md:mx-8 border- rounded-lg shadow-2xl bg-blue-600">
                                        {/* <div className="text-center text-4xl px-8 border-2 rounded-lg shadow-2xl bg-gradient-to-t from-blue-400 to-blue-600"> */}
                                        <Evento200Sale {...{ handleClickInformation, setOpen, getValues, dataAsientosComprados }} />
                                    </div>
                                )
                            }
                            {
                                (
                                    info?.capacity === "250" &&
                                    <div className="text-center text-4xl px-8 border-2 rounded-lg shadow-2xl bg-gradient-to-r from-blue-200 to-blue-600">
                                        <Evento250Sale {...{ handleClickInformation, setOpen }} />
                                    </div>
                                )
                            }
                            {
                                (
                                    info?.capacity === "300" &&
                                    <div className="text-center text-4xl px-8 border-2 rounded-lg shadow-2xl bg-gradient-to-r from-blue-200 to-blue-600">
                                        <Evento300Sale {...{ handleClickInformation, setOpen }} />
                                    </div>
                                )
                            }
                        </div>
                    </div>
                }
                {
                    open &&
                    <>
                        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] z-20" />
                        <div onClick={() => {
                            setOpen(false)
                            reset()
                        }} className="min-h-[100vh] min-w-[100vw] bg-transparent absolute z-30 top-0 left-0"></div>
                        <div className="fixed bottom-0 left-0 w-full bg-white pb-0 z-50 shadow-xl modal-slide-up rounded-t-lg flex flex-col items-center justify-start">
                            <div className="flex flex-col items-center justify-start w-full sm:w-1/2 rounded-t-lg px-2 sm:px-4 mt-1">
                                <div className="border-0 w-full text-center mb-1 cursor-pointer flex justify-center items-center rounded-t-lg sm:rounded-t-none" onClick={() => {
                                    setOpen(false)
                                    reset()
                                }}><X className="rounded-full bg-blue-50 p-1" color="blue" /></div>
                                <div className="flex flex-col justify-center items-center gap-0 bg-slate-200 rounded-t-lg w-full">
                                    <div className="flex justify-center items-center gap-2 p-2 rounded-lg w-full">
                                        {
                                            !dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                            <div className="font-bold uppercase text-slate-700">
                                                {`${(dataAsientos?.precio == info?.precioEntradaPlatinium) ? "VIP (V)" : (dataAsientos?.precio == info?.precioEntradaPremium) ? "Premium (P)" : "GENERAL (G)"}`}
                                            </div>
                                        }
                                        {
                                            dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                            <div className="font-bold uppercase text-slate-700">
                                                {`${(dataAsientos?.precio == info?.precioEntradaPlatinium) ? "(VIP (V) -" : (dataAsientos?.precio == info?.precioEntradaPremium) ? "(Premium (P) -" : "(GENERAL (G) -"} S/. ${changeDecimales(dataAsientos?.precio)})`}
                                            </div>
                                        }
                                        <div className="rounded-sm bg-slate-50 px-2 py-0 text-center">{`${dataAsientos?.id}`}</div>
                                    </div>
                                    <div className="text-center gap-0 rounded-lg w-[133px]">
                                        {
                                            !dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                            <div className="text-xl font-bold text-yellow-500 bg-slate-50 px-2 py-1 rounded-sm">
                                                {/* <div className="font-bold">Precio</div> */}
                                                <div>{`S/. ${changeDecimales(dataAsientos?.precio)}`}</div>
                                                {/* <div className="font-bold">Invitados</div>
                                            <div>{`: S/. ${changeDecimales("0")}`}</div> */}
                                            </div>
                                        }
                                    </div>
                                    {
                                        !dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                        <div className="flex flex-col justify-center items-center gap-1 mb-1">
                                            <div className="flex justify-center items-center gap-2 mt-2 px-3">
                                                <button className="bg-violet-500 text-[12px] text-white w-full py-2 px-2 rounded-sm  font-bold text-xl cursor-pointer" onClick={() => {
                                                    setOpenPopup(true)
                                                    setValue("siPasarelaPay", true)
                                                    setValue("montoPasarela", dataAsientos?.precio)
                                                }}>
                                                    RESERVAR CON YAPE
                                                </button>
                                            </div>
                                            {/* {
                                                (getValues()?.user?.role == "admin" || getValues()?.user?.role == "super admin" || getValues()?.user?.role == "user asesor") && */}
                                            <div className="flex justify-center items-center gap-2 px-3 mb-1">
                                                <button className="bg-green-500 text-[12px] text-white w-full py-2 px-2 rounded-sm  font-bold text-xl cursor-pointer" onClick={() => {
                                                    setOpenPopup(true)
                                                    setValue("noPasarelaPay", true)
                                                }}>
                                                    RESERVAR CON VOUCHER
                                                </button>
                                            </div>
                                            {/* } */}
                                        </div>
                                    }
                                    <div className="flex flex-col gap-3 justify-center items-center mt-0">
                                        {
                                            (dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)) &&
                                            <>
                                                {/* <div className="font-bold">Usuario</div> */}
                                                {
                                                    (getValues()?.user?.role == "admin" || getValues()?.user?.role == "super admin") &&

                                                    (dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                                        <div className="flex flex-row gap-1 justify-start items-start mt-0 px-2">
                                                            <div className="text-center">
                                                                {`${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.nombres} ${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.apellidoPaterno} ${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.apellidoMaterno} ${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.documentoUsuario} / ${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.celular}`}
                                                            </div>
                                                            <button className="bg-green-500 text-[12px] text-white py-2 px-2 rounded-sm font-bold cursor-pointer" onClick={() => {
                                                                setOpenPopup(true)
                                                                // setValue("siPasarelaPay", true)
                                                                // setValue("montoPasarela", dataAsientos?.precio)
                                                                setValue("cambiarStatusAsiento", true)
                                                                setValue("idEditarAsiento", dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?._id)
                                                                console.log("cambiarStatusAsiento: ")
                                                            }}>
                                                                <Edit2Icon
                                                                    color="#fff"
                                                                    size={15}
                                                                />
                                                            </button>
                                                        </div>)

                                                }
                                                <div className="flex flex-col gap-3 justify-center items-center mt-0 rounded-md bg-slate-50 px-2 py-1 my-2 mx-3">
                                                    <div className="font-bold  flex flex-row gap-2 justify-center items-center">
                                                        <div className="uppercase">Status</div>
                                                        <button
                                                            disabled={(getValues()?.user?.role !== "admin" && getValues()?.user?.role !== "super admin") && true}
                                                            className={`bg-blue-500 text-white text-[10px] py-1 px-2 rounded-lg cursor-pointer ${(getValues()?.user?.role !== "admin" && getValues()?.user?.role !== "super admin") && "opacity-50 bg-slate-400"}`}
                                                            onClick={() => handleChangeState(dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?._id, dataAsientos?.id, "statusAsiento")}
                                                        >
                                                            Cambiar
                                                        </button>
                                                    </div>
                                                    <div
                                                        className={`${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "0" ? "text-yellow-500" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "1" ? "text-green-500" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "2" ? "text-red-500" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "4" ? "No text-red-500" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "5" ? "text-red-500" : "text-green-500"} text-center -mt-3 px-2`}
                                                    >
                                                        {`${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "0" ? "Reservado (Pendiente de Aprobación por pagos o fecha)" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "1" ? "Vendido" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "2" ? "Rechazado" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "4" ? "No Disponible Asesor" : dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "5" ? "No Disponible Invitado" : "Disponible"}`}
                                                    </div>
                                                </div>
                                                {
                                                    dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.status == "1" && dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.celular !== "" && dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.celular !== null && dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.celular !== undefined && (getValues()?.user?.role == "admin" || getValues()?.user?.role == "super admin") &&
                                                    <div className="mb-2 -mt-3">
                                                        <button className="bg-green-500 text-[12px] text-white w-full py-2 px-2 rounded-sm  font-bold text-xl cursor-pointer" onClick={() => {
                                                            console.log("enviar wsp")
                                                            const nombre = dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.nombres;
                                                            const nameEvento = info?.title;
                                                            const codAsiento = dataAsientos?.id;
                                                            const direccionEvento = info?.direccion;
                                                            const fechaEvento = moment.tz(info?.dateEvent, "America/Lima").format("DD-MM-YYYY");
                                                            const flyerEvento = info?.urlFlyer?.replace("http", "https");

                                                            const mensaje = `Hola ${nombre}!! te saluda "Inmobiliaria Muñoz", tu compra de entrada para el evento "${nameEvento}" fue exitosa!! 
Datos de Compra:
- Pagó S/. ${changeDecimales(dataAsientos?.precio)}.
- Asiento: ${(dataAsientos?.precio == info?.precioEntradaPlatinium) ? "VIP (V)" : (dataAsientos?.precio == info?.precioEntradaPremium) ? "Premium (P)" : "GENERAL (G)"} ${codAsiento}.
- Fecha: ${fechaEvento}.
- Dirección: ${direccionEvento}.
- Más información del Evento: 
  ${flyerEvento}`;

                                                            const urlFinal = `https://wa.me/51${dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.celular}?text=${encodeURIComponent(mensaje)}`;
                                                            window.open(urlFinal, "_blank");
                                                        }}>
                                                            Enviar WSP
                                                        </button>
                                                    </div>
                                                }
                                            </>
                                        }
                                    </div>
                                </div>
                                {
                                    (getValues()?.user?.role == "admin" || getValues()?.user?.role == "super admin") &&
                                    <>
                                        {
                                            dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                            // dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.compraUserAntiguo &&
                                            <div className="flex flex-col gap-1 justify-start items-start mt-2 w-full">
                                                <Controller
                                                    name={"fileUrl"}
                                                    control={control}
                                                    rules={{
                                                        validate: (value) => {
                                                            if (false) {
                                                                if (!value || !value.file) return `${"fileUrl"} es obligatorio`;
                                                            }
                                                            return true;
                                                        }
                                                    }}
                                                    render={({ field, fieldState }) => (
                                                        <div className="flex flex-row gap-1 justify-start items-center w-full">
                                                            <Button
                                                                variant="contained"
                                                                component="label"
                                                                disabled={(getValues()?.user?.role !== "admin" && getValues()?.user?.role !== "super admin") && true}
                                                                style={{ width: "100% !important", height: '25px' }}
                                                                className="w-full py-1 fornt-bold"
                                                            >
                                                                + Voucher
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

                                                            {getValues("fileUrl") !== "" && getValues("fileUrl") !== undefined && getValues("fileUrl") !== null && (
                                                                <>
                                                                    {/* <IconButton
                                                                    onClick={() => window.open(getValues("fileUrl")?.fileUrl ?? getValues("fileUrl"), "_blank")}
                                                                    color="primary"
                                                                    aria-label="Ver imagen"
                                                                >
                                                                    <IoMdEye />
                                                                </IconButton> */}
                                                                    <div
                                                                        className="cursor-pointer"
                                                                        onClick={() => window.open(getValues(`fileUrl`)?.fileUrl ?? getValues(`fileUrl`), "_blank")}
                                                                    >
                                                                        <img
                                                                            src={getValues(`fileUrl`)?.fileUrl ?? getValues(`fileUrl`)}
                                                                            alt="Vista previa"
                                                                            style={{ width: 100, height: "auto", marginTop: 0, borderRadius: 4 }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex justify-center items-center gap-1">
                                                                        <button disabled={loadingUpload} className={`bg-green-500 text-[12px] text-white py-2 px-1 rounded-sm  font-bold text-xl cursor-pointer disabled:bg-gray-400 ${loadingUpload && "opacity-50"}`} onClick={() => handleAddVoucherAsiento(dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id), dataAsientos?.id)}>
                                                                            <Upload
                                                                                color="#fff"
                                                                                size={15}
                                                                            />
                                                                        </button>
                                                                        <button className="bg-red-500 text-[12px] text-white py-2 px-1 rounded-sm  font-bold text-xl cursor-pointer" onClick={() => setValue(`fileUrl`, "")}>
                                                                            <X
                                                                                color="#fff"
                                                                                size={15}
                                                                            />
                                                                        </button>
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
                                        {
                                            dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id) &&
                                            <>
                                                <div className="flex justify-center gap-2 items-center mx-2 px-2 w-full mt-2">
                                                    <div className="mt-0 uppercase font-bold text-sm">
                                                        {`Vouchers Totales: ${getValues()?.vouchersAsiento?.length ?? 0}`}
                                                    </div>
                                                    <div className="flex flex-row gap-1 justify-start items-start mt-0">
                                                        <div className="bg-yellow-500 rounded-full px-1 w-full text-center">
                                                            {`${getValues()?.vouchersAsiento?.filter((x: any) => x.status == "0")?.length ?? 0}`}
                                                        </div>
                                                        <div className="bg-green-500 rounded-full px-1 w-full text-center">
                                                            {`${getValues()?.vouchersAsiento?.filter((x: any) => x.status == "1")?.length ?? 0}`}
                                                        </div>
                                                        <div className="bg-red-500 rounded-full px-1 w-full text-center">
                                                            {`${getValues()?.vouchersAsiento?.filter((x: any) => x.status == "2")?.length ?? 0}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.montoPasarela &&
                                                    <div className="text-center text-sm mb-1 px-8 py-2 border-2 rounded-lg shadow-2xl mx-5 mt-5 bg-green-200 uppercase font-bold">
                                                        {`Pagó con Pasarela: S/. ${changeDecimales(dataAsientosComprados?.find((x: any) => x?.codAsiento == dataAsientos?.id)?.montoPasarela)}`}
                                                    </div>
                                                }
                                                <div className="grid grid-cols-4 gap-2 justify-center items-start mt-2 px-3 mb-1">
                                                    {
                                                        getValues()?.vouchersAsiento?.map((item: any, index: number) => {
                                                            return (
                                                                <div
                                                                    className="flex flex-col gap-0 justify-between items-center border-2 border-slate-200 rounded-md h-full" key={index}
                                                                    onClick={() => handleChangeState(item?._id, item?.codAsiento, "statusVoucher")}
                                                                >
                                                                    <div
                                                                        className="cursor-pointer h-full"
                                                                    // onClick={() => window.open(item?.url, "_blank")}
                                                                    >
                                                                        <img
                                                                            src={item?.url}
                                                                            alt="Vista previa"
                                                                            className="max-h-[120px] w-auto object-contain"
                                                                        />
                                                                    </div>
                                                                    <div
                                                                        className={`${item?.status === "1" ? "bg-green-500" : item?.status === "0" ? "bg-yellow-500" : item?.status === "2" && "bg-red-500"} rounded-md px-1 w-full text-center text-sm mt-1`}
                                                                    >
                                                                        {item?.status === "1" ? "Aprobado" : item?.status === "0" ? "Pendiente" : item?.status === "2" && "Rechazado"}
                                                                    </div>
                                                                    <div className="text-center text-xs ">{item?.comentario}</div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </>
                                        }
                                    </>
                                }

                            </div>
                        </div>
                    </>
                }
                {
                    openPopup &&
                    <>
                        <PopUp {...{ onSubmit, handleSubmit, control, apiCall, loading, error, getValues, setValue, reset, loadingUpload, handleSearch, setOpen, dataAsientos, setOpenPopup }} />
                    </>
                }
            </div >
        </div >
    )
}