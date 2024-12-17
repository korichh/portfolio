const gulp = require("gulp")
const gulpTs = require("gulp-typescript")
const sass = require("gulp-sass")(require("sass"))
const del = require("del")
const spawn = require("child_process").spawn
const gulpIf = require("gulp-if")
const uglify = require("gulp-uglify")

const tsServer = {
    path: {
        src: "server/src/**/*",
        dist: "server/dist",
        watch: "server/src/**/*"
    },
    project: gulpTs.createProject("server/src/tsconfig.json"),
    clean: () => del(`${tsServer.path.dist}/*`),
    build: () => tsServer.project.src().pipe(tsServer.project().on("error", console.error)).pipe(gulpIf(project.uglify, uglify())).pipe(gulp.dest(tsServer.path.dist)),
    watch: (done) => { gulp.watch(tsServer.path.watch, gulp.series(tsServer.clean, tsServer.build, project.start)); done() },
}

const tsClient = {
    path: {
        src: "client/src/ts/**/*",
        dist: "client/public/js",
        watch: "client/src/ts/**/*"
    },
    project: gulpTs.createProject("client/src/tsconfig.json"),
    clean: () => del(`${tsClient.path.dist}/*`),
    build: () => tsClient.project.src().pipe(tsClient.project().on("error", console.error)).pipe(gulpIf(project.uglify, uglify())).pipe(gulp.dest(tsClient.path.dist)),
    watch: (done) => { gulp.watch(tsClient.path.watch, gulp.series(tsClient.clean, tsClient.build, project.start)); done() },
}

const tsClientAdmin = {
    path: {
        src: "client/admin/src/ts/**/*",
        dist: "client/admin/public/js",
        watch: "client/admin/src/ts/**/*"
    },
    project: gulpTs.createProject("client/admin/src/tsconfig.json"),
    clean: () => del(`${tsClientAdmin.path.dist}/*`),
    build: () => tsClientAdmin.project.src().pipe(tsClientAdmin.project().on("error", console.error)).pipe(gulpIf(project.uglify, uglify())).pipe(gulp.dest(tsClientAdmin.path.dist)),
    watch: (done) => { gulp.watch(tsClientAdmin.path.watch, gulp.series(tsClientAdmin.clean, tsClientAdmin.build, project.start)); done() },
}

const scss = {
    path: {
        src: "client/src/scss/**/*",
        dist: "client/public/css",
        watch: "client/src/scss/**/*"
    },
    clean: () => del(`${scss.path.dist}/*`),
    build: () => gulp.src(scss.path.src).pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError)).pipe(gulp.dest(scss.path.dist)),
    watch: (done) => { gulp.watch(scss.path.watch, gulp.series(scss.clean, scss.build, project.start)); done() },
}

const scssAdmin = {
    path: {
        src: "client/admin/src/scss/**/*",
        dist: "client/admin/public/css",
        watch: "client/admin/src/scss/**/*"
    },
    clean: () => del(`${scssAdmin.path.dist}/*`),
    build: () => gulp.src(scssAdmin.path.src).pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError)).pipe(gulp.dest(scssAdmin.path.dist)),
    watch: (done) => { gulp.watch(scssAdmin.path.watch, gulp.series(scssAdmin.clean, scssAdmin.build, project.start)); done() },
}

const staticFiles = {
    path: {
        watch: ["server/**/*", "client/**/*", `!${tsServer.path.src}`, `!${tsServer.path.dist}`, `!${tsClient.path.src}`, `!${tsClient.path.dist}`, `!${tsClientAdmin.path.src}`, `!${tsClientAdmin.path.dist}`, `!${scss.path.src}`, `!${scss.path.dist}`, `!${scssAdmin.path.src}`, `!${scssAdmin.path.dist}`]
    },
    watch: (done) => { gulp.watch(staticFiles.path.watch, project.start); done() },
}

const project = {
    path: {
        main: "server/dist/app.js",
    },
    server: null,
    uglify: false,
    clean: gulp.parallel(tsServer.clean, tsClient.clean, tsClientAdmin.clean, scss.clean, scssAdmin.clean),
    build: gulp.parallel(tsServer.build, tsClient.build, tsClientAdmin.build, scss.build, scssAdmin.build),
    watch: gulp.parallel(tsServer.watch, tsClient.watch, tsClientAdmin.watch, scss.watch, scssAdmin.watch, staticFiles.watch),
    start: (done) => { if (project.server) project.server.kill(); project.server = spawn("node", [project.path.main], { stdio: "inherit" }); done() },
    prod: (done) => { project.uglify = true; done() },
}

gulp.task("clean", project.clean)
gulp.task("build", project.build)
gulp.task("watch", project.watch)
gulp.task("compile", gulp.series(project.clean, project.build))
gulp.task("prod", gulp.series(project.prod, project.clean, project.build))
gulp.task("dev", gulp.series(project.clean, project.build, project.watch, project.start))