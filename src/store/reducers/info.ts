export const BASEMSG = "info/BASEMSG"

const initState: any = {
	baseMsg: {}
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