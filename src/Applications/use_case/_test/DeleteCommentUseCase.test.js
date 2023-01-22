const CommentRepository = require("../../../Domains/comments/CommentRepository")
const DeleteCommentUseCase = require("../DeleteCommentUseCase.js")

describe("DeleteCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the delete thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      id: "comment-123",
      thread: "thread-123",
      owner: "user-123",
    }

    // mock
    const mockCommentRepository = new CommentRepository
    mockCommentRepository.checkCommentExist = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyOwner = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve())

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository
    })
    
    // Action
    await deleteCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.id)
    expect(mockCommentRepository.verifyOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner)
    expect(mockCommentRepository.verifyOwner).toBeCalledWith(useCasePayload.id, useCasePayload.owner)
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.id)
  })
})