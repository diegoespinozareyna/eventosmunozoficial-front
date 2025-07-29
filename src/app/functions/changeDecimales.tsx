export const changeDecimales = (numero: any) => {
    // Convertir el número a un formato con 3 decimales
    let numeroConDecimales = Number(numero).toFixed(2); // "101000.000"

    // Separar la parte entera y la parte decimal
    let [parteEntera, parteDecimal] = numeroConDecimales.split('.');

    // Agregar el separador de miles (') a la parte entera
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Unir la parte entera y la parte decimal con un punto
    let numeroFormateado = `${parteEntera}.${parteDecimal}`;

    // console.log(numeroFormateado); // Salida: "101'000.000"

    return numeroFormateado;
}