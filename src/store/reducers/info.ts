export const BASEMSG = "info/BASEMSG"
export const MENUITEM = "info/MENUITEM"
export const CODE = "info/CODE"

const initState: any = {
	baseMsg: {
	},
	menuItem: 'contal',
	code: ''
}

export default function reducer(state = initState, action: any) {
	switch (action.type) {
		case BASEMSG:
			return {
				...state, baseMsg: action.value ? action.value : {}
			}
		case MENUITEM:
			return { ...state, menuItem: action.value }
		case CODE:
			return { ...state, code: action.value }
		default:
			return state
	}
}