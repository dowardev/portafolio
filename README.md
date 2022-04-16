# Porfolio Backend

Backend para la aplicación del [porfolio](https://gitlab.com/gonzam4/portafolio)

## Despliegue en local

- Tener instalado php, composer y Mysql
- Clonar proyecto.
  `https://gitlab.com/gonzam4/portafolio-backend.git`
- Acceder con nuestra terminal de comandos a la ubicación del proyecto y ejecutar.
  `composer install`
- Realizamos las migraciones
  `php artisan migrate`
- Iniciamos el servidor
  `php artisan serve`

### Nota

- Para facilitar un poco las cosas existen herramientas que ya te ofrecen la configuración e instalación de la mayoría de los requisitos anteriormente descritos, por ejemplo XAMPP que es el que se utilizó durante el desarrollo de este proyecto.
- Si tienes problemas para correr el proyecto dentro de tu sistema puedes contactarme a través de los medios listados en [dowar.xyz](https://dowar.xyz) y con mucho gusto te apoyaré para solucionar el problema.

## Tecnologías usadas

- Laravel 9
- laravel/passport 10
- nuwave/lighthouse 5

## Información adicional

Las nuevas características y errores encontrados están listados en el siguiente tablero [kanban](https://board.disroot.org/project/portafolio/kanban).

Si te gusta el proyecto puedes contribuir de las siguientes formas

- Contribuyendo a la corrección de errores.
- Reportar errores, para ello tienes 2 formas: creando un issue dentro de este mismo repositorio o contactarme a través de los medios listados en [dowar.xyz](https://dowar.xyz).

Este es un proyecto de software libre, por lo que podrás usar de manera total o parcial el código contenido en él, siempre y cuando se mantenga dentro de las normas establecidas en la licencia con la cual está siendo desarrollado.

## Licencia

Este proyecto está desarrollado bajo la licencia GPLv3.
