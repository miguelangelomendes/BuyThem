import * as near from '../near/interface'

export const state = () => ({
	list: [],
	owned: [],
	detail: null,
})

export const mutations = {
	SET_LIST(state, newList) {
		state.list = newList ? newList : []
	},
	SET_OWNED(state, newList) {
		state.owned = newList ? newList : []
	},
	ADD_OR_UPDATE_ITEM_ON_LIST(state, newItem) {
		if (newItem) {
			const index = state.list.findIndex(item => item.id === newItem.id)
			if (index >= 0) {
				if (state.list[index].media) {
					newItem.media = state.list[index].media
				}
				state.list.splice(index, 1, newItem);
			} else {
				state.list.push(newItem)
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
			const result = await near.getItems()
			if (this.state.items.list.length === 0) {
				commit('SET_LIST', result)
			} else {
				if (result) {
					result.forEach(item => {
						commit('ADD_OR_UPDATE_ITEM_ON_LIST', item)
					})
				}
			}
			return result
		} catch (error) {
			console.error("Items list error", error)
			throw error
		}
	},
	async owned({ commit, dispatch }) {
		try {
			const result = await near.getOwnedItems()
			if (result ) {
				result.forEach(item => {
					commit('ADD_OR_UPDATE_ITEM_ON_LIST', item)
				})

				dispatch("setOwned")
			}
			return result
		} catch (error) {
			console.error("Profiles list error", error)
			throw error
		}
	},
	async setOwned({ commit }, id) {
		try {
			const user_id = await near.getUserId()
			commit('SET_OWNED', this.state.items.list.filter(item => item.owner_account_id === user_id))
		} catch (error) {
			console.error("Items setOwned error", error)
			throw error
		}
	},
	async create({ commit, dispatch }, item) {
		try {
			const result = await near.createItem(item)
			commit('ADD_OR_UPDATE_ITEM_ON_LIST', result)
			dispatch("setOwned")
			return item
		} catch (error) {
			console.error("Profiles create error", error)
			throw error
		}
	},
	async updateMedia({ commit }, params) {
		try {
			const item = this.state.items.list.find(item => item.id === params.id)
			if (item) {
				item.media = params.media
				commit('ADD_OR_UPDATE_ITEM_ON_LIST', item)
			}
			return item
		} catch (error) {
			console.error("Profiles list error", error)
			throw error
		}
	},
	async updateByUri({ commit }, params) {
		try {
			const item = this.state.items.list.find(item => item.uri === params.uri)
			if (item) {
				item.media = params.media
				commit('ADD_OR_UPDATE_ITEM_ON_LIST', item)
			}
			return item
		} catch (error) {
			console.error("Profiles list error", error)
			throw error
		}
	},

}