const { AuthorizedError } = require('./authorizedError');
const { BadRequestError } = require('./badRequestError');
const { ConflictError } = require('./conflictError');
const { ForbiddenError } = require('./forbiddenError');
const { NotFoundError } = require('./notFoundError');

module.exports = {
  AuthorizedError, BadRequestError, ConflictError, ForbiddenError, NotFoundError,
};
