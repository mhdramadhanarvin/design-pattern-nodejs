const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase.js")
 
class ThreadsHandler {
  constructor(container) {
    this._container = container
 
    this.postThreadHandler = this.postThreadHandler.bind(this)
  }
 
  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name)
    const { id: owner } = request.auth.credentials
    const payload = {
      title: request.payload.title,
      body: request.payload.body,
      owner
    }

    const addedThread = await addThreadUseCase.execute(payload) 
    
    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    })
    
    response.code(201)
    return response
  }
}
 
module.exports = ThreadsHandler