const throttle = (func, delay) => {
	let toThrottle = false;
	return function () {
		if (!toThrottle) {
			toThrottle = true;
			func.apply(this, arguments);
			setTimeout(() => toThrottle = false, delay);
		}
	};
};

module.exports = throttle;