import { hex2int } from '@/utils/base'
import store from '@/store'
import { BASEMSG } from '@/store/reducers/info'

export function handMessage(str: any): any {
	const head = arr2Str(str, 0, 2)
	if (head !== 'F9C7') {
		return null
	}
	const msgId = arr2Str(str, 8, 10)
	if (hex2int(msgId) == 84) { // 塔灯的状态上报及需求同步
		const tagId = case2Str(str, 12, 16) // 不用高低位取反
		// if (tagId === '0600002E') {
		// 	console.log(str)
		// }
		const HWType = case2Str(str, 16, 17) // 软件信息
		const SWVersion = case2Str(str, 17, 18) // 软件版本
		const LedState = case2Str(str, 18, 19) // 16进制转2进制 亮灯一个bit表示一种颜色，一共最多可以表示8种颜色：
		// BIT0：红灯
		// BIT1：绿灯
		// BIT2：黄灯
		const BellState = case2Str(str, 19, 20) // 0x00表示不蜂鸣,0x01表示蜂鸣
		// console.log(tagId) // 0600002E

		const colorState = parseInt(LedState, 16).toString(2)// 字符串先转16进制，再转2进制
		// tagId === '0600002E' && console.log(colorState, valueAtBit(colorState, 6), valueAtBit(colorState, 7), valueAtBit(colorState, 8))
		store.dispatch({ type: BASEMSG, value: { tagId, HWType, SWVersion, LedState: { red: valueAtBit(colorState, 7), yellow: valueAtBit(colorState, 5), green: valueAtBit(colorState, 6) }, BellState: BellState === '00' ? 0 : 1 } })
		return tagId
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

// 取位数
export function valueAtBit(str: string, bit: number) {
	const num = new Array(8 - str.length + 1).join('0') + str;
	//或者 
	return Number(num[bit - 1]);
	// return (num >> (bit - 1)) & 1; //会漏位
}
