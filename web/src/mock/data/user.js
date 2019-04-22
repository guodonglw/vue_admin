import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: '',
    password: '',
    avatar: '',
    name: ''
  }
];

const Users = [];

for (let i = 0; i < 10; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    builder: Mock.Random.cname(),
    buildtime: Mock.Random.date(),
  }));
}

export { LoginUsers, Users };
