class Constants {
	static cont_head = [0xc7, 0xf9] //报文头
	static AP_PowerUp_Ind = [0x00, 0x00] // 版本号
	static cont_msgId_Tower = [0x54, 0x00] // 塔灯的状态上报及需求同步
	static cont_msgId_smart = [0x55, 0x00] // 智能灯的状态上报及需求同步
	static cont_msgId_keys = [0x50, 0x00] // 智能灯的状态上报及需求同步
	static cont_reserved = [0x01, 0x00] // 预留
	static cont_respReserved = [0x00, 0x00] //数据发送预留
	static AP_Config_BeaconMode = [0x08, 0x80] // 修改TD的上报模式
	static AP_Config_RfBase = [0x06, 0x80] // 修改基站频率
	static ED_Config_RfBase = [0x05, 0x80]// 修改标签频率

	static AP_Factory_Config_MAC = [0x03, 0x80]// 配置AP的MAC地址
	static AP_SwUpdate_Init_Req = [0x01, 0x80] // Server发送Req给AP
	static AP_SwUpdate_CodeData_Req = [0x02, 0x80] // AP发送Req给Server，申请一段代码数据（CodeData），Server给出Resp。

	static AP_Factory_Config_IP_Req = [0x00, 0x80] // ap设置参数
	static AP_Reset_Req = [0x06, 0x00] //重启
}

export default Constants