import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users } from './data/user';
import Mock from "mockjs";
import util from '../common/js/util'
let _Users = Users;

export default {
  /**
   * mock bootstrap
   */

  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    //登录
    mock.onPost('/role/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 0, msg: '请求成功', user }]);
          } else {
            resolve([200, { code: 1, msg: '账号或密码错误' }]);
          }
        }, 1000);
      });
    });

    //获取用户列表（分页）
    mock.onGet('/user/listpage').reply(config => {
      let {page, name} = config.params;
      let mockUsers = _Users.filter(user => {
        if (name && user.name.indexOf(name) == -1) return false;
        return true;
      });
      let total = mockUsers.length;
      mockUsers = mockUsers.filter((u, index) => index < 15 * page && index >= 15 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            users: mockUsers
          }]);
        }, 1000);
      });
    });

    //删除用户
    mock.onGet('/user/remove').reply(config => {
      let { id } = config.params;
      _Users = _Users.filter(u => u.id !== id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 0,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //批量删除用户
    mock.onGet('/user/batchremove').reply(config => {
      let { ids } = config.params;
      // ids = ids.split(',');
      _Users = _Users.filter(u => !ids.includes(u.id));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 0,
            msg: '删除成功'
          }]);
        }, 500);
      });
    });

    //编辑用户
    mock.onGet('/user/edit').reply(config => {
      let { id, name, email } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.name = name;
          u.email = email;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 0,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

    //新增用户
    mock.onGet('/user/add').reply(config => {
      let { name, email} = config.params;
      _Users.push({
        id: Mock.Random.guid(),
        name: name,
        email: email,
        buildtime: util.formatDate.format(new Date(), 'yyyy-MM-dd')
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 0,
            msg: '新增成功'
          }]);
        }, 500);
      });
    });

    //用户充值
    mock.onGet('/user/amount').reply(config => {
      let { id, number, amount } = config.params;
      _Users.some(u => {
        if (u.id === id) {
          u.amount = parseInt(number) + parseInt(amount);
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 0,
            msg: '编辑成功'
          }]);
        }, 500);
      });
    });

  }
};
