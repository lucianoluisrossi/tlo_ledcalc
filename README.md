# TLO LED Calculator

Herramienta de cálculo técnico para instalaciones de pantallas LED en eventos. Desarrollada para **TLO Visual**, permite a técnicos y planificadores calcular en tiempo real las especificaciones eléctricas, estructurales y visuales de cualquier configuración de pantalla LED.

---

## Funcionalidades

### Entrada de datos
- **Modelos de gabinete predefinidos**: Pitch 1.9mm, Gloshine 2.6 / 2.9 / 3.9mm, Dicolor 1.9 / 2.6mm
- **Entrada manual**: dimensiones de tile, peso, consumo y especificaciones de píxel
- **Dimensiones de pantalla**: ancho y alto en incrementos de 0.5m
- **Configuración eléctrica**: tensión (230V / 400V), fases (mono / tri), amperaje (16A / 20A / 32A / 63A)
- **Toggle de bumpers**: incluir o excluir contrapesos en el cálculo

### Pestañas de resultados

| Pestaña | Contenido |
|---|---|
| **General** | Dimensiones reales, resolución, megapíxeles, peso total, ratio y distancia de visualización |
| **Eléctrico** | Consumo máximo y medio, circuitos necesarios (con factor de seguridad del 80%) |
| **Estructura** | Contrapesos, listado de materiales (planchas, truss, tubos, abrazaderas, mariposas) |
| **Preview** | Renderizado canvas del layout de tiles con anotaciones de dimensiones |
| **Test Pattern** | Generador de patrones de test a resolución real (hasta 16K), descargable en PNG |

### Características adicionales
- Aviso de seguridad cuando la pantalla supera los 4.5m de altura
- Generación de informe técnico imprimible
- Botón de contacto directo por WhatsApp con el equipo de ventas
- Soporte offline completo mediante Service Worker (PWA)
- Notificación automática de actualizaciones
- Banner de instalación nativa en dispositivos móviles

---

## Tecnologías

- **HTML5 / CSS3 / JavaScript** — sin frameworks, arquitectura de un único archivo
- **Canvas API** — visualización del layout y generación de patrones de test
- **Service Workers** — caché offline con estrategia network-first para `index.html` y cache-first para recursos estáticos
- **PWA** — `manifest.json`, iconos y soporte de instalación nativa
- **Google Fonts** — DM Sans (variable 300–700) y DM Mono
- **localStorage** — persistencia del estado del banner de instalación

---

## Estructura del proyecto

```
tlo_ledcalc/
├── index.html       # Aplicación completa (HTML + CSS + JS embebidos)
├── manifest.json    # Metadata PWA
├── sw.js            # Service Worker (caché y actualizaciones)
├── tlo-logo.png     # Logo principal
├── tlo-logo-2.png   # Variante del logo
├── icon-192.png     # Icono PWA 192×192
└── icon-512.png     # Icono PWA 512×512
```

La app sigue una arquitectura de **archivo único**: todo el CSS y JavaScript está embebido en `index.html` para simplificar el despliegue y optimizar el caché del Service Worker.

---

## Modelos de gabinete incluidos

| ID | Modelo | Tile (m) | Peso (kg) | Potencia máx. | Potencia media |
|---|---|---|---|---|---|
| `pitch19` | Pitch 1.9mm | 0.5 × 0.5 | 8.3 kg | 165 W | 82 W |
| `gloshine26` | Gloshine 2.6mm | 0.5 × 0.5 | — | — | — |
| `gloshine29` | Gloshine 2.9mm | 0.5 × 0.5 | — | — | — |
| `gloshine39` | Gloshine 3.9mm | 0.5 × 0.5 | — | — | — |
| `dicolor19` | Dicolor 1.9mm | 0.5 × 0.5 | — | — | — |
| `dicolor26` | Dicolor 2.6mm | 0.5 × 0.5 | — | — | — |

---

## Lógica de cálculo

### Eléctrico
- Circuitos necesarios = `consumo_total / (tensión × amperaje × 0.8)`
- El factor **0.8** aplica la regla del 80% de carga máxima por circuito
- Se calculan por separado los circuitos para consumo **máximo** y **medio**

### Estructura
- Contrapeso total en función del peso de tiles × ratio de seguridad configurado
- Listado de materiales proporcional al número de tiles y dimensiones

### Test Pattern
- Resolución real basada en píxeles totales de la pantalla
- Escalado automático para resoluciones superiores a 16.384px
- Opciones: grid de tiles, círculos, numeración de tiles, color configurable

---

## Despliegue

La app no tiene dependencias de build. Basta con servir los archivos desde cualquier servidor HTTP estático:

```bash
# Ejemplo con servidor local de Python
python -m http.server 8080

# O con Node.js (npx)
npx serve .
```

El Service Worker requiere que la app se sirva sobre **HTTPS** (o `localhost`) para activarse.

---

## Idioma

La interfaz está íntegramente en **español** (`lang="es"`), con formato numérico español (`es-ES`).

---

## Contacto

Proyecto desarrollado por y para **TLO Visual**.
Para soporte o consultas comerciales, usar el botón de WhatsApp integrado en la aplicación.
