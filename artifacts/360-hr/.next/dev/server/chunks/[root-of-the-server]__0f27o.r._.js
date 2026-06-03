module.exports = [
"[externals]/next/dist/build/adapter/setup-node-env.external.js [external] (next/dist/build/adapter/setup-node-env.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/build/adapter/setup-node-env.external.js", () => require("next/dist/build/adapter/setup-node-env.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/tags-manifest.external.js [external] (next/dist/server/lib/incremental-cache/tags-manifest.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/tags-manifest.external.js", () => require("next/dist/server/lib/incremental-cache/tags-manifest.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/memory-cache.external.js [external] (next/dist/server/lib/incremental-cache/memory-cache.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/memory-cache.external.js", () => require("next/dist/server/lib/incremental-cache/memory-cache.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/lib/incremental-cache/shared-cache-controls.external.js [external] (next/dist/server/lib/incremental-cache/shared-cache-controls.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js", () => require("next/dist/server/lib/incremental-cache/shared-cache-controls.external.js"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/artifacts/360-hr/src/config/routes.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/** Central route map — use these constants instead of hardcoded paths */ __turbopack_context__.s([
    "publicPaths",
    ()=>publicPaths,
    "routes",
    ()=>routes
]);
const routes = {
    home: "/",
    splash: "/splash",
    designSystem: "/design-system",
    auth: {
        login: "/login",
        loginPassword: "/login/password",
        register: "/register",
        forgotPassword: "/forgot-password",
        forgotPasswordSent: "/forgot-password/sent",
        resetPassword: "/reset-password",
        verifyOtp: "/verify-otp",
        accountLocked: "/account-locked",
        signingIn: "/signing-in",
        welcome: "/welcome"
    },
    app: {
        dashboard: "/dashboard"
    },
    hris: {
        root: "/hris",
        employees: "/hris/employees_directory",
        organization_structure: "/hris/organization_structure",
        reports: "/hris/reports"
    }
};
const publicPaths = [
    routes.home,
    routes.splash,
    routes.designSystem,
    routes.auth.login,
    routes.auth.loginPassword,
    routes.auth.register,
    routes.auth.forgotPassword,
    routes.auth.resetPassword,
    routes.auth.verifyOtp,
    routes.auth.accountLocked,
    routes.auth.signingIn,
    routes.auth.welcome
];
}),
"[project]/artifacts/360-hr/src/proxy.ts [middleware] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "proxy",
    ()=>proxy
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/next@16.2.6_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/server.js [middleware] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/artifacts/360-hr/src/config/routes.ts [middleware] (ecmascript)");
;
;
const AUTH_COOKIE = "auth_token";
// Paths where an authenticated user should skip auth pages (splash/login/register)
const authEntryPaths = [
    __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].home,
    __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].splash,
    __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].auth.login,
    __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].auth.loginPassword,
    __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].auth.register
];
function isPublicPath(pathname) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["publicPaths"].some((path)=>{
        if (path === __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].home) return pathname === __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].home;
        return pathname === path || pathname.startsWith(`${path}/`);
    });
}
function isAuthEntryPath(pathname) {
    return authEntryPaths.some((path)=>pathname === path || path !== __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].home && pathname.startsWith(`${path}/`));
}
function proxy(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE)?.value;
    const isAuthenticated = Boolean(token);
    // Root: send authenticated users to the dashboard, everyone else to splash
    if (pathname === __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].home) {
        const target = isAuthenticated ? __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].app.dashboard : __TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].splash;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(target, request.url));
    }
    // Public paths: allow through, but redirect already-authenticated users
    // away from login/register entry points
    if (isPublicPath(pathname)) {
        if (isAuthenticated && isAuthEntryPath(pathname)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].app.dashboard, request.url));
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Everything else is a protected route — require a valid token
    if (!isAuthenticated) {
        const loginUrl = new URL(__TURBOPACK__imported__module__$5b$project$5d2f$artifacts$2f$360$2d$hr$2f$src$2f$config$2f$routes$2e$ts__$5b$middleware$5d$__$28$ecmascript$29$__["routes"].auth.login, request.url);
        loginUrl.searchParams.set("from", pathname);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].redirect(loginUrl);
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$next$40$16$2e$2$2e$6_react$2d$dom$40$19$2e$2$2e$4_react$40$19$2e$2$2e$4_$5f$react$40$19$2e$2$2e$4$2f$node_modules$2f$next$2f$server$2e$js__$5b$middleware$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"
    ]
};
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0f27o.r._.js.map