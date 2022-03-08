export default ({ $axios, error }) => {
	$axios.onError((err) => {
		if (err.response.status === 500) {
			error({
				statusCode: err.response.status,
				message: err.response.statusText
			})
		}
	})
}