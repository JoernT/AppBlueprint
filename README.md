# eXistdb App Blueprint

App Blueprint serves as a template for building [EXPath Application Packages](http://exist-db.org/exist/apps/doc/repo.xml) (".xar" applications) for eXistdb with modern web tooling.

Originally developed as a style guide for various eXist websites, App Blueprint has been generalized and uses a set of common features and libraries:

* Bootstrap 3 (responsive layout + common styling)
* JQuery (JS)
* font-awesome (icon set)
* animate.css (CSS animations)
* snap.svg (SVG support)

App Blueprint replaces the old common approach for building .xar files for eXistdb, which used Apache Ant.

See command reference below.

## Why App Blueprint?

Building state-of-the-art html pages requires the use of many tools today to offer an optimal experience for the user. Unfortunately this comes with a lot of new responsibilities for the web developer to make sure that the CSS, JavaScript, and whatever technologies work across the widest range of devices.

Typically to address all these needs it is necessary to work with CSS and Javascript libraries that ensure a base level of quality in terms of cross-browser and device-compatibility.

Modern web tooling like [Node.js](http://nodejs.org/), [Grunt](http://gruntjs.com/), and [Bower](http://bower.io/) help to address these requirements. App Blueprint provides a grunt-based approach to developing .xar applications that helps to automate a lot of the common tasks.

Instead of setting up your environment over and over again for each project, App Blueprint offers a complete, feature-rich template to copy and modify to your needs.

Features:

* Removal of unused CSS
* CSS minification (single file output)
* JS concatenation and minification (single file output)
* Image optimization for png images (see remarks further down)
* Dependency management for the components of your site/app
* Creation of optimized and non-optimized .xar files

## Preparation

Download AppBlueprint by hitting the 'Download Zip' button on this page, and save it to a directory on your disk. Unpack it and start working.

## Installation

For developing with App Blueprint you need [Node.js](http://nodejs.org/). Please refer to their homepage for OS-specific installers. 

Once Node.js is installed, you will also need [Grunt](http://gruntjs.com/) and [Bower](http://bower.io/). 

To install Grunt:

    npm install -g grunt-cli
    
Sometimes administrator rights are needed for a correct install, in which case, use:

    sudo npm install -g grunt-cli

To install Bower:

    (sudo) npm install -g bower

All commands have to be executed in the root of your project.

### 1. Initialize dependencies with NPM

NPM, or Node Package Manager, is installed by default with Node.js.  It will read the `package.json` file, download the listed dependencies into the `node_modules` folder, and set them up.

To initialize dependencies, run the following command in the root of your project's directory:

    (sudo) npm install

Watch your console for errors during `npm install` to ensure you get a working installation. Sometimes administrator rights are needed for a correct install, in which case, use `sudo`.

### 2. Initialize Bower

Bower manages the runtime dependencies that your project uses, e.g., bootstrap and jquery. It will read the `bower.json` file, download the components, and install them into the `components` folder in the root of your project.

Run: 

    bower install

NOTE: If for some reason your grunt tasks are not working as expected, it sometimes helps to completely re-install all of the libraries listed in the `package.json` file. For this, delete your `node_modules` directory and run `npm install` again.

### 3. Adapt the blueprint to your needs

To adapt AppBlueprint for your application, you'll need to edit the `package.json` file. You'll want to change at least the `name`, `version`, `description`, and `author` fields. The entries should be self-explanatory.

### 4. Build your .xar package with Grunt

Grunt reads the `gruntfile.js` file, which contains scripts for tasks including building the .xar file for your project. Typically you will run:

    grunt default

See the full list of Grunt tasks below.

### 5. Install your .xar package in eXist

Install your .xar file via the [Dashboard's Package Manager](http://exist-db.org/exist/apps/doc/dashboard.xml).

## Grunt command reference

Call these commands in the root directory of your project:

    grunt [task]

Task | Description
--- | ---
`default` | Creates a .xar file in directory `build` containing the full source of the components managed by bower
`dist` | Creates a fully-optimized version of the .xar application
`imagemin` | Optimizes images

If you are seeking detail information about the single targets please refer to the `gruntfile.js` file for inline documentation.

Note: Image optimization does NOT occur automatically during the creation of a .xar file. The main reason is that the process can be slow if you have more than a handful of images, which slows down the build process too much. Furthermore, in some cases the optimizer can corrupt images, so use with care. Also, it's not necessary to optimize images over and over again, so we suggest running the target once, copying the resulting images into an appropriate folder, and putting them under version control. 

## Important notes

### Optimizing JavaScript

You should review the `concat` task in `gruntfile.js` to make sure all of your JavaScript dependencies get concatenated. 

### animate.css

animate.css offers a large set of premade CSS animations. As you'll use only a small subset of these, you should adapt the file `components/animate.css/animate-config.json` and set unused animations to false, e.g.:

    "flip": false

animate.css uses its own mechanism for optimization which can be triggered by a watch task (still to do) or by adapting the grunt tasks from original animate.css. You should always run `grunt watch` in directory `components/animate.css` and modify and store the file `.animate-config.json` to trigger optimization manually.

### eXide synchronization

**Special caution** is needed when using eXide with synchronization on. You might break files that were already processed by grunt when working live with an optimized version. Advice: Don't use eXide's synchronization feature for AppBlueprint projects. 
### Attention with dynamically generated CSS classes

The grunt build tool uses `uncss`, a tool to discover and remove unused CSS classes from the resulting CSS. However this statically analyses one or more html pages. When JS routines dynamically add classes to the DOM at runtime these cannot be detected by `uncss`. Such classes can be held in a separate css file for instance.

Dynamic behavior should always be tested after optimization.

## Possible future enhancements

* adding test infrastructure to run JavaScript unit tests
* image optimization for gif and jpeg images 
* automatic re-deployment into database
* live editing feature
* integration into eXide
* 
