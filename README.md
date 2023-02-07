# Porfolio BackEnd

BackEnd para la aplicación del <a href="https://gitlab.com/gonzam4/portafolio" target="_blank">porfolio</a>

## Tecnologías usadas

- Laravel 9
- laravel/passport 10
- nuwave/lighthouse 5

## Ejecución

### Requisitos

- PHP 8 o superior.
- Composer.
- MySQL.

### Instalación de dependencias

- Ejecutar

```bash
composer i
```

### Despliegue

#### Local

- Archivo de configuración

```bash
mv .env.example .env
```

- Configurar las siguientes líneas en el archivo de configuración `.env`

  - Configuración de la base de datos

  ```php
  DB_PORT
  DB_DATABASE
  DB_USERNAME
  DB_PASSWORD
  ```

  - Configuración del cliente de correo electrónico

  ```php
  MAIL_MAILER
  MAIL_HOST
  MAIL_PORT
  MAIL_USERNAME
  MAIL_PASSWORD
  MAIL_ENCRYPTION
  ```

- Generar llave de encriptación

```bash
php artisan key:generate
```

- Ejecutar migraciones

```bash
php artisan migrate
```

- Ejecutar servidor

```bash
php artisan serve
```

## Resolución de problemas

Para cualquier problema relacionado, siéntete libre de contactarme por alguno de los medio listados en <a href="https://dowar.xyz/presentation" target="_blank">dowar.xyz</a>

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
