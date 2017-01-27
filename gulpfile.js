const gulp = require('gulp');
const shell = require('gulp-shell');

gulp.task('client:build:watch', shell.task([ 'ng build -w' ]));

gulp.task(
  'server:reload:watch',
  shell.task([
    'NODE_ENV=development nodemon --watch ./server ./server/bin/www'
  ])
);

gulp.task('default', [ 'server:reload:watch', 'client:build:watch' ]);
