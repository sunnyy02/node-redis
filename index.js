

import redisClient from './redisClient';
import adminSchema from './/admin';


redisClient.on('connect', function() {
    console.log('Redis client connected');

});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});
// ioredis supports all Redis commands:
redisClient.set("foo", "bar"); // returns promise which resolves to string, "OK"

// ioredis supports the node.js callback style
redisClient.get("foo", function (err, result) {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Promise resolves to "bar"
  }
});




export const getAdmins = async () => {
  let originResult = await adminSchema.lrange(0, -1)
  if(originResult && originResult.length) { 
      let result = originResult.map(item => JSON.parse(item))
      console.log('getAdmin', result);
      return result
  }else {
      return []
  }
}

export const findAdmin = async (name) => {
  console.log('findAdmin by name', name);
  let admins = await getAdmins()
  if(admins.length) {
      let result = admins.filter(item => item.username === name)
      return result
  }else {
    console.log('findAdmin: no result');
    return []
  }
  
}

export const addAdmin = async (username, password) => {
  let admin = await findAdmin(username)
  if(admin.length) {
    console.log('addAdmin:exist', admin);
      return null
  }else {
    console.log('addAdmin', admin);
      let result = await adminSchema.lpush({username: username, pwd: password, role: 1})
      let p = await adminSchema.persist();
      return result
  }
}

addAdmin('user1', 'pass');
addAdmin('user2', 'pass');
