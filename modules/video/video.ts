/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');
import { GifWorker } from '../workers/gif';
import { FfmpegWorkerFile } from '../workers/ffmpeg';


export class Video {
	
	private sourceURL : string;
	element : HTMLVideoElement;
	
	constructor(video : HTMLVideoElement | string) {
		if (video instanceof HTMLVideoElement) {
			this.element = video;
			this.sourceURL = video.getAttribute('src');
		} else if (typeof video === 'string') {
			this.sourceURL = video;
		}
	}
	
	get source() {
		return this.sourceURL;
	}
	
	toGif() : Q.Promise<string> {
		return Q.Promise<ArrayBuffer>((resolve) => {
			var req = new XMLHttpRequest();
			
			req.responseType = 'arraybuffer';
			
			req.onreadystatechange = () => req.response && resolve(req.response);
			req.open('GET', this.sourceURL);
			req.send();
					
		}).then<FfmpegWorkerFile>((buffer : ArrayBuffer) => {
			return new GifWorker(new Uint8Array(buffer)).done;
		}).then<string>((file : FfmpegWorkerFile) => URL.createObjectURL(new Blob([file.data])));
	}
	
	
	getFileName(withExtension = true) {
		var name = this.sourceURL.match(/\/?([^\/]+)$/)[1];
		
		if (!withExtension) {
			return name.match(/^[^\.]+/)[0];
		} else {
			return name;
		}
	}
}
