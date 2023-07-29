# Startup-SaaS-Web-App
Repositorio donde se almacenan los archivos correspondientes a una aplicación web para un SaaS.


# Contenido:
## Carpeta Assets
Aquí se almacena el código de la aplicación web.

### Landing Frontend

```
# Para descargar las dependencias
npm install

# Para probar el código
npm start

# Para hacer build del código (el resultado queda guardado en la carpeta /build)
npm run build

```

### Backend
```
# Para descargar las librerías que necesitan los layers de Lambda en la carpeta python /layers/python
pip install --target ./layers/python jsonpickle --no-user

```


## Carpeta CDK
Aquí se almacena el código de la infraestructura.


```
# Para descargar las dependencias
npm install

# Para ver los recursos a desplegar
cdk diff

# Para desplegar los recursos
cdk deploy

```

# Uso

Para utilizar o probar los métodos de la API podemos utilizar los siquientes ejemplos:
```
# Para cargar nuevos usuarios
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/prod/user -H 'Content-Type: application/json'  -d '{ "name": "Alexa", "email": "abc@gmail.com", "edad": "15", "prod_favorito": "helados", "interaccion": "7"}'

# Para obtener un usuario por id
curl -X GET https://<api-id>.execute-api.<region>.amazonaws.com/prod/user/<id>

# Para actualizar un usuario por id
curl -X POST https://<api-id>.execute-api.<region>.amazonaws.com/prod/user/<id> -H 'Content-Type: application/json' -d '{ "name": "Pepe", "email": "abc@gmail.com", "edad": "15", "prod_favorito": "helados", "interaccion": "1"}'

# Para eliminar un usuario por id
curl -X DELETE https://<api-id>.execute-api.<region>.amazonaws.com/prod/user/<id>

```

También existe un archivo para testear los métodos creados:
```
python .\testing\api-tests.py https://<api-id>.execute-api.<region>.amazonaws.com/prod/api/
python .\testing\api-tests.py https://<distribution-id>.cloudfront.net/api/ 
```

