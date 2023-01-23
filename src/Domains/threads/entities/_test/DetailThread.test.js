const DetailThread = require("../DetailThread")

describe("a DetailThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
  })

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      thread: {}, 
    }

    // Action and Assert
    expect(() => new DetailThread(payload)).toThrowError("DETAIL_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
  }) 

  it("should create DetailThread object correctly", () => {
    // Arrange
    const payload = {
      thread: "thread-123"
    }

    // Action
    const detailThread = new DetailThread(payload)

    // Assert
    expect(detailThread.thread).toEqual(payload.thread) 
  })
})
