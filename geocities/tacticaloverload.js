var arr = document.querySelectorAll('a[href$=".mp3"]'), i = 0;
arr.forEach(el => el.setAttribute('download', el.textContent));
function download() {
	if (i === arr.length) {
		clearInterval(interval);
		return;
    }
	arr[i++].click();
}
var interval = setInterval(download, 20000);
download();
