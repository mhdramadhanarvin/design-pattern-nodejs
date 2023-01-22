const CommentsHandler = require("./handler")
const routes = require("./routes")

module.exports = {
  name: "comments",
  register: async (server, { container }) => {
    const commentrsHandler = new CommentsHandler(container)
    server.route(routes(commentrsHandler))
  },
}
