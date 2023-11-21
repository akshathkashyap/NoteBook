export { login } from './login.controller';
export {
  getUserById,
  createUser,
  getUserByQuery,
  updateUserDataByParam
} from './user.controller';
export {
  createTopic,
  getAuthorsTopics,
  updateTopicName,
  deleteTopic
} from './topic.controller';
export {
  createMemo,
  getAuthorsMemos,
  getMemosSentToAuthor,
  updateMemo,
  sendMemo,
  deleteMemo
} from './memo.controller'
