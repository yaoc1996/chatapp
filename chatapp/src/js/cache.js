function setStorage(key, value) {
	localStorage.setItem(key, value);
}

function getStorage(key) {
	return localStorage.getItem(key);
}

function removeStorage(key) {
	localStorage.removeItem(key);
}

export { setStorage, getStorage, removeStorage };
