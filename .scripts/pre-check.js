const fs = require('fs');
const path = require('path');

/**
 * 检测是否接入skywalking
 * 通过校验是否存在模板【xxx】来确定是否接监控
 */
const monitor = () => { 
    const content = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

    if (/【.*】/.test(content)) {
        console.log('\x1b[31m', '[error] 未接入skywalking', '\x1b[0m');
        process.exit(1);
    }
}

const check = () => { 
    // 检测是否接入监控
    monitor();
    // ...more
}

check()