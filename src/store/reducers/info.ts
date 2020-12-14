export const BASEMSG = "info/BASEMSG"

const initState: any = {
	baseMsg: {
		model: 0 // 0为正常塔灯；1为智能灯模式
	}
}

export default function reducer(state = initState, action: any) {
	switch (action.type) {
		case BASEMSG:
			return {
				...state, baseMsg: action.value ? action.value : {}
			}
		default:
			return state
	}
}