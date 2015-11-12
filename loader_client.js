"use strict"

// create an url for a blob object
const urlCreator = window.URL || window.webkitURL;

const handleComplete = function(event){
  const self = this;
  Meteor.setTimeout(function(){
    self.status.set('complete', true);
  }, self.options.waitAfterComplete || 0);
};

const handleError = function(event){
  this.status.set('error', {
    error: event.title,
    reason: event.message,
    details: event.data
  });
};

const handleProgress = function(event){
  this.status.set('progress', event.progress);
  this.status.set('total', event.total);
  this.status.set('loaded', event.loaded);
};

const handleFileload = function(){
   // TODO handle individual file loading
};

const handleFileprogress = function(){
  // TODO handle individual file loading
};

class Handle {
  constructor(loader){
    this.loader = loader
  }
  ready(){
    return this.loader.isReady();  
  }
};

Loader = class {

  constructor(options){

    this.options = options || {};
    
    this.uid = Random.id();
    this.queue = new createjs.LoadQueue();
    this.status = new ReactiveDict('_loader_status_'+this.uid);

    this.queue.on('complete', handleComplete, this);
    this.queue.on('error', handleError, this);
    this.queue.on('progress', handleProgress, this);
    this.queue.on('fileload', handleFileload, this);
    this.queue.on('fileprogress', handleFileprogress, this);

  }

  addFiles(files){
    const loadNow = false;
    let fileCount = files.length;
    if (fileCount === 1){
      this.queue.loadFile(files[0], loadNow);
    } else {
      this.queue.loadManifest(files, loadNow);
    }
  }

  status(){
   return this.status.all(); 
  }

  isReady(){
    return !!this.status.get('complete');
  }

  isFailed(){
    return !!this.status.get('error');
  }

  load(){
    this.queue.load();
    return new Handle(this);
  }

  url(fileId){
    const rawResult = true;
    const blob = this.queue.getResult(fileId, rawResult);
    return urlCreator.createObjectURL(blob);
  }
};

