const User = require('../../model/user.js');
const templates = require('./templates.js');
const Account = require('../../model/account/account.js');

const helper = module.exports = {};

helper.storedItem = {};
helper.users = {};
helper.tokens = {};
helper.accounts = {}

helper.clearModel = function (modelSchema, id) {
  return modelSchema.findByIdAndRemove(id);
}

helper.storeModel = function (model, modelName, user, values) {

  let item = new model(templates[modelName]);
  item.userID = helper.users[user]._id;

  return new Promise((resolve, reject) => {
    if(values) {
      for(key in values) {
        item[key] = values[key];
      }
    }
    item.save()
    .then((item) => {
      helper.storedItem[modelName] = item;
      resolve(item);
    })
    .catch((err) => reject(err));
  })
}

helper.authenticateUser = function (user) {

  helper.users[user] = new User(templates[user])
  let newAccount = new Account({userID: helper.users[user]._id})
  helper.users[user].accountID = newAccount._id
  helper.accounts[user] = newAccount;


  return new Promise((resolve, reject) => {
    helper.users[user].encryptPassword(helper.users[user].password)
    .then(user => user.generateToken())
    .then(token => {
      helper.tokens[user] = token;
      return helper.users[user].save()
    })
    .then(() => newAccount.save())
    .then(account => {
      resolve(helper.users[user])
    })
    .catch(err => reject(err));
  });
}





