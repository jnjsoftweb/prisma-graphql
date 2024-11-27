const fs = require('fs');
const path = require('path');
const { program } = require('commander');

// 커맨드 라인 옵션 설정
program
  .option('-n, --name <name>', '프로젝트 이름')
  .option('-d, --description <description>', '프로젝트 설명')
  .option('-a, --author <author>', '작성자 이름')
  .option('-e, --email <email>', '작성자 이메일')
  .parse(process.argv);

const options = program.opts();

// package.json 파일 읽기
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);

// 입력받은 값으로 package.json 업데이트
if (options.name) {
  packageJson.name = options.name;
}
if (options.description) {
  packageJson.description = options.description;
}
if (options.author || options.email) {
  packageJson.author = `${options.author || ''} <${options.email || ''}>`.trim();
}

// 수정된 package.json 저장
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('package.json이 성공적으로 업데이트되었습니다.');