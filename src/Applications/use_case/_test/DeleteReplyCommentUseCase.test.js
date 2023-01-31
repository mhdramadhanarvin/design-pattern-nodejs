const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const DeleteReplyCommentUseCase = require("../DeleteReplyCommentUseCase")

describe("DeleteReplyCommentUseCase", () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it("should orchestrating the delete thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123", 
      commentId: "comment-123", 
      replyCommentId: "replycomment-123", 
      owner: "user-123",
    }

    // mock
    const mockThreadRepository = new ThreadRepository
    const mockCommentRepository = new CommentRepository
    mockThreadRepository.checkThreadExist = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.checkCommentExist = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.verifyOwner = jest.fn().mockImplementation(() => Promise.resolve())
    mockCommentRepository.deleteComment = jest.fn().mockImplementation(() => Promise.resolve())

    const deleteReplyCommentUseCase = new DeleteReplyCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository
    })
    
    // Action
    await deleteReplyCommentUseCase.execute(useCasePayload)

    // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId)
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.replyCommentId)
    expect(mockCommentRepository.verifyOwner).toBeCalledWith(useCasePayload.commentId, useCasePayload.owner) 
    expect(mockCommentRepository.deleteComment).toBeCalledWith(useCasePayload.commentId)
  })
})