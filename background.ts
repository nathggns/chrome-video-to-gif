/// <reference path="typings/tsd.d.ts" />
import Q = require('q');
import { GifWorker } from './modules/workers/gif';
import { FfmpegWorkerFile } from './modules/workers/ffmpeg';
import { Video } from './modules/video/video';
import { downloadURL } from './modules/helper';

Q.longStackSupport = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === 'convertVideoToGif') {
		var video = new Video(request.url);
		
		video.toGif()
			.then(url => {
				sendResponse(true);
				downloadURL(url, video.getFileName(false));

				if (chrome.runtime.lastError) {
					console.warn(chrome.runtime.lastError);
				}
			})
			.done();

		return true;
	}
});