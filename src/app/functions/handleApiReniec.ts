
// interface Reniec {
//     dni: string
//     key: string
//     setValue: any
//     getValues: any
//     apiCall: any
//     loading: any
//     error: any
//     registroIndex: any
// }

import { Apis } from "../configs/proyecto/proyectCurrent";

export const handleApiReniec = async (dni: any, key: string, setValue: any, apiCall: any, registroIndex: string) => {

    // const url = "http://localhost:3001/api/auth/reniec" // dev
    const url = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/reniec`; // prd

    // const urlDataMe = "http://localhost:3001/api/auth/getUser" // dev 
    const urlDataMe = `${Apis.URL_APOIMENT_BACKEND_DEV}/api/auth/getUser`; // prd

    try {

        const apiReniecMe = await apiCall({
            method: 'post',
            endpoint: urlDataMe,
            data: { documentoUsuario: dni }
        });
        const existe = apiReniecMe?.data !== null ? true : false;
        setValue(`UsuarioAntiguo`, existe);
        console.log("existe usuario1?: ", existe);
        console.log("existe usuario2?: ", apiReniecMe);

        if (!existe || key === "dniConyugue") {
            const apiReniec = await apiCall({
                method: "post",
                endpoint: url,
                data: {
                    dni: dni,
                }
            });

            console.log(apiReniec);
            if (apiReniec !== undefined && key === "dniCliente") {
                console.log("apiReniec?.data?.data?.nombres1: ", apiReniec);
                setValue(`nombres`, apiReniec?.data?.data?.nombres || apiReniec?.data?.nombres);
                setValue(`apellidoPaterno`, apiReniec?.data?.data?.apellido_paterno || apiReniec?.data?.apellidoPaterno);
                setValue(`apellidoMaterno`, apiReniec?.data?.data?.apellido_materno || apiReniec?.data?.apellidoMaterno);
                setValue(`asientos.celular`, (apiReniec?.data?.data?.celular ?? "") || (apiReniec?.data?.celular ?? ""));
                setValue(`asientos.email`, (apiReniec?.data?.data?.email ?? "") || (apiReniec?.data?.email ?? ""));

                return;
            }
            else if (!apiReniec?.data?.success) {
                console.log("apiReniec?.data?.success3: ", apiReniec);
                setValue(`nombres`, "");
                setValue(`apellidoPaterno`, "");
                setValue(`apellidoMaterno`, "");
                setValue(`asientos.celular`, "");
                setValue(`asientos.email`, "");

            }
        }
        else if (existe) {
            console.log("existe usuario3?: ", apiReniecMe?.data?.nombres);
            if (key === "dniCliente") {
                console.log("existe usuario44?: ", apiReniecMe?.data?.nombres);
                setValue(`nombres`, apiReniecMe?.data?.nombres);
                setValue(`apellidoPaterno`, apiReniecMe?.data?.apellidoPaterno);
                setValue(`apellidoMaterno`, apiReniecMe?.data?.apellidoMaterno);
                setValue(`asientos.celular`, apiReniecMe?.data?.celular ?? "");
                setValue(`asientos.email`, apiReniecMe?.data?.email ?? "");

            }
            else {
                console.log("existe usuario77?: ", apiReniecMe?.data?.nombres);
                setValue(`nombres`, apiReniecMe?.data?.nombres);
                setValue(`apellidoPaterno`, apiReniecMe?.data?.apellidoPaterno);
                setValue(`apellidoMaterno`, apiReniecMe?.data?.apellidoMaterno);
                setValue(`asientos.celular`, apiReniecMe?.data?.celular ?? "");
                setValue(`asientos.email`, apiReniecMe?.data?.email ?? "");
            }
        }

    } catch (error) {
        console.error("Error al consultar el DNI:", error);
    }
}