package com.app.positionback.controller.post;

import com.app.positionback.domain.post.PostDTO;
import com.app.positionback.service.post.PostService;
import com.app.positionback.utill.Pagination;
import com.app.positionback.utill.Search;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.view.RedirectView;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Controller
@RequestMapping("/community/*")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;

    @GetMapping("/community/community-post-list-check")
    @ResponseBody
    public Map<String, Object> getPostList(Pagination pagination, Search search,
                                           @RequestParam(required = false) String query,
                                           @RequestParam(required = false) String filterType) {
        search.setKeyword(query);

        int total;

        // 기본 최신순
        if (filterType == null || filterType.equals("최신순")) {
            pagination.setOrder("최신순");
            total = postService.getTotalWithSearch(search);
        } else if (filterType.equals("조회수순")) {
            pagination.setOrder("조회수순");
            total = postService.getTotalWithSearch(search);
        } else if (filterType.equals("댓글 많은 순")) {
            pagination.setOrder("댓글 많은 순");
            total = postService.getTotalWithSearch(search);
        } else {
            total = 0;  // 잘못된 필터 타입 처리
        }

        pagination.setTotal(total);
        pagination.progress();

        List<PostDTO> posts = postService.getList(pagination, search);  // 필터에 맞는 게시글 목록 불러오기

        Map<String, Object> result = new HashMap<>();
        result.put("posts", posts);
        result.put("pagination", pagination);
        result.put("total", total);

        return result;
    }

    @GetMapping("/community-post-list")
    public List<PostDTO> goTocommunityPostList(Pagination pagination, Search search) {
        return postService.getList(pagination, search);
    }


    @GetMapping("/post-write")
    public String goToPostWrite(PostDTO postDTO) {
        return "community/post-write";
    }
    @PostMapping("/post-write")
    public RedirectView postWrite(PostDTO postDTO, RedirectAttributes redirectAttributes) {
        postDTO.setMemberId(2L);
        log.info("postTitle: {}", postDTO.getPostTitle());
        log.info("postContent: {}", postDTO.getPostContent());
        try {
            postService.write(postDTO.toVO());
            redirectAttributes.addFlashAttribute("message", "게시글이 성공적으로 등록되었습니다.");
            return new RedirectView("/community/community-post-list");
        } catch (Exception e) {
            log.error("게시글 등록 실패", e);
            redirectAttributes.addFlashAttribute("errorMessage", "게시글 등록에 실패했습니다.");
            return new RedirectView("/community/community-post-list");
        }
    }

    @GetMapping("/community-details/{id}")
    public String goToPostDetails(@PathVariable("id") Long postId) {
        return "/community/community-details";
    }

    // 게시글 상세 정보를 JSON 형식으로 반환 (fetch용)
    @GetMapping("/community-details-check/{id}")
    @ResponseBody
    public ResponseEntity<PostDTO> getPostDetails(@PathVariable("id") Long postId) {
        try {
            // 게시글의 상세 내용 조회
            Optional<PostDTO> post = postService.getById(postId);

            // 게시글이 없을 경우 404 Not Found 반환
            if (post.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(post.get());  // 게시글 존재시 반환
        } catch (Exception e) {
            log.error("Error fetching post details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // 서버 오류 발생 시
        }
    }

}



