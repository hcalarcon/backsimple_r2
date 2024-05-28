//archivo de configuración de la documentación

export const options = {
  definition: {
    openapi: "3.0.0", // Especifica la versión de OpenAPI
    info: {
      title: "Documentación de API",
      version: "1.0.0", // Versión de tu API
      description: "Descripción de tu API",
    },
    servers: [
      {
        url: "http://localhost:3000", // Cambia la URL base según tu entorno
      },
    ],
  },
  apis: ["./src/router/**/*.js"],
};
