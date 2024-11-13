package com.app.positionback.service.reply;

import com.app.positionback.domain.reply.ReplyDTO;
import com.app.positionback.domain.reply.ReplyVO;

import java.util.List;

public interface ReplyService {
   public void save(ReplyVO replyVO);
    public List<ReplyDTO> getRepliesByPostId(Long postId);
    public ReplyDTO getReplyById(Long id);
    public void updateReply(ReplyVO replyVO);
    public void deleteReply(Long id);
}
