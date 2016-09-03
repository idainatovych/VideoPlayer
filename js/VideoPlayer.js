'use strict';

let VideoPlayer = function (options) {
  options = options || {};
  this.playlist = [];
  this.currentIndex = 0;
  this.isCircular = options.isCircular || false;
  this._video = document.createElement('video');
};

VideoPlayer.prototype.pause = function () {
  this._video.pause();
};

VideoPlayer.prototype.stop = function () {
  this._video.src = '';
  this._video.load();
};

VideoPlayer.prototype.play = function () {
  this._video.src = this.playlist[this.currentIndex];
  this._video.load();
  this._video.play();
};

VideoPlayer.prototype.replay = function () {
  this.stop();
  this.play();
};

VideoPlayer.prototype.playNextInPlaylist = function () {
  let nextIndex = this.currentIndex + 1;
  if (nextIndex < this.playlist.length || this.isCircular) {
    this.playItemFromPlaylist(nextIndex % this.playlist.length);
  }
};

VideoPlayer.prototype.playPrevInPlaylist = function () {
  let prevIndex = this.currentIndex - 1;
  if (prevIndex > 0) {
    this.playItemFromPlaylist(prevIndex % this.playlist.length);
  } else if (this.isCircular) {
    this.playItemFromPlaylist(this.playlist[this.playlist.length - 1]);
  }
};

VideoPlayer.prototype.clearPlaylist = function () {
  this.playlist = [];
  this.currentIndex = 0;
};

VideoPlayer.prototype.addVideoToPlaylist = function (src) {
  if (!this.isInPlaylist(src)) {
    this.playlist.push(src);
  }
};

VideoPlayer.prototype.isInPlaylist = function (src) {
  return this.playlist.some((el) => el === src);
};

VideoPlayer.prototype.removeVideoFromPlaylist = function (src) {
  if (this.isPlaying(src)) {
    this.playNextInPlaylist();
  }

  this.playlist = this.playlist.filter((el) => el !== src);
};

VideoPlayer.prototype.isPlaying = function (src) {
  return this._video.src === src;
};

VideoPlayer.prototype.playItemFromPlaylist = function (number) {
  let itemSrc = this.playlist[number];
  if (itemSrc) {
    this._video.src = itemSrc;
    this.play();
  }
};

VideoPlayer.prototype.increaseVolume = function (amount) {
  amount = amount || 0.1;
  let volume = this._video.volume;

  volume += (volume + amount) < 1 ? amount : 0;
  this._video.volume = volume;
};

VideoPlayer.prototype.decreaseVolume = function (amount) {
  amount = amount || 0.1;
  let volume = this._video.volume;

  volume -= (volume - amount) > 0 ? amount : 0;
  this._video.volume = volume;
};

VideoPlayer.prototype.getVideo = function () {
  return this._video;
};
