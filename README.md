# Portafolio web

Sitio web aplicación móvil(Android), PWA diseñado para desarrolladores, el cual les permite mostrar sus conocimientos y proyectos realizados además de un editor para publicar contenido en un blog.

## Demo

<a href="https://dowar.xyz" target="_blank">Aplicación en producción</a>

## Tecnologías usadas

- Ionic Framework 6
- Vuejs 3
- Capacitorjs 4
- Vue Apollo 4
- Vue3-markdown-it 1
- Vite 4

## Ejecución

### Requisitos

- Node.js LTS
- Gestor de dependencias PNPM
- Configurado e instalado el proyecto del <a href='https://gitlab.com/gonzam4/portfolio-backend' target='_blank'>BackEnd</a>.

### Instalación de dependencias

- Acceder con nuestra terminal de comandos a la ubicación del proyecto y ejecutar.

```bash
pnpm i
```

### Despliegue

#### Local

- Ejecutar.

```bash
pnpm dev
```

#### Producción

- Ejecutar.

```bash
pnpm build
```

- Copiar contenido del directorio `dist` en tu hosting.

Recomendado leer el siguiente <a href='https://dowar.xyz/blog/post/31' target='_blank'>post</a>.

### Generación de la apk/bundle

Puedes generar dos tipos de apk/bundle la versión de producción(prod) o la de testeo(testing).

#### Testing

- Acceder a la carpeta `Android` y ejecutamos.

```bash
./gradlew assembleDebug
```

- Podremos encontrar la aplicación en `app/build/outputs/apk/debug/`.

#### Prod

- Ejecutamos

```bash
pnpm exex cap open android
```

## Resolucion de problemas

Para cualquier problema relacionado, siéntete libre de contactarme por alguno de los medio listados en <a href="https://dowar.xyz/presentation" target="_blank">dowar.xyz</a>

## Recursos

### Iconos

<!-- - Telegram: <a href="https://icons8.com/icon/F4ZPUh2Mk5tk/telegram-app" target="_blank">icon8</a> -->

- <a href="https://ionic.io/ionicons" target="_blank">Ionic icons</a>

## Información adicional

- Tablero de novedades <a href="https://board.disroot.org/project/portafolio/kanban" target="_blank">Kanban</a>.

- Si te gusta el proyecto puedes contribuir de las siguientes formas

  - Contribuyendo a la corrección de errores.
  - Reporte de errores
    - Crear un issue en este mismo repositorio.
    - Contactarme a través de los medios listados en <a href="https://dowar.xyz/presentation" target="_blank">dowar.xyz</a>.
  - Realizando una donación <a href="https://liberapay.com/dowar/donate" target="_blank"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"/></a>

Este es un proyecto de software libre, por lo que podrás utilizar de manera total o parcial el código contenido en él, siempre y cuando se mantenga dentro de las normas establecidas en la licencia con la cual está siendo desarrollado.

## Licencia

Este proyecto está desarrollado bajo la licencia GPL 3.
