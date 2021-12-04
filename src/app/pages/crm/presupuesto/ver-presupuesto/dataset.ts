
export const options = {
    inputOptions: {
        cop: 'Pesos',
        usd: 'Dolares',
    },
    inputPlaceholder: 'Seleccione una moneda',
    title: 'Se dispone a descargar el presupuesto',
    input: 'select',
    showCancelButton: true,
    inputValidator: (value) => {
        return new Promise((resolve) => {
            if (value) {
                resolve('')
            } else {
                resolve('Necesitas seleccionar un tipo de moneda')
            }
        })
    }
}