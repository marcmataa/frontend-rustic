import axios from "axios";

// Creamos una instancia personalizada ded Axios, sirve para configurar el puerto y la url y que sea utilizable en todo el documento.
const api = axios.create({
  baseURL: "http://localhost:3000/",
});

// "Middleware" de salida: Se ejecuta antes de que la peticion se vaya en el servidor
api.interceptors.request.use(
  (config) => {
    // Sirve para cojer un token que tenemos en localstorage
    const token = localStorage.getItem("token");
    // Si el token existe, lo añadimos al header de la autorizacion con el valor bearer token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("Petición enviada a:", config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// "Middleware" de entrada: Al recibir la respuesta
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es correcta, es decir un status 200, 201... slo dejamos pasar
    return response;
  },
  (error) => {
    // Ejemplo: Si el servidor da 401, podrías redirigir al login
    if (error.response?.status === 401) {
      console.error("No autorizado");
      localStorage.removeItem("token")
    }
    return Promise.reject(error);
  },
);

export default api;