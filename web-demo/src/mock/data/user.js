import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin',
    token: '123456',
    name: ''
  }
];

const Users = [];

for (let i = 0; i < 80; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    email: Mock.Random.email(),
    amount: Math.floor(Math.random()*1000),
    builder: Mock.Random.cname(),
    buildtime: Mock.Random.date(),
  }));
}

export { LoginUsers, Users };
