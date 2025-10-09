import { StatusLotes } from "./statusLotes";

export const Apis = {
    URL_APOIMENT_BACKEND_PRD: "https://proyectosmunoz.vercel.app",
    // URL_APOIMENT_BACKEND_DEV: "https://apimunozbase.vercel.app",
    // URL_APOIMENT_BACKEND_DEV: "http://191.96.251.76:3001",
    // URL_APOIMENT_BACKEND_DEV: "https://inmobackend.site",
    // URL_APOIMENT_BACKEND_DEV: "https://inmobackend.store",
    // URL_APOIMENT_BACKEND_DEV: "http://localhost:7000",
    URL_APOIMENT_BACKEND_DEV: "https://apieventosmunoz.inmunoz.com",
    // URL_APOIMENT_BACKEND_DEV2: "http://localhost:5000",
    URL_APOIMENT_BACKEND_DEV2: "https://serverimages.inmobackend.site",
    //DATOS PROYECTO
    PROYECTCURRENT: "eventosmunozoficial",
    PROYECTCURRENT_NAMEDOMINIO: "eventosmunozoficial",
    PROYECTCURRENT_NAMEDOMINIO2: "eventosmunoz",
    NAME_PROYECT: "Eventos Muñoz",
    NAME_INMOBILIARIA: "INMOBILIARIA MUÑOZ",
    NAME_LOGO: "/logoperladelchira.jpg",
    NAME_FAVICON: "/favicon1.jpg",
    NAME_FONDO_PORTADA: "/PORTADALOGINHuacachina.jpg",
    NAME_LOGO_VARIANTE: "/LOGOVARIANTE.png",
    PHOTO_QR_YAPE_CUENTAS: "/qrmioyape2.jpg",
    PHOTO_IMAGEN_LOGIN: "/logoLogin.png",
    PHOTO_IMAGEN_ICONO_USUARIO: "/logoIconoUsuario.png",
    DIAS_RESERVA: 5,
    DESCUENTOS: true,
    INICIAL_ETIQUETA: true,
    FINANCIAMIENTO: true,
    LOTES_STATUS: [
        // "",
        StatusLotes.STATUS_DISPONIBLE,
        StatusLotes.STATUS_RESERVADO,
        StatusLotes.STATUS_VENDIDO_CONTADO,
        StatusLotes.STATUS_VENDIDO_FINANCIADO,
        StatusLotes.STATUS_NO_DISPONIBLE,
        StatusLotes.STATUS_BLOQUEADO
    ],
    LOTES_UBICACIONES: ["Calle", "Frente a Parque", "Avenida", "Esquina"],
    PRECIO_PASARELA: 1,
    PRECIO_DOLARES: true,
    PRECIO_INICIAL: true,
    TIPO_CAMBIO_DOLARES: 3.81,
    TERMINOS_CONDICIONES: `TERMINOS Y CONDICIONES
* La separación del lote es válida por 7 días hábiles desde la firma de este documento. 
* Dentro de este plazo, debe realizar la firma de Contrato previo pago de la inicial acordada. 
* Una vez realizada la separación a través del presente documento, se procederá a retirar la propiedad del mercado. 
* Inmobiliaria GRUPO V&C INMOBILIARIO S.A.C entregará una Boleta de Venta, emitida por la SUNAT del monto pagado por la separación. 
* Si el COMPRADOR desiste de la compra, se le retendrá el 40% por gastos administrativos de la presente separación.`,
    //ROLES ACTIVOS
    ROL_ADMIN: true,
    ROL_USER_LIDER: false,
    ROL_USER_ASESOR: true,
    ROL_USER_TEMPORAL: true,
    //usan broker en agentes
    USE_BROKER: true,
    //Grupos Broker
    DATA_BROKER: [
        {
            description: "---Seleccione rol de usuario---",
            value: "",
        },
        {
            description: "Grupo Vida",
            value: "Grupo Vida",
        },
        {
            description: "3S Real State",
            value: "3S Real State",
        },
    ],
    //redes
    LINK_FACEBOOK: "https://www.facebook.com/vycgrupoinmobiliario",
    LINK_INSTAGRAM: "https://www.instagram.com/vyc.grupoinmobiliario/?next=%2F",
    LINK_TIKTOK: "https://www.tiktok.com/@vyc.grupoinmobiliario",
    LINK_TWITTER: "/#",
    LINK_YOUTUBE: "/#",
    LINK_WEBSITE: "https://www.ubuntunetwork.pe",
    LINK_GITHUB: "https://github.com/ubuntunetworkpe",
    LINK_LIBRO_RECLAMACIONES: "https://reclamovirtual.pe/reclamar/grupovycinmobiliario/grupovycinmobiliarialibroreclamaciones",
    //COLORES STATUS
    COLOR_VENDIDO_CONTADO: "#61baed",
    COLOR_VENDIDO_FINANCIADO: "#2ad3b3",
    COLOR_NO_DISPONIBLE: "#2aff80",
    COLOR_DISPONIBLE: "#efefef",
    COLOR_SEPERADO: "#00ffff",
    COLOR_BLOQUEADO: "#999999",
    COLOR_RESERVADO: "#ca8a04",
    COLOR_DESCUENTO: "#fce11f",
    //colores panel y fondo plano
    COLOR_FONDO_PLANO: "bg-[#d4e5c2]",
    COLOR_PANELIZQUIERDO: "bg-green-500",
    COLOR_PANELIZQUIERDO_NO_TAILWIND: "#22c55e",
    COLOR_FONDOLOGIN: "#0CAE93",
    COLOR_FONDOINPUT: "#085247",
    COLOR_BOTONLOGIN: "#E4D162",
    SEDES: [
        {
            id: 0,
            description: "Miraflores del Norte 1 - 2",
            name: "mirafloresdelnorte1",
        },
        {
            id: 1,
            description: "Miraflores del Norte 3",
            name: "mirafloresdelnorte2",
        },
        {
            id: 2,
            description: "Paracas",
            name: "paracas",
        },
        {
            id: 3,
            description: "Paraiso",
            name: "paraiso",
        },
        {
            id: 4,
            description: "Valle Hermoso Cañete",
            name: "vallehermosocanete",
        },
    ],
    SEDES_VISITA_BUS: [
        {
            value: "0",
            label: "paracas",
        },
        {
            value: "1",
            label: "vallehermosocanete",
        },
    ]
};
