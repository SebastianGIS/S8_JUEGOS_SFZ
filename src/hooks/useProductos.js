import { useEffect, useState } from "react";

import { URL_DATOS } from "../utils/formato";

/**
 * Carga el catálogo de productos desde el archivo JSON del sitio.
 * @returns {{productos: Array, cargando: boolean, error: string|null}}
 *   productos: el catálogo, o un arreglo vacío mientras no haya llegado.
 *   cargando: true mientras la petición está en vuelo.
 *   error: mensaje amigable si la carga falló, o null.
 */
export default function useProductos() {
    /* Arranca vacío: los datos llegan después del primer renderizado */
    const [productos, setProductos] = useState([]);

    /* Empieza en true porque la aplicación nace cargando, no vacía. Si
       empezara en false se vería un instante el mensaje de "no hay
       juegos" antes de que llegaran los datos. */
    const [cargando, setCargando] = useState(true);

    /* null mientras todo va bien */
    const [error, setError] = useState(null);

    /* useEffect con [] como segundo argumento se ejecuta UNA vez, justo
       después del primer renderizado. Es el lugar donde React espera los
       efectos secundarios: pedir datos, suscribirse a algo, tocar el
       exterior. Hacerlo durante el renderizado sería un error, porque el
       renderizado tiene que ser una función pura.

       Sin el arreglo vacío el efecto correría en cada renderizado, y
       como cambia el estado, eso sería un bucle infinito. */
    useEffect(() => {
        /* La guarda existe porque en desarrollo StrictMode monta el
           componente, lo desmonta y lo vuelve a montar para destapar
           efectos mal escritos. Sin ella, la respuesta del primer fetch
           intentaría actualizar un componente que ya no está. */
        let cancelado = false;

        fetch(URL_DATOS)
            .then((respuesta) => {
                /* Un 404 NO hace que fetch falle: la promesa se resuelve
                   igual y .json() reventaría leyendo una página de
                   error. Hay que mirar el estado a mano. */
                if (!respuesta.ok) {
                    throw new Error(`El servidor respondió ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then((datos) => {
                if (cancelado) return;
                setProductos(datos.productos);
                setCargando(false);
            })
            .catch((fallo) => {
                if (cancelado) return;
                /* El detalle técnico va a la consola, que es donde sirve;
                   a la pantalla va un mensaje que se entienda. */
                console.error("Fallo al cargar el catálogo:", fallo);
                setError(
                    "No pudimos cargar el catálogo. Revisa tu conexión y vuelve a intentarlo."
                );
                setCargando(false);
            });

        /* Función de limpieza: React la llama al desmontar */
        return () => {
            cancelado = true;
        };
    }, []);

    return { productos, cargando, error };
}
