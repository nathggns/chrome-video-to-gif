/// <reference path="typings/tsd.d.ts" />

import { Port } from './modules/port';
import Q = require('q');

var getVideos = () => Q.Promise<string[]>(resolve => {
	chrome.tabs.query({ active : true, currentWindow : true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { type : 'loadVideos' }, response => {
			if (response && response.type === 'videos') {
				resolve(response.videos);
			}
		});
	});
});

var downloadVideo = (id : number, done : () => void) => {
	chrome.tabs.query({ active : true, currentWindow : true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { type : 'downloadVideo', id }, (response) => {
			done();
		});
	});
};

var highlight = (id : number, highlight = true) => {
	console.log('highlighting');
	chrome.tabs.query({ active : true, currentWindow : true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { type : 'highlightVideo', id, highlight });
	});
}

window['getVideos'] = getVideos;
window['downloadVideo'] = downloadVideo;
window['highlight'] = highlight;