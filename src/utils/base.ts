// buffer转16进制
export function buffer_to_hex(__buffer: any) {
	// return Array.prototype.map.call(__buffer, ((d: any) => d.toString(16))).join(' ')
	const uarray = Array.prototype.slice.call(__buffer)
	return uarray.map((el: any) => {
		let str = Number(el).toString(16)
		if (str.length === 1) {
			str = '0' + str
		}
		return str
	})
}
// 16进制转buffer
export function hex_to_buffer(__array: Array<string>) {
	const hex_array: any = __array.map(el => parseInt(el, 16))
	if (!Array.isArray(__array)) {
		return hex_array([__array])
	}
	const uarray = new Uint8Array(hex_array)
	return Buffer.from(uarray)
}
// 十六转10
export function hex2int(hex: any) {
	var len = hex.length, a = new Array(len), code;
	for (var i = 0; i < len; i++) {
		code = hex.charCodeAt(i);
		if (48 <= code && code < 58) {
			code -= 48;
		} else {
			code = (code & 0xdf) - 65 + 10;
		}
		a[i] = code;
	}

	return a.reduce(function (acc, c) {
		acc = 16 * acc + c;
		return acc;
	}, 0);
}
// 十进制整数转换16进制
export function int2hex(num: number, width: number) {
	var hex = "0123456789abcdef";
	var s = "";
	while (num) {
		s = hex.charAt(num % 16) + s;
		num = Math.floor(num / 16);
	}
	if (typeof width === "undefined" || width <= s.length) {
		return "0x" + s;
	}
	var delta = width - s.length;
	var padding = "";
	while (delta-- > 0) {
		padding += "0";
	}
	return "0x" + padding + s;
}

// 求和校验
export function arrToSum(data: Array<any>): string {
	let back = data.reduce((acc: number, cur: number) => { // 累加
		return acc + cur
	}, 0).toString(16)
	if (back.length === 1) {
		back = '0' + back
	} else if (back.length > 2) {
		back = back.substring(back.length - 2)
	}
	return back
}