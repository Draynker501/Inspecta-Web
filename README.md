# Inspecta Web

Frontend web/PWA de Inspecta construido con React, TypeScript, Vite y Material UI.

## Requisitos

- Node.js y npm.
- API de Inspecta accesible desde el navegador.

## Configuración

1. Copia `.env.example` como `.env.local`.
2. Configura `VITE_API_BASE_URL`. Para desarrollo local, el documento de accesos indica `http://localhost:8000/api`. La URL de producción del contrato (`https://api.inspecta.com/v1`) no coincide con el prefijo `/api` que registra Laravel; confirma la URL real de despliegue antes de usar producción.
3. Instala dependencias y ejecuta:

```bash
npm install
npm run dev
```

Para compilar:

```bash
npm run build
```

## Autenticación integrada

La autenticación usa tokens personales de Laravel Sanctum (token opaco; no JWT):

- `POST /auth/login` envía `{ "email": "...", "password": "..." }`.
- La respuesta de login esperada es `{ "data": { "user": ..., "token": "..." } }`.
- El token se envía en `Authorization: Bearer <token>`.
- `GET /auth/me` permite consultar la identidad autenticada.
- `POST /auth/logout` revoca el token de la petición y el frontend limpia la sesión local.

El frontend almacena el token en `localStorage` bajo `inspecta_token` y el usuario bajo `inspecta_user`. Esto facilita la persistencia de la sesión en el navegador, pero no sustituye la autorización del backend.

## Estado de integración según `ACCESOS_Y_PERMISOS (1).md` (28-10-2026)

El documento actualizado describe un contrato OpenAPI 3.0.3 versión 1.3.0 con 88 operaciones en 48 rutas, pero indica que el backend actualmente registra únicamente estas tres rutas:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

Por tanto, los módulos de inspecciones, incidencias, checklists, normas, acciones correctivas, usuarios, reportes y demás dominios aún no pueden considerarse conectados a endpoints reales en ese backend. Algunas pantallas y servicios del frontend conservan datos de demostración o llamadas preparadas para endpoints documentados; las llamadas de dominio pueden devolver 404 mientras esas rutas no estén registradas.

Los roles documentados son Administrador, Supervisor e Inspector. El documento advierte que la matriz de permisos es en parte inferida y que los roles no están aplicados como restricciones HTTP en el backend actual. La protección de rutas del frontend solo es una barrera de navegación y nunca debe considerarse control de acceso de seguridad.

## Servicios

- `src/api/client.ts`: cliente HTTP, encabezado Bearer y tratamiento de errores.
- `src/services/auth.service.ts`: login, identidad actual y logout.
- `src/services/`: servicios de dominio que se conectarán conforme se implementen las rutas correspondientes en la API.

## Limitaciones conocidas

- No hay endpoint documentado de refresh de token ni recuperación de contraseña.
- La sesión local se basa en un token guardado en el navegador; valida la identidad con `/auth/me` cuando se integre el flujo de inicio de la aplicación.
- La URL de producción `/v1` y el prefijo Laravel `/api` deben reconciliarse en el despliegue.
- No afirmar que los permisos por rol están garantizados hasta que el backend los implemente y pruebe.
