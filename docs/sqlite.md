
```prompt
sqlite 에서 mostPopularVideos 테이블의 tags컬럼의 datatype을 text로 변경하려면?
```

```sql
ALTER TABLE mostPopularVideos RENAME TO mostPopularVideos_old;

CREATE TABLE mostPopularVideos (
    -- 다른 컬럼들은 그대로 유지
    tags TEXT,
    -- 나머지 컬럼들
);

INSERT INTO mostPopularVideos 
SELECT * FROM mostPopularVideos_old;

DROP TABLE mostPopularVideos_old;
```