# Portafolio Web

Este proyecto consiste en una aplicación web y móvil (Android), así como una PWA, diseñada para desarrolladores. Permite mostrar conocimientos y proyectos realizados, además de ofrecer un editor para publicar contenido en un blog.

## Demo

Puede acceder a la aplicación en producción a través del siguiente enlace: [Aplicación en producción](https://dowar.xyz)

## Tecnologías Utilizadas

- Ionic Framework
- Vue.js
- Capacitor.js
- Vite
- Pinia

## Ejecución

### Requisitos

- Node.js LTS
- Gestor de dependencias NodeJS
- Proyecto del [BackEnd](https://gitlab.com/dowardev/portfolio-backend) configurado e instalado.

### Instalación de Dependencias

Para instalar las dependencias, acceda a la ubicación del proyecto mediante la terminal de comandos y ejecute:

```bash
pnpm i
```

### Configuración Previa

#### Creación de Archivos de Configuración

- .env
- .env.production

Estos archivos deben contener la URL de la API del backend a la que se conectará el sistema, por ejemplo: `VITE_API_URL=http://localhost:8100/api/`

### Despliegue

#### Local

Para ejecutar el proyecto localmente, ejecute:

```bash
ionic s
```

#### Producción

Para generar una versión de producción, ejecute:

```bash
ionic build --prod
```

Luego, copie el contenido del directorio `dist` en su hosting.

Se recomienda leer el siguiente [post](https://dowar.xyz/blog/post/31).

### Generación de la APK/Bundle

Puede generar dos tipos de APK/Bundle: la versión de producción (prod) o la de testeo (testing).

#### Testing

##### Apk de testeo

Para generar una apk de testeo, acceda a la carpeta `Android` y ejecute:

```bash
./gradlew assembleDebug
```

La aplicación se encontrará en `app/build/outputs/apk/debug/`.

##### Probar en dispositivo

Probar directamente en un dispositivo movil

```bash
ionic cap run android
```

#### Producción

Para generar una versión de producción, ejecute:

```bash
ionic cap open android
```

## Licencia

Este proyecto está desarrollado bajo la licencia GPL 3.
