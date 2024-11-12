package com.app.positionback.mapper.reply;

import com.app.positionback.domain.reply.ReplyDTO;
import com.app.positionback.domain.reply.ReplyVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ReplyMapper {

    public void insertReply(ReplyVO replyVO);

    public List<ReplyDTO> selectRepliesByPostId(@Param("postId") Long postId);

    public ReplyDTO selectReplyById(@Param("id") Long id);

    public void updateReply(ReplyVO replyVO);

    public void deleteReply(@Param("id") Long id);
}
