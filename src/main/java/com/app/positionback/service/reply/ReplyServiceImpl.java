package com.app.positionback.service.reply;

import com.app.positionback.domain.reply.ReplyDTO;
import com.app.positionback.domain.reply.ReplyVO;
import com.app.positionback.repository.reply.ReplyDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class ReplyServiceImpl implements ReplyService {

    private final ReplyDAO replyDAO;

    @Override
    public void save(ReplyVO replyVO) {
        replyDAO.insertReply(replyVO);
    }

    @Override
    public List<ReplyDTO> getRepliesByPostId(Long postId) {
        return replyDAO.getRepliesByPostId(postId);
    }

    @Override
    public ReplyDTO getReplyById(Long id) {
        return replyDAO.getReplyById(id);
    }

    @Override
    public void updateReply(ReplyVO replyVO) {
        replyDAO.updateReply(replyVO);
    }

    @Override
    public void deleteReply(Long id) {
        replyDAO.deleteReply(id);
    }
}
