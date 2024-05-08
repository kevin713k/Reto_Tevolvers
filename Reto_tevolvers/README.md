## Solución del reto tecnico T-Evolvers de Frontend

Automatizar las pruebas de la siguiente aplicación web: https:/demos.devexpress.com/rwa/dxhotels/

# Condiciones: 
Usar Playwright para llevar a cabo las pruebas automatizadas de esta aplicación. Subir a repo en github con su respecto ReadMe explicando todo lo necesario.

# Escenarios:
* **A**. 
    Login exitoso y login fallido (especificar en el ReadMe como se abordó y los defectos encontrados)
* **B**. 
    Reservación de un hotel:

    + Fecha de check-in: 2 días a partir de la fecha actual.
    + Fecha de check-out: 7 días a partir de la fecha actual.
    + Número de habitaciones: 2.
    + Número de adultos: 3.
    + Número de niños: 2.
    + Rango de precio: superior a $200 USD.
    + Número de estrellas: 3 o más.
    + Aplicar los filtros seleccionados.
    + Seleccionar el hotel más económico que cumpla con los filtros establecidos.
    + Validar mensaje de reservación exitosa.

## Solución punto A. Login exitoso y login fallido
Al hacer el proceso de identificación de la web se evidencia que el apartado de login tiene un captcha como metodo de validación, el proceso para automatizar este tipo de validaciones es complejo e inestable, ya que se emplean metodos de reconocimiento de patrones que no son completamente eficientes, también se pueden emplear programas de pago (no aplicable para este caso). 

Por los motivos expuestos anteriormente se opto por realizar la prueba del modulo de login de forma manual, generando una carpeta con la evidencia obtenida en la carpeta raíz de este proyecto.

### Login
[Pruebas manuales Login](/evidencia_login/ManualTest.md)

## Solución punto B. Reservación de un hotel:
Este proyecto se automatizo empleando Playwright con typescrip, para compilar el proyecto se requiere tener instalado:
+ Node.js (version empleada para las pruebas 21.5.0)
+ Visual Studio Code
+ Extensiones: Playwright Test for VSCode (opcional)

Códigos para compilar el proyecto:
+ npm install
+ npx playwright install
+ npx playwright test
+ npx playwright show-report
+ npx playwright test --headed --debug (para visualizar)

## Conclusiones:
Se logro realizar la automatización de la web presentada, en el proceso se encontraron algunos fallos en el funcionamiento de la web, especificamente:

+ Filtro rango de precio
+ Filtro número de estrellas

Para el caso de la automatización se agrego una condición a nivel de código en pro de continuar el proceso propuesto en el reto, la condición filtra los precios inferiores a $200.00 que se puedan presentar debido a la falla del filtro.