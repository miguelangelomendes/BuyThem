import * as near from '../near/interface'

export const state = () => ({
	list: [],
	detail: null,
})

export const mutations = {
	SET_LIST(state, newList) {
		state.list = newList ? newList : []
	},
	ADD_TO_LIST(state, newItem) {
		if (newItem) {
			const index = state.list.findIndex(item => item.id === newItem.id)
			if (index >= 0) {
				if (state.list[index].media) {
					newItem.media = state.list[index].media
				}
				state.list.splice(index, 1, newItem);
			} else {
				state.list.unshift(newItem)
			}
		}
	},
	SET_DETAIL(state, newDetail) {
		state.detail = newDetail ? newDetail : null
	},
}

export const actions = {
	async list({ commit }) {
		try {
			const result = await near.getPruchases()
			if (this.state.items.list.length === 0) {
				commit('SET_LIST', result)
			} else {
				if (result) {
					result.forEach(item => {
						commit('ADD_TO_LIST', item)
					})
				}
			}
			commit('SET_LIST', result)
			return result
		} catch (error) {
			console.error("Purchases list error", error)
			throw error
		}
	},
	async buyItem({ commit }, item) {
		try {
			const result = await near.buyItem(item.id, item.price.toString())
			commit('ADD_TO_LIST', result)
			commit('items/ADD_OR_UPDATE_ITEM_ON_LIST', result, { root: true })
			return result
		} catch (error) {
			console.error("buyItem error", error)
			throw error
		}
	},
}