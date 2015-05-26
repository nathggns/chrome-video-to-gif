/// <reference path="../../typings/tsd.d.ts" />

import Q = require('q');

export interface FfmpegWorkerMessage {
	type : string;
	data ?: any;
}

export interface FfmpegWorkerFile {
	data : Uint8Array;
	name : string;
}

export class FfmpegWorker {
	worker : Worker;
	
	messageHandlers : { (msg ?: FfmpegWorkerMessage): void; }[] = [];
	
	private readyDeferred = Q.defer<boolean>();
	
	constructor() {
		this.messageHandlers.push(msg => this.handleMessage(msg));
		
		Q.Promise<string>((resolve) => {
			var req = new XMLHttpRequest();
			
			req.onreadystatechange = () => req.responseText && resolve(req.responseText);
			req.open('GET', this.getWorkerURL());
			req.send();
		}).then(str => {
			this.worker = new Worker(URL.createObjectURL(new Blob([str], { type : 'application/javascript '})));
			
			this.worker.onmessage = e => this.onWorkerMesage(e);
		});
	}
	
	postMessage(message : any) {
		this.worker.postMessage(message);
	}
	
	get ready() {
		return this.readyDeferred.promise;
	}
	
	private getWorkerURL() {
		return chrome.extension.getURL('worker.js');
	}
	
	private getConvertScriptURL() {
		return chrome.extension.getURL('node_modules/videoconverter/build/ffmpeg.js');
	}
	
	private onWorkerMesage(e : { data : FfmpegWorkerMessage }) {
		this.messageHandlers.forEach(h => h(e.data));
	}
	
	private handleMessage(message : FfmpegWorkerMessage) {	
		switch (message.type) {
			case 'ready':
				this.loadConverterScript();
			break;
			
			case 'imported':
				this.readyDeferred.resolve(true);
			break;
			
			case 'stdout':
				console.log(message.data);
			break;
		}	
	}
	
	private loadConverterScript() {
		this.worker.postMessage({
			type : 'importScript',
			script : this.getConvertScriptURL()
		});
	}
}