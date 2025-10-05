"use client"

import { Apis } from "@/app/configs/proyecto/proyectCurrent"
import useApi from "@/app/hooks/fetchData/useApi"
import { Button, IconButton, TextField } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { Controller, useFieldArray, useForm } from "react-hook-form"
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
import { Bus50 } from "@/app/components/sprinterssvg/Bus50"
import { handleApiReniec } from "@/app/functions/handleApiReniec"

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

    useEffect(() => {
        console.log("info: ", info)
    }, [info])

    const params: any = useParams()
    console.log("params: ", params?.visitas)

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

                // if (match?.status == "4") {
                //     // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                //     obj1?.setAttribute('fill', "#61baed");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (match?.status == "5") {
                //     // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                //     obj1?.setAttribute('fill', "#afa");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (match?.isTicketsPendings > 0 && match?.status !== "1") {
                //     obj1?.setAttribute('fill', "#ff0");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (match?.isPasarela == true && match?.status !== "1") {
                //     obj1?.setAttribute('fill', "#ff0");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (
                //     (
                //         diferencia <= 3 * milisegundosEnUnDia
                //         || diferencia2 <= 6 * milisegundosEnUnDia
                //     ) && diferencia > 0 && match?.status == "0") {
                //     obj1?.setAttribute('fill', "#f55");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (match?.compraUserAntiguo == true && match?.status == "1") {
                //     obj1?.setAttribute('fill', "#61baed");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // else if (match?.compraUserAntiguo == false && match?.status == "1") {
                //     obj1?.setAttribute('fill', "#afa");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // // else if (match?.status == "1") {
                // //     obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                // //     obj1?.setAttribute('stroke', '#333');
                // //     obj1?.setAttribute('stroke-width', '0.3')
                // // }
                // else if (match?.status == "0") {
                //     // obj1?.setAttribute('fill', Apis.COLOR_DISPONIBLE);
                //     // obj1?.setAttribute('fill', "#efc600"); // color dorado
                //     obj1?.setAttribute('fill', "#e9afdd"); // color rosado
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     obj1?.setAttribute('fill', "#efc600"); // color dorado asiento premium
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("C")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("D")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("E")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("F")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 10
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 10
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 20
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 20
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 30
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 30
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 40
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //         || obj1?.id?.includes("J")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 40
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //         || obj1?.id?.includes("J")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //         || obj1?.id?.includes("J")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 50
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //         || obj1?.id?.includes("J")
                //         || obj1?.id?.includes("K")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 50
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("F")
                //         || obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //         || obj1?.id?.includes("J")
                //         || obj1?.id?.includes("K")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
                // //
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("A")
                //         || obj1?.id?.includes("B")
                //         || obj1?.id?.includes("C")
                //         || obj1?.id?.includes("D")
                //         || obj1?.id?.includes("E")
                //         || obj1?.id?.includes("F")
                //     )
                // ) {
                //     obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "#efc600"); // color morado asiento vip
                //     // obj1?.setAttribute('fill', "#6F0A6F");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPlatinium)
                // }
                // else if (
                //     (
                //         info?.cantidadPlatinium == 60
                //         && info?.cantidadPremium == 60
                //     )
                //     &&
                //     (
                //         obj1?.id?.includes("G")
                //         || obj1?.id?.includes("H")
                //         || obj1?.id?.includes("I")
                //         || obj1?.id?.includes("J")
                //         || obj1?.id?.includes("K")
                //         || obj1?.id?.includes("L")
                //     )
                // ) {
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)");
                //     // obj1?.setAttribute('fill', "rgba(111, 10, 111, 0.6)"); // color dorado asiento premium
                //     obj1?.setAttribute('fill', "#efc600");
                //     // obj1?.setAttribute('fill', "#8B5CF6");
                //     obj1?.setAttribute('stroke', '#333');
                //     obj1?.setAttribute('stroke-width', '0.3')
                //     obj1?.setAttribute('precio', info?.precioEntradaPremium)
                // }
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
                // else {
                if (match?.status == "1") {
                    obj1?.setAttribute('fill', Apis.COLOR_VENDIDO_CONTADO);
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                else {
                    obj1?.setAttribute('fill', "#efefef");
                    obj1?.setAttribute('stroke', '#333');
                    obj1?.setAttribute('stroke-width', '0.3')
                }
                // }
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
    }, [info])

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
        append({
            // status: String, // "0": pendiente, "1": aprobado, "2": rechazado, "3": anulado
            // documentoUsuario: String,
            // nombres: String,
            // apellidoPaterno: String,
            // apellidoMaterno: String,
            // celular: String,
            codAsiento: codAsiento, // numero de asiento
            precio: info?.precioAsiento,
            codMatrixTicket: info?._id, // codigo id de evento
            // fileUrl: String,
            // compraUserAntiguo: Boolean,
            // proyecto: String,
            // usuarioRegistro: String,
            // patrocinadorId: String,
            // fechaFin: Date,
            // montoPasarela: String,
        })
        // setDataAsientos(
        //     {
        //         id: codAsiento,
        //         precio: precioAll ?? info?.precioEntradaGeneral
        //     }
        // )
        // const ticketsAsientosno3 = await fetchAsientosIdMatrix()
        // console.log("ticketsAsientosno3: ", ticketsAsientosno3)
        // console.log("ticketsAsientosno3: ", ticketsAsientosno3?.find((x: any) => x?.codAsiento == codAsiento))
        // handleVouchersAsiento(codAsiento, params?.eventos?.split("-")[1], ticketsAsientosno3?.find((x: any) => x?.codAsiento == codAsiento)?._id)
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

    return (
        <div className="bg-blue-500 h-[100vh]">
            {/* {isLoading && <TicketLoaderMotion />} */}
            <div className="!max-w-full relative z-20 w-full flex items-center justify-center bg-blue-500">
                {
                    true &&
                    <div className="bg-blue-500 flex flex-col -mt-3">
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
                        {/* <div className="w-full text-center mb-0 font-bold text-base uppercase text-white -mt-1">
                            {info?.titulo}
                        </div> */}
                        <>
                            <div className='flex flex-col bg-blue-500 justify-start items-center gap-4 p-4 w-full px-5 overflow-y-auto'>
                                <div className='flex flex-col justify-center items-center w-full md:w-3/4 max-w-4xl gap-4'>
                                    <div className='flex flex-col gap-1 justify-center items-center'>
                                        <h1 className='text-center text-white text-2xl font-bold'>
                                            {info?.titulo}
                                        </h1>
                                        <h1 className='text-center text-white text-2xl font-bold'>
                                            {moment.tz(info?.fechaVisita, "America/Lima").format("DD/MM/YYYY")}
                                        </h1>
                                    </div>

                                    {/* tipo buses */}
                                    {/* <div id='typeBuses' className='flex flex-col w-full gap-2'>
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
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}

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
                                                    {`${"0"}`}
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
                                            {/* <div className='flex flex-col w-full px-2 py-1 border rounded-lg border-orange-100 bg-orange-50'>
                                                <div>
                                                    Vehiculo Actual:
                                                </div>
                                                <div className='font-bold text-orange-400'>
                                                    {`${"Sprinter 10"}`}
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    {/* asientosBuses */}
                                    <div id='asientosBuses' className='flex flex-col w-full gap-2'>
                                        <div className='flex flex-col gap-4 justify-center items-center bg-white rounded-lg px-3 py-2'>
                                            <div className='flex w-full justify-between'>
                                                <div className='flex justify-center items-center gap-4'>
                                                    <div className='scale-200 -mt-2'>
                                                        🚌
                                                    </div>
                                                    <div>
                                                        <h1 className='text-xl font-bold'>
                                                            {/* {`${"Sprinter 10"}`} */}
                                                        </h1>
                                                    </div>
                                                </div>
                                                <div className='flex justify-center items-center gap-1'>
                                                    <div className='bg-white p-1 text-center'>
                                                        {`Ocupados: ${"0"}/50`}
                                                    </div>
                                                    <div>
                                                        {/* <button className='bg-blue-400 text-white rounded-lg px-2 py-1 font-semibold'>
                                                                Activo
                                                            </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='relative w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
                                                {/* asientos svgx */}
                                                <div className='relative w-full h-[650px] md:h-[450px] border border-slate-300'>
                                                    {/* <Sprinter10 /> */}
                                                    <Bus50 {...{ handleClickInformation }} />
                                                </div>
                                                <div className="flex flex-col gap-3 justify-center items-center">
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
                                                                        <div className="cursor-pointer bg-red-500 text-white rounded-full p-1" onClick={() => remove(index)}>
                                                                            <X className="h-3 w-3" />
                                                                        </div>
                                                                    </div>
                                                                    <Controller
                                                                        name={`asientos[${index}].documentoUsuario`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Documento Usuario"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                type="text"
                                                                                fullWidth
                                                                                // disabled={item.disabled}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                required={item.required}
                                                                                onChange={(e) => {
                                                                                    let value = e.target.value;
                                                                                    if (value?.length > 12) value = value.slice(0, 12); // Máximo 12 caracteres
                                                                                    if (value.length === 8) {
                                                                                        console.log("reniec");
                                                                                        handleApiReniec(value, "dniCliente", setValue, apiCall, "0");
                                                                                    }

                                                                                    field.onChange(value);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                    <Controller
                                                                        name={`asientos[${index}].nombres`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Nombres"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                type="text"
                                                                                fullWidth
                                                                                // disabled={item.disabled}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                // required={item.required}
                                                                                onChange={(e) => {
                                                                                    let value = e.target.value;
                                                                                    field.onChange(value);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                    <Controller
                                                                        name={`asientos[${index}].apellidoPaterno`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Apellido Paterno"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                type="text"
                                                                                fullWidth
                                                                                // disabled={item.disabled}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                // required={item.required}
                                                                                onChange={(e) => {
                                                                                    let value = e.target.value;
                                                                                    field.onChange(value);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                    <Controller
                                                                        name={`asientos[${index}].apellidoMaterno`}
                                                                        control={control}
                                                                        render={({ field }) => (
                                                                            <TextField
                                                                                {...field}
                                                                                label="Apellido Materno"
                                                                                variant="outlined"
                                                                                size="small"
                                                                                type="text"
                                                                                fullWidth
                                                                                // disabled={item.disabled}
                                                                                InputLabelProps={{
                                                                                    shrink: true,
                                                                                }}
                                                                                // required={item.required}
                                                                                onChange={(e) => {
                                                                                    let value = e.target.value;
                                                                                    field.onChange(value);
                                                                                }}
                                                                            />
                                                                        )}
                                                                    />
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
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
                        <PopUp {...{ onSubmit, handleSubmit, control, apiCall, loading, error, getValues, setValue, reset, loadingUpload, handleSearch, setOpen, dataAsientos, setOpenPopup }} />
                    </>
                }
            </div >
        </div >
    )
}