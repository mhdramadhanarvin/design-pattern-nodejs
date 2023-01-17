const AddThread = require("../AddThread")

describe("a AddThread entities", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {}

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY")
  })

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "Thread biasa",
      body: {},
      owner: "user-123"
    }

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION")
  })

  it("should throw error when title contains more than 100 character", () => {
    // Arrange
    const payload = {
      title: "thread dicodingindonesiadicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicodingindonesiadicoding",
      body: "Isinya bebas ajalah", 
      owner: "user-123"
    }

    // Action and Assert
    expect(() => new AddThread(payload)).toThrowError("ADD_THREAD.TITLE_LIMIT_CHAR")
  })

  it("should create AddThread object correctly", () => {
    // Arrange
    const payload = {
      title: "Isinya bebas ajalah",
      body: "Thread biasa",
      owner: "user-123"
    }

    // Action
    const addThread = new AddThread(payload)

    // Assert
    expect(addThread.id).toEqual(payload.id)
    expect(addThread.title).toEqual(payload.title)
    expect(addThread.body).toEqual(payload.body)
    expect(addThread.owner).toEqual(payload.owner)
  })
})
