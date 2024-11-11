package com.app.positionback.post;

import com.app.positionback.domain.post.PostDTO;
import com.app.positionback.service.post.PostService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
@Slf4j
public class PostTests {

    @Autowired
    private PostService postService;



    @Test
    public void testSavePost() {
        PostDTO postDTO = new PostDTO();
        postDTO.setMemberId(1L);
        postDTO.setPostTitle("테스트 제목");
        postDTO.setPostContent("테스트 내용");
        postDTO.setPostReadCount(String.valueOf(200));

        postService.write(postDTO.toVO());
        log.info("게시글이 성공적으로 저장되었습니다.");
    }

}
