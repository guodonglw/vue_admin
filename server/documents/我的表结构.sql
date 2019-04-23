# 管理员表单
CREATE TABLE `user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `LoginName` varchar(20) NOT NULL,
  `Password` varchar(32) NOT NULL,
  `RealName` varchar(80) NOT NULL,
  `Email` varchar(80) DEFAULT NULL,
  `CreateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `DeleteTime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


# 账目表单
CREATE TABLE user_account
(
  AccountID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,        # 账目ID
  ID INT NOT NULL,                                          # 管理员ID
  RealName VARCHAR(20) NOT NULL,                            # 管理员名字
  InOrOut INT DEFAULT 1 NOT NULL,                           # 1、收入 2、支出
  Amount INT DEFAULT 0 NOT NULL,                            # 实际金额
  RecoudTime TIMESTAMP DEFAULT now() NOT NULL               # 记录时间
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE user_account ADD
CONSTRAINT sa_user_to_account FOREIGN KEY (SAID)
REFERENCES sa_user(SAID);
