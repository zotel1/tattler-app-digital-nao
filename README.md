# Tatler-App
Esta API es una gestión de restaurantes, desarrollada en Node.js utilizando Express y MongoDB Atlas. 
La API permite realizar operaciones CRUD y búsquedas avanzadas, incluyendo filtros geoespaciales.

## Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar registros de restaurantes.
- **Búsqueda Geoespacial**: Encuentra restaurantes cercanos en un radio especificado.
- **Filtros de Búsqueda**: Búsqueda por nombre y tipo de cocina (cuisine).
- **Validación de Datos**: Validación de entradas y manejo de errores.

## Tecnologías

- Node.js y Express para el servidor.
- MongoDB Compass para la gestión de datos.
- Postman para pruebas de API.

## Uso
La API estará disponible en http://localhost:3005/api/v1/restaurantes. 
A continuación, se describen los endpoints y los parámetros.

**Endpoints**
- Obtener Todos los Restaurantes GET /api/v1/restaurantes 
*Descripción*: Obtiene una lista de todos los restaurantes.
*Parámetros de Consulta*:
borough (opcional)
cuisine (opcional)

#

- Obtener Restaurante por ID
GET /api/v1/restaurantes/:id
*Descripción*: Obtiene un restaurante específico por restaurant_id.

#

**Crear un Nuevo Restaurante**
POST /api/v1/restaurantes
*Descripción*: Crea un nuevo restaurante.
Body:
json
Código de ejemplo
{
  "name": "Nombre del Restaurante",
  "borough": "Nombre del Barrio",
  "cuisine": "Tipo de Cocina",
  "address": {
    "building": "Número de Edificio",
    "coord": [-73.8803827, 40.7643124],
    "street": "Nombre de la Calle",
    "zipcode": "Código Postal"
  },
  "grades": [{ "date": "2022-11-10T00:00:00Z", "score": 8 }],
  "comments": [{ "date": "2022-11-10T00:00:00Z", "comment": "Comentario del cliente" }]

}

#
**Actualizar un Restaurante**
PUT /api/v1/restaurantes/:id
*Descripción*: Actualiza los datos de un restaurante.
*Body*: Campos a actualizar (similar a los datos del POST).

#

**Eliminar un Restaurante**
DELETE /api/v1/restaurantes/:id
*Descripción*: Elimina un restaurante específico.

#

**Búsqueda Geoespacial de Restaurantes Cercanos**
GET /api/v1/restaurantes/cerca
*Parámetros de Consulta*:
*longitude*: Longitud en grados.
*latitude*: Latitud en grados.
*maxDistanceKm*: Distancia máxima en kilómetros.

#

**Búsqueda por Tipo de Cocina y Nombre**
GET /api/v1/restaurantes/busqueda
*Parámetros de Consulta*:
*cuisine*: Tipo de cocina (opcional).
*name*: Nombre del restaurante (opcional).
# Ejemplos de Uso
**Buscar Restaurantes por Cocina**

GET http://localhost:3005/api/v1/restaurantes/busqueda?cuisine=American
#
**Buscar Restaurantes Cercanos**

GET http://localhost:3005/api/v1/restaurantes/cerca?longitude=-73.8803827&latitude=40.7643124&maxDistanceKm=5

## **Crear un Restaurante en Postman**
# json
- Código POST http://localhost:3005/api/v1/restaurantes
Body:
{
  "name": "Nuevo Restaurante",
  "borough": "Manhattan",
  "cuisine": "Mexican",
  "address": {
    "building": "4567",
    "coord": [-73.9876, 40.7654],
    "street": "Broadway",
    "zipcode": "10001"
  },
  "grades": [{"date": "2023-01-01T00:00:00Z", "score": 7}],
  "comments": [{"date": "2023-01-01T00:00:00Z", "comment": "Muy bueno!"}]
}
