# "RSS|READER" master branch

This is fully functional RSS feed reader with enhanced abilities, including:

- adding feeds with different rss formats (RSS and ATOM)
- grouping feeds by categories
- saving articles as favourites
- social media login and sharing
- and more

You can try it [here](http://rss-reader.azurewebsites.net/) (or visit http://rss-reader.azurewebsites.net/)

Application (server & client) deployed to [AZURE](https://azure.microsoft.com/ru-ru/) cloud server, database hosted on [Mlab](https://mlab.com/).

#### Basic application deployment on your machine
1. Install [NodeJs](https://nodejs.org/en/) (v4 or above)
2. Run next command via __cmd__ in project folder
```
$ npm start
```
3. Visit __localhost:8080__ in your browser

#### Development workflow

Our application has folowing structure

##### Folders sctructure
```
+---client                // front-end
|   +---assets
|   |   \---images
|   +---css
|   +---e2e
|   +---fonts
|   +---js
|   |   +---controllers
|   |   +---directives
|   |   +---services
|   |   \---tests
|   +---partials
|   |   +---auth
|   |   +---dashboard
|   |   +---list
|   |   +---modals
|   |   \---static
|   +---scss
|   |   \---modals
|   \---uploads
+---dist                   // optimized version of 'client' folder build with Gulp
|   +---assets
|   |   \---images
|   +---css
|   +---fonts
|   +---partials
|   |   +---auth
|   |   +---dashboard
|   |   +---list
|   |   +---modals
|   |   \---static
|   +---scripts
|   \---uploads
+---docs
|   \---assets
\---server                 // back-end
    +---assets
    |   \---images
    +---config
    +---controllers
    +---models
    \---routes
```

As you might noticed, server and client are separated into folders correspondingly.
We have __./client__ folder for front-end development. However, server exposes client from folder called __./dist__. This folder contains all used libraries, Angular scripts, styles and others in optimized (minificated) form.

##### Building our front-end with GULP
To generate optimized form of front-end part of our app we are using __Gulp__ task runner.
Gulp tasks can be found in the following table:

| Tasks        | Porpose           | Useage  |
| ------------- |:-------------:| -----:|
| sass| compile sass styles | gulp sass |
| scripts      | concats and minifies all scripts in ./client/js |   gulp scripts |
| main | watch for changes in *.sass and *.js files and performs above tasks|    gulp main |
| build | concats all libraries from __bower_components__ and js files into one minified file, same for styles, optimizes our __index.html__ | gulp build |
| server | runs server | gulp server |


