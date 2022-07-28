class Conflict extends Error {
  construtor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = Conflict;
