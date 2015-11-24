Package.describe({
  summary:'load static assets (based on PreloadJS)',
  version:'0.0.1',
  name:'mstn:loader'
});

Package.onUse(function(api){ 
  api.versionsFrom('1.2'); 

  api.use('ecmascript', 'client');
  api.use('random', 'client');
  api.use('reactive-dict', 'client');

  api.addFiles([
    'bower_components/PreloadJS/lib/preloadjs-0.6.1.combined.js',
    'loader_client.js'
  ], 'client');

  api.export('Loader', 'client');
});
