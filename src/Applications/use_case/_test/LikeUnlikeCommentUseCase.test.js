const CommentRepository = require("../../../Domains/comments/CommentRepository")
const ThreadRepository = require("../../../Domains/threads/ThreadRepository")
const LikeUnlikeCommentUseCase = require("../LikeUnlikeCommentUseCase")
const LikesCommentRepository = require("../../../Domains/likes_comment/LikesCommentRepository")

describe("LikeUnlikeCommentUseCase", () => {
  it("should orchestrating like comment action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    }

    // /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository() 
    const mockCommentRepository = new CommentRepository() 
    const mockLikesCommentRepository = new LikesCommentRepository() 

    /** mocking needed function */  
    mockThreadRepository.checkThreadExist = jest.fn(() => Promise.resolve())
    mockCommentRepository.checkCommentExist = jest.fn(() => Promise.resolve())
    mockLikesCommentRepository.hasLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(false))
    mockLikesCommentRepository.addUserComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.incrementCommentLike = jest.fn(() => Promise.resolve())  

    /** creating use case instance */
    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likesCommentRepository: mockLikesCommentRepository
    })

    // // Action
    await likeUnlikeCommentUseCase.execute(useCasePayload)

    // // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId)
    expect(mockLikesCommentRepository.hasLikeComment).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId)
    expect(mockLikesCommentRepository.addUserComment).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId)
    expect(mockCommentRepository.incrementCommentLike).toBeCalledWith(useCasePayload.commentId) 
  })
  
  it("should orchestrating dislike comment action correctly", async () => {
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    }

    // /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository() 
    const mockCommentRepository = new CommentRepository() 
    const mockLikesCommentRepository = new LikesCommentRepository() 

    /** mocking needed function */  
    mockThreadRepository.checkThreadExist = jest.fn(() => Promise.resolve())
    mockCommentRepository.checkCommentExist = jest.fn(() => Promise.resolve())
    mockLikesCommentRepository.hasLikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve(true))
    mockLikesCommentRepository.removeUserComment = jest.fn()
      .mockImplementation(() => Promise.resolve())
    mockCommentRepository.decrementCommentLike = jest.fn(() => Promise.resolve())  

    /** creating use case instance */
    const likeUnlikeCommentUseCase = new LikeUnlikeCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      likesCommentRepository: mockLikesCommentRepository
    })

    // // Action
    await likeUnlikeCommentUseCase.execute(useCasePayload)

    // // Assert
    expect(mockThreadRepository.checkThreadExist).toBeCalledWith(useCasePayload.threadId)
    expect(mockCommentRepository.checkCommentExist).toBeCalledWith(useCasePayload.commentId)
    expect(mockLikesCommentRepository.hasLikeComment).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId)
    expect(mockLikesCommentRepository.removeUserComment).toBeCalledWith(useCasePayload.commentId, useCasePayload.userId)
    expect(mockCommentRepository.decrementCommentLike).toBeCalledWith(useCasePayload.commentId) 
  }) 
})
