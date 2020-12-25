import store from '@/store'
import { BASEMSG } from '@/store/reducers/info'
import Constants from './constants'
import { buffer_to_hex, arrToSum } from '@/utils/base'

export function handMessage(arr: any): any {
	const str = buffer_to_hex(arr)
	const head = str.slice(0, 2)

	if (head.toString() !== buffer_to_hex(Constants.cont_head).toString()) {
		return null
	}
	const msgId = Array.prototype.slice.call(arr.slice(8, 10))
	if (JSON.stringify(msgId) == JSON.stringify(Constants.cont_msgId_Tower)
		|| JSON.stringify(msgId) == JSON.stringify(Constants.cont_msgId_smart)
		|| JSON.stringify(msgId) == JSON.stringify(Constants.cont_msgId_keys)
	) { // 塔灯的状态上报及需求同步
		const baseCode = arr.slice(4, 8)
		const tagId = case2Str(str, 12, 16) // 不用高低位取反
		const HWType = case2Str(str, 16, 17) // 软件信息
		const SWVersion = case2Str(str, 17, 18) // 软件版本
		// const LedState = case2Str(str, 18, 19) // 16进制转2进制 亮灯一个bit表示一种颜色，一共最多可以表示8种颜色：
		// BIT0：红灯
		// BIT1：绿灯
		// BIT2：黄灯
		const BellState = Array.prototype.slice.call(arr.slice(19, 20))[0] // 0x00表示不蜂鸣,0x01表示蜂鸣  ,设备会上报09,出错
		// if (msgId[0] === 85 && tagId === '06000034') {
		// 	console.log(arr, BellState)
		// }
		store.dispatch({ type: BASEMSG, value: { msgId: msgId[0], baseCode, tagId, HWType, SWVersion, LedState: str.slice(18, 19)[0], BellState: BellState === 1 ? 1 : 0 } })
	}
	return null
}

export function arr2Str(arr: Array<string>, start: number, end: number) {
	const newArr = arr.slice(start, end).reverse()
	return newArr.toString().replace(/,/g, "").toUpperCase() // 转换字符串 ,大小写
}

export function case2Str(arr: Array<string>, start: number, end: number) {
	const newArr = arr.slice(start, end)
	return newArr.toString().replace(/,/g, "").toUpperCase() // 转换字符串 ,大小写
}

// export function case162Str(arr: Array<string>) {
// 	const newArr = buffer_to_hex(arr)
// 	return newArr.toString().replace(/,/g, "").toUpperCase() // 转换字符串 ,大小写
// }

// 取位数
export function valueAtBit(str: string, bit: number) {
	const num = new Array(8 - str.length + 1).join('0') + str;
	//或者 
	return Number(num[bit - 1]);
	// return (num >> (bit - 1)) & 1; //会漏位
}


// 字符串转16进制

export function strToHexCharCode(str: string) {
	if (str === "") return "";
	let hexCharCode: Array<any> = [];
	for (var i = 0; i < str.length / 2; i++) {
		hexCharCode = [...hexCharCode, parseInt(str.substr(2 * i, 2), 16)]
	}
	return hexCharCode;
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
	let sendMsg = [
		...Constants.cont_head,
		...Constants.cont_reserved,
		...[0xFF, 0xFF, 0xFF, 0xFF],
		...msgId,
		...[bodyMsg.length, 0x00],
		...bodyMsg
	]
	sendMsg = [...sendMsg, ...strToHexCharCode(arrToSum(sendMsg))]
	return sendMsg
}