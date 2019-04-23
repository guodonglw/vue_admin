
const express = require('express');
const router = express.Router();
const total = require('../api/total');
const userAccount = require('../api/userAccount');

// router.get('/test',test.func_test);

// 账本管理
router.post('/userAccount/list', userAccount.findUserAccoutList);
router.post('/userAccount/amount', userAccount.addUserAccountAmount);

// 统计管理
router.post('/total/all', total.findAllTotal);
router.post('/total/week', total.findWeekTotal);

module.exports = router;
