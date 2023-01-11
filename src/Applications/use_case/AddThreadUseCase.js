const AddThread = require("../../Domains/threads/entities/AddThread")

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository 
  }

  async execute(useCasePayload) {
    const addThread = new AddThread(useCasePayload) 
    return this._userRepository.addUser(addThread)
  }
}

module.exports = AddThreadUseCase
