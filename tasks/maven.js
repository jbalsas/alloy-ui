'use strict';

var alloy = require('../.alloy');
var gulp = require('gulp');
var maven = require('gulp-maven-deploy');
var runSequence = require('run-sequence');

// Maven -----------------------------------------------------------------------

gulp.task('prepare-maven-snapshot', function() {
	return gulp.src(['**/*', '!node_modules/', '!node_modules/**', '!bower_components/', '!bower_components/**'])
		.pipe(gulp.dest('maven-dist/META-INF/resources/webjars/alloy-ui/' + alloy.version + '-SNAPSHOT'));
});

gulp.task('install-maven-snapshot', function() {
	return gulp.src('.')
		.pipe(maven.install({
			'config': {
				'artifactId': 'com.liferay.webjars.alloy-ui',
				'buildDir': 'maven-dist',
				'finalName': '{name}-{version}',
				'groupId': 'com.liferay.webjars',
				'type': 'jar'
			}
		}));
});

gulp.task('prepare-maven-artifact', function() {
	return gulp.src(['**/*', '!node_modules/', '!node_modules/**', '!bower_components/', '!bower_components/**'])
		.pipe(gulp.dest('maven-dist/META-INF/resources/webjars/alloy-ui/' + alloy.version));
});

gulp.task('publish-maven-artifact', function() {
	return gulp.src('.')
		.pipe(maven.deploy({
			'config': {
				'artifactId': 'com.liferay.webjars.alloy-ui',
				'buildDir': 'maven-dist',
				'finalName': '{name}-{version}',
				'groupId': 'com.liferay.webjars',
				'type': 'jar',
				'repositories': [
					{
						'id': 'liferay-nexus-ce',
						'url': 'https://repository.liferay.com/nexus/content/repositories/liferay-releases-ce/'
					}
				]
			}
		}));
});

gulp.task('maven-install', function(done) {
	runSequence('prepare-maven-snapshot', 'install-maven-snapshot', done);
});

gulp.task('maven-publish', function(done) {
	runSequence('prepare-maven-artifact', 'publish-maven-artifact', done);
});