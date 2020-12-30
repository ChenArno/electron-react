import Constants from './constants'
import { arrToSum } from '@/utils/base'

export function arr2Str(arr: Array<string>, start: number, end: number) {
	const newArr = arr.slice(start, end).reverse()
	return newArr.toString().replace(/,/g, "").toUpperCase() // 转换字符串 ,大小写
}

export function case2Str(arr: Array<string>, start: number, end: number) {
	const newArr = arr.slice(start, end)
	return newArr.toString().replace(/,/g, "").toUpperCase() // 转换字符串 ,大小写
}

// 取位数
export function valueAtBit(str: string, bit: number) {
	const num = new Array(8 - str.length + 1).join('0') + str;
	//或者 
	return Number(num[bit - 1]);
	// return (num >> (bit - 1)) & 1; //会漏位
}

// 字符串转16进制

export function strToHexCharCode(str: string): any {
	if (str === "") return "";
	let hexCharCode: Array<any> = [];
	for (var i = 0; i < str.length / 2; i++) {
		hexCharCode = [...hexCharCode, parseInt(str.substr(2 * i, 2), 16)]
	}
	return hexCharCode;
}
// 数值转16进制 转位数
export function intToHexArr(num: number, len: number = 4) {
	let str = num.toString(16) // 转16进制
	str = new Array(len - str.length + 1).join('0') + str;
	return strToHexCharCode(str).reverse()
}

// 字符串转32进制

export function strTo32HexCharCode(num: number) {
	const str = num.toString(16)
	const str1 = new Array(8 - str.length + 1).join('0') + str
	let hexCharCode: Array<any> = [];
	for (var i = 0; i < str1.length / 2; i++) {
		hexCharCode = [...hexCharCode, parseInt(str1.substr(2 * i, 2), 16)]
	}
	return hexCharCode.reverse();
}

//取bit
export function light2Bit(val: any, status: any) {
	const coll = { ...status, ...val }
	let v = ''
	Object.keys(coll).filter(o => o === 'yellow' || o === 'red' || o === 'green').forEach(o => v += coll[o] + '')
	// console.log(v)
	return [parseInt(v, 2)] // 2进制转10进制
}
/**
 * @param bodyMsg 消息体
 * @param msgId 消息id
 * **/
export function getCodeBody(bodyMsg: any, msgId: any) {
	// 消息结构长度12
	let sendMsg = [
		...Constants.cont_head,
		...Constants.cont_reserved,
		...[0xFF, 0xFF, 0xFF, 0xFF],
		...msgId,
		...intToHexArr(bodyMsg.length),
		...bodyMsg
	]
	sendMsg = [...sendMsg, ...strToHexCharCode(arrToSum(sendMsg))]
	return sendMsg
}