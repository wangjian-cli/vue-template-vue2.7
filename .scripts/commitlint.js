const fs = require('fs');
const TYPE = ['feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'docs', 'test', 'ci', 'build', 'chore'];
const NEED_TASK_TYPE = ['feat', 'fix', 'perf', 'refactor'];

const commitFilePath = process.argv[2];
const commitMessage = fs.readFileSync(commitFilePath, 'utf-8');

// 判断是否需要任务号
const needTask = NEED_TASK_TYPE.some(type => commitMessage.includes(type));

// 是否包含修改类型
const hasType = TYPE.some(type => commitMessage.includes(type));

if(needTask && !/^[a-zA-Z0-9]+-(\d)*\s/.test(commitMessage)) {
    // 需要任务号的type，但是没有填写任务号
    console.error('commit信息有误，没有任务号！feat、fix、pref、refactor、revert类型需要填写任务号。');
    process.exit(1);
} else if(!needTask && !hasType) {
    // 不需要任务号，但也没填写类型
    console.error('commit信息有误，没有提交类型！参考格式：任务号 修改类型 描述。如 “PCWEB-1234 feat 增加xxx功能”');
    process.exit(1);
} else if(!hasType) {
    console.error('commit信息有误。参考格式：“任务号 修改类型 描述”，如 “PCWEB-1234 feat 增加xxx功能”。');
    process.exit(1);
}