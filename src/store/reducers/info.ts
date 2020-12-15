export const BASEMSG = "info/BASEMSG"
export const MENUITEM = "info/MENUITEM"

const initState: any = {
	baseMsg: {
		model: 0 // 0为正常塔灯；1为智能灯模式
	},
	menuItem: 'contal'
}

export default function reducer(state = initState, action: any) {
	switch (action.type) {
		case BASEMSG:
			return {
				...state, baseMsg: action.value ? action.value : {}
			}
		case MENUITEM:
			return { ...state, menuItem: action.value }
		default:
			return state
	}
}