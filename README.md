
## Tareas de un equipo de desarrollo

[![Node.js CI](https://github.com/uqbar-project/eg-tareas-node/actions/workflows/build.yml/badge.svg)](https://github.com/uqbar-project/eg-tareas-node/actions/workflows/build.yml)

En esta variante en Node agregamos servicios de paginación para lo cual, a la hora de pedir las tareas, agregamos como parámetro

- el número de la página
- y el límite de tareas por página

De esa manera, si pedimos la página 1 y el límite de 10, el servicio nos devolverá las primeras 10 tareas.
Si pedimos la página 2 y el límite de 10, el servicio nos devolverá las siguientes 10 tareas (de la 11 a la 20 si tenemos).

Además, el servicio nos devuelve el total de tareas para que podamos calcular el número de páginas.

También agregamos un middleware de manejo de errores para que podamos manejar los errores de manera centralizada, como en Springboot.

El autowire de Springboot se hace mediante una inyección de dependencias manual.

Utilizamos el servicio de faker para generar una buena cantidad de tareas.
