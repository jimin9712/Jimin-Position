package com.app.positionback.controller.reply;

import com.app.positionback.domain.reply.ReplyDTO;
import com.app.positionback.domain.reply.ReplyVO;
import com.app.positionback.service.reply.ReplyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/*")
@RequiredArgsConstructor
@Slf4j
public class ReplyController {
    private final ReplyService replyService;

    @PostMapping("/posts/{postId}/replies")
    public ResponseEntity<ReplyDTO> addReply(@PathVariable Long postId, @RequestBody ReplyDTO replyDTO) {
        try {
            replyDTO.setPostId(postId);
            replyDTO.setMemberId(1L);

            ReplyVO replyVO = replyDTO.toVO();

            replyService.save(replyVO);

            ReplyDTO createdReplyDTO = replyService.getReplyById(replyVO.getId());

            return new ResponseEntity<>(createdReplyDTO, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("댓글 작성 중 ㅇㅎ류", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/posts/{postId}/replies")
    public ResponseEntity<List<ReplyDTO>> getReplies(@PathVariable Long postId) {
        try {
            List<ReplyDTO> replies = replyService.getRepliesByPostId(postId);
            return new ResponseEntity<>(replies, HttpStatus.OK);
        } catch (Exception e) {
            log.error("댓글 작성 중 오류", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/replies/{replyId}")
    public ResponseEntity<Void> updateReply(@PathVariable Long replyId, @RequestBody ReplyDTO replyDTO) {
        try {
            replyDTO.setId(replyId);

            ReplyVO replyVO = replyDTO.toVO();

            replyService.updateReply(replyVO);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error("Error updating reply", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable Long replyId) {
        try {
            replyService.deleteReply(replyId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            log.error("Error deleting reply", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
