/// <reference path="../typings/tsd.d.ts" />
interface HTML5AnchorElement extends HTMLAnchorElement {
	download ?: string;
}

export function downloadURL(url : string, filename : string) {
	var a : HTML5AnchorElement = document.createElement('a');
	a.href = url;
	a.download = filename + '.gif';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a); 
	a = null;
}