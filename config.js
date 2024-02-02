module.exports = {
    "ui": {
        "port": 3001,
        "weinre": {
            "port": 8080
        }
    },
    "files": "src",
    server: {
        baseDir: "src",
        routes: {
            "/cb/": "src/cb.html"
        }
    },
    "watchEvents": [
        "change"
    ],
    reloadOnRestart: true,
    "port": 3000
};