import * as near from '../near/interface'

export const state = () => ({
	list: [],
	own: [],
	detail: null,
})

export const mutations = {
	SET_LIST(state, newList) {
		state.list = newList ? newList : []
	},
	SET_OWN(state, newList) {
		state.own = newList ? newList : []
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
	async own({ commit, dispatch }) {
		try {
			const result = await near.getOwnItems()
			if (result ) {
				result.forEach(item => {
					commit('ADD_OR_UPDATE_ITEM_ON_LIST', item)
				})

				dispatch("setOwn")
			}
			return result
		} catch (error) {
			console.error("Items Own list error", error)
			throw error
		}
	},
	async setOwn({ commit }, id) {
		try {
			const user_id = await near.getUserId()
			commit('SET_OWN', this.state.items.list.filter(item => item.owner_account_id === user_id))
		} catch (error) {
			console.error("Items setOwn error", error)
			throw error
		}
	},
	async create({ commit, dispatch }, item) {
		try {
			const result = await near.createItem(item)
			commit('ADD_OR_UPDATE_ITEM_ON_LIST', result)
			dispatch("setOwn")
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
				commit('purchases/ADD_TO_LIST', item, { root: true })
			}
			return item
		} catch (error) {
			console.error("Update media error", error)
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
			console.error("Update by uri error", error)
			throw error
		}
	},

}