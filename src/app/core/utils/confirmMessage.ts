import Swal from 'sweetalert2';

export async function showConfirm<T>(status: any, model: string) {
    return Swal.fire({
        title: '¿Estás seguro(a)?',
        text: (status === 'Inactivo' ? `La ${model} se inactivará!` : `La ${model} se activará`),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#A3BD30',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
        confirmButtonText: (status === 'Inactivo' ? 'Sí, inhabilitar' : 'Sí, activar')
    })
}

export async function showConfirmCancel<T>(status: any, model: string) {
    const SwalMsje = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success mx-2',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    return SwalMsje.fire({
        title: '¿Estás seguro(a)?',
        text: "Se dispone a cancelar una ".concat(model),
        icon: 'warning',
        input: 'text',
        inputAttributes: {
            maxlength: "50",
            autocapitalize: 'off',
            autocorrect: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Si, cancelar '.concat(model),
        cancelButtonText: 'No, ¡déjame comprobar!',
        reverseButtons: true
    })
}

export async function showConfirmCancelWhitoutMessage<T>(status: any, model: string) {
    return Swal.fire({
        title: '¿Estás seguro(a)?',
        text: `Estas a un paso de ${status} esta  ${model} !`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#A3BD30',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, ' + status
    })
}

export function successMessage<T>(
    status: any = 'Operación exitosa',
    message: string = 'Felicidades, operacíón realizada correctamente.',
    model: string = ''
) {
    Swal.fire({
        title: status,
        text: message,
        icon: 'success',
        allowOutsideClick: false,
        allowEscapeKey: false
    })
}

export function errorMessage<T>(
    status: any = 'Ooops',
    model: string = ''
) {
    Swal.fire({
        title: status,
        text: 'Se han registrado errores operación no realizada',
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false
    })
}

export function WarningMessage<T>(
    status: any = 'Ooops',
    text: any = 'Verifique los datos',
    model: string = ''
) {
    Swal.fire({
        title: status,
        text: text,
        icon: 'error',
        allowOutsideClick: false,
        allowEscapeKey: false
    })
}
