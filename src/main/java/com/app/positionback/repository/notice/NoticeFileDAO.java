package com.app.positionback.repository.notice;

import com.app.positionback.domain.file.FileDTO;
import com.app.positionback.domain.file.NoticeFileDTO;
import com.app.positionback.domain.file.NoticeFileVO;
import com.app.positionback.mapper.notice.NoticeFileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class NoticeFileDAO {
    private final NoticeFileMapper noticeFileMapper;

//    // 파일 저장
//    public void saveFile(FileDTO fileDTO) {
//        noticeFileMapper.insertFile(fileDTO);
//    }
//
//    // 마지막으로 삽입된 ID 가져오기
//    public Long getLastInsertedId() {
//        return noticeFileMapper.getLastInsertId();
//    }

    // 공고와 파일 연결
    public void linkNoticeWithFile(NoticeFileVO noticeFileVO) {
        noticeFileMapper.insertNoticeFile(noticeFileVO);
    }

    // 공고 ID로 파일 매핑 삭제
    public void deleteFilesByNoticeId(Long noticeId) {
        noticeFileMapper.deleteFilesByNoticeId(noticeId);
    }

    // 공고 파일 id로 가져오기
    public Long getFileIdByNoticeId(Long noticeId) {
        return noticeFileMapper.selectFileIdByNoticeId(noticeId);
    }

}
