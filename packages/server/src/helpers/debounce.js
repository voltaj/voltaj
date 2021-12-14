const debounce = (func, delay) => {
	let inDebounce;
	return function () {
		clearTimeout(inDebounce);
		inDebounce = setTimeout(() => func.apply(this, arguments), delay);
	};
};

module.exports = debounce;