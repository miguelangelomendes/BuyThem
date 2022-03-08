export const state = () => ({
	top: [],
})

export const mutations = {
	setTop(state, newMenu) {
		state.top = newMenu
	},
}
export const actions = {
	getTop({ commit }) {
		const menuTop =
			[
				{
					to: "/purchases",
					title: "purchases",
				},
				{
					to: "/profile/me",
					title: "profile",
				},
			]
		commit('setTop', menuTop)
	},
}