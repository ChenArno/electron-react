class Constants {
	static cont_head = [0xc7, 0xf9] //报文头
	static cont_msgId_Tower = [0x54, 0x00] // 塔灯的状态上报及需求同步
	static cont_msgId_smart = [0x55, 0x00] // 塔灯的状态上报及需求同步
	static cont_reserved = [0x01, 0x00] // 预留
	static cont_respReserved = [0x00, 0x00] //数据发送预留
	static AP_Config_BeaconMode = [0x08, 0x80]

	static model: any = {
		0: '塔灯',
		1: '智能灯'
	}
}

export default Constants