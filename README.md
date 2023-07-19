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
