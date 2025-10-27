const os = require('os');
const fs = require('fs');

// Cargar configuración
let config;
try {
    config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
} catch (error) {
    console.error('Error cargando config.json, usando configuración por defecto');
    config = {
        intervalo_segundos: 5,
        mostrar_cpu: true,
        mostrar_memoria: true,
        mostrar_uptime_sistema: true,
        mostrar_uptime_node: true
    };
}

// Información inicial al iniciar
console.log('=== INFORMACIÓN DEL SISTEMA AL INICIAR ===');
console.log(`Sistema operativo: ${os.platform()} ${os.release()}`);
console.log(`Arquitectura: ${os.arch()}`);
console.log(`Versión de Node.js: ${process.version}`);
console.log(`CPUs disponibles: ${os.cpus().length}`);
console.log(`Memoria total: ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`);
console.log('===========================================\n');

// Tiempo de inicio de Node.js
const startTime = Date.now();

// Función para obtener información del sistema
function obtenerInfoSistema() {
    const info = [];
    
    if (config.mostrar_cpu) {
        const cpus = os.cpus();
        let totalIdle = 0, totalTick = 0;
        
        cpus.forEach(cpu => {
            for (let type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        });
        
        const idle = totalIdle / cpus.length;
        const total = totalTick / cpus.length;
        const usage = 100 - (100 * idle / total);
        
        info.push(`Uso de CPU: ${usage.toFixed(2)}%`);
    }
    
    if (config.mostrar_memoria) {
        const memLibre = os.freemem();
        const memTotal = os.totalmem();
        const memUsada = memTotal - memLibre;
        const porcentaje = (memUsada / memTotal) * 100;
        
        info.push(`Uso de memoria: ${(memUsada / 1024 / 1024 / 1024).toFixed(2)}GB/${(memTotal / 1024 / 1024 / 1024).toFixed(2)}GB (${porcentaje.toFixed(2)}%)`);
    }
    
    if (config.mostrar_uptime_sistema) {
        const uptime = os.uptime();
        const horas = Math.floor(uptime / 3600);
        const minutos = Math.floor((uptime % 3600) / 60);
        const segundos = Math.floor(uptime % 60);
        info.push(`Tiempo sistema activo: ${horas}h ${minutos}m ${segundos}s`);
    }
    
    if (config.mostrar_uptime_node) {
        const nodeUptime = (Date.now() - startTime) / 1000;
        const horas = Math.floor(nodeUptime / 3600);
        const minutos = Math.floor((nodeUptime % 3600) / 60);
        const segundos = Math.floor(nodeUptime % 60);
        info.push(`Tiempo Node.js ejecutándose: ${horas}h ${minutos}m ${segundos}s`);
    }
    
    return info;
}

// Función para mostrar información periódicamente
function mostrarInfoPeriodica() {
    const info = obtenerInfoSistema();
    const ahora = new Date().toLocaleTimeString();
    
    console.log(`[${ahora}] Información del sistema:`);
    info.forEach(linea => console.log(`  - ${linea}`));
    console.log('---');
}

// Mostrar información inicial
mostrarInfoPeriodica();

// Configurar intervalo
const intervalo = config.intervalo_segundos * 1000;
console.log(`Mostrando información cada ${config.intervalo_segundos} segundos...\n`);

setInterval(mostrarInfoPeriodica, intervalo);

// Manejar cierre elegante
process.on('SIGINT', () => {
    console.log('\n\nServidor detenido. Resumen final:');
    mostrarInfoPeriodica();
    process.exit(0);
});
