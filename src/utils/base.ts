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