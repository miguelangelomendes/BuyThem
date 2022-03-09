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
					to: "/",
					title: "home",
					name:"index",
				},
				{
					to: "/purchases",
					title: "purchases",
					name:"purchases",
				},
				{
					to: "/profile/me",
					title: "profile",
					name:"profile-me",
				},
			]
		commit('setTop', menuTop)
	},
}