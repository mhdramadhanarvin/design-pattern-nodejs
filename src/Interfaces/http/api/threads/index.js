const ThreadsHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "users",
  register: async (server, { container }) => {
    const threadrsHandler = new ThreadsHandler(container)
    server.route(routes(threadrsHandler))
  },
}
