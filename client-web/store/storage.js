import axios from 'axios';

function initialState() {
  return {
  }
}

export const state = () => (initialState())

export const mutations = {
}

export const actions = {
  async upload({ commit }, file) {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("file", file, file.name)
      const result = await axios.post('/storage/upload', bodyFormData)
      return result.data
    } catch (error) {
      console.error("Error encrypt", error)
      throw error

    }
  },
  async get({ commit }, uri) {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("data", uri)
      const result = await axios.post('/storage/get', bodyFormData);
      return result.data
    } catch (error) {
      console.error("Error get", error)
      throw error

    }
  },

}