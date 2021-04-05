module.exports = {
    importScripts: [],
    inlineWorkboxRuntime: true,
    mode: 'production',
    sourcemap: false,
    globDirectory: "./build",
    globPatterns: [
        "**/*.{css,html,js,gif,ico,jpg,png,svg,webp,woff,woff2,ttf,otf,eot,webmanifest,manifest}"
    ],
    swDest: "build/service-worker.js",
    clientsClaim: true,
    skipWaiting: true,
    runtimeCaching: []
};