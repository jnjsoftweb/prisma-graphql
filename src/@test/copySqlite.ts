import sqlite3 from 'sqlite3';
import path from 'path';

async function copyDatabaseTables(sourcePath: string, targetPath: string) {
  return new Promise((resolve, reject) => {
    const sourceDbPath = path.resolve(sourcePath);
    const targetDbPath = path.resolve(targetPath);

    const sourceDb = new sqlite3.Database(sourceDbPath, sqlite3.OPEN_READONLY);
    const targetDb = new sqlite3.Database(targetDbPath, sqlite3.OPEN_READWRITE);

    sourceDb.all("SELECT name FROM sqlite_master WHERE type='table' AND name NOT IN ('sqlite_sequence')", async (err, tables) => {
      if (err) {
        console.error('테이블 목록 추출 중 오류:', err);
        reject(err);
        return;
      }

      try {
        for (const table of tables) {
          const tableName = table.name;
          
          // 테이블 스키마 가져오기
          const schemaRow = await new Promise((resolve, reject) => {
            sourceDb.get(`SELECT sql FROM sqlite_master WHERE type='table' AND name=?`, [tableName], (err, row) => {
              if (err) reject(err);
              else resolve(row);
            });
          });

          // 테이블 생성
          await new Promise((resolve, reject) => {
            targetDb.run(schemaRow.sql, (err) => {
              if (err && !err.message.includes('already exists')) reject(err);
              else resolve(null);
            });
          });

          // 데이터 가져오기
          const rows = await new Promise((resolve, reject) => {
            sourceDb.all(`SELECT * FROM ${tableName}`, (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          });

          if (rows.length > 0) {
            await new Promise((resolve, reject) => {
              targetDb.run('BEGIN TRANSACTION', (err) => {
                if (err) reject(err);
                else resolve(null);
              });
            });

            const placeholders = Object.keys(rows[0]).map(() => '?').join(',');
            const stmt = targetDb.prepare(`INSERT OR REPLACE INTO ${tableName} VALUES (${placeholders})`);

            for (const row of rows) {
              await new Promise((resolve, reject) => {
                stmt.run(Object.values(row), (err) => {
                  if (err) reject(err);
                  else resolve(null);
                });
              });
            }

            await new Promise((resolve, reject) => {
              stmt.finalize();
              targetDb.run('COMMIT', (err) => {
                if (err) reject(err);
                else resolve(null);
              });
            });

            console.log(`테이블 ${tableName} 복사 완료`);
          }
        }

        // 모든 작업이 완료된 후 연결 종료
        sourceDb.close();
        targetDb.close();
        resolve(null);
      } catch (error) {
        console.error('에러 발생:', error);
        sourceDb.close();
        targetDb.close();
        reject(error);
      }
    });
  });
}

// 함수 실행
const sourcePath = 'C:/JnJ-soft/Projects/internal/jnj-backend/db/sqlite/youtube.db';
const targetPath = 'C:/JnJ-soft/Playground/nodejs/prisma-graphql/db/sqlite/youtube.db';

copyDatabaseTables(sourcePath, targetPath)
  .then(() => console.log('모든 테이블 복사 완료'))
  .catch(err => console.error('복사 중 오류 발생:', err));