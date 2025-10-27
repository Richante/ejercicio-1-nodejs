# Ejercicio 1 - Servidor Node.js de Monitoreo del Sistema

## Descripción
Servidor Node.js que muestra información del sistema de forma periódica según configuración.

## Características
- Muestra información del sistema al iniciar
- Monitoreo periódico configurable de:
  - Uso de CPU
  - Uso de memoria
  - Tiempo activo del sistema
  - Tiempo de ejecución de Node.js

## Configuración
Editar el archivo `config.json`:
```json
{
  "intervalo_segundos": 5,
  "mostrar_cpu": true,
  "mostrar_memoria": true,
  "mostrar_uptime_sistema": true,
  "mostrar_uptime_node": true
}
