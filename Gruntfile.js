module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    // add all sub-files together
    concat: {
    	options: {
    		separator: ';'
    	},
    	dist: {
    		src: ['src/sa/**/SA.js','src/sa/**/*.js'],
    		dest: 'dist/<%= pkg.name %>.js'
    	},
    	dist2: {
    		src: ['src/comp/**/*.js'],
    		dest: 'dist/<%= pkg.name %>.comp.js'
    	}    	
    },
    
    // make ugly (remove white space)
    uglify: {
    	options: {
    		banner: '/* Simpler Apps (SA) Framework v<%= pkg.version %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
    		mangle: true
    	},
    	dist: {
    		files: [
    		   {'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']},
    		   {'dist/<%= pkg.name %>.comp.min.js': ['<%= concat.dist2.dest %>']}
    		]
    	}
    },
    
    // copy files  
    copy: {
    	dev: {
    		files: [
    	      // includes files within path
    	      {expand: true, cwd:'dist', src: ['*.js'], dest: '../lib/sa', filter: 'isFile'},
    	      {expand: true, cwd:'css', src: ['*.css'], dest: '../lib/sa', filter: 'isFile'},
    	    ]
    	  }
    	}  
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('default', ['concat', 'uglify', 'copy']);

};
