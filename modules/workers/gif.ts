/// <reference path="../../typings/tsd.d.ts" />

import { FfmpegWorker, FfmpegWorkerFile, FfmpegWorkerMessage } from './ffmpeg';
import Q = require('q');

export class GifWorker {
	
	worker = new FfmpegWorker();
	private doneDeferred : Q.Deferred<FfmpegWorkerFile>;
	
	constructor(private data : Uint8Array) {
		this.doneDeferred = Q.defer<FfmpegWorkerFile>();
		
		this.worker.messageHandlers.push(msg => this.handleMessage(msg));
		this.worker.ready.then(() => this.convert()).done();
	}
	
	get done() : Q.Promise<FfmpegWorkerFile> {
		return this.doneDeferred.promise;
	}
	
	private convert() {
		this.worker.postMessage({
			type : 'command',
			arguments : '-i input.mp4 -codec:v gif -qscale:v 7 output.gif'.split(' '),
			files : [
				{
					name : 'input.mp4',
					data : this.data
				}
			]
		});
	}
	
	private handleMessage(message : FfmpegWorkerMessage) {
		switch (message.type) {
			case 'done':
				if (message.data.length) {
					this.doneDeferred.resolve(message.data[0]);
				} else {
					this.doneDeferred.reject('Unknown Error');
				}
			break;
		}
	}
}