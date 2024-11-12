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

import java.util.List;
import java.util.Optional;

@Controller
@RequestMapping("/community")
@RequiredArgsConstructor
@Slf4j
public class PostController {
    private final PostService postService;

    @GetMapping("/community-post-list-check")
    @ResponseBody
    public PostDTO getPostList(Pagination pagination, Search search,
                               @RequestParam(required = false) String query,
                               @RequestParam(required = false) String filterType,
                               @RequestParam(required = false, defaultValue = "1") int page) {
        // 검색어 길이 제한
        if (query != null && query.length() > 10) {
            throw new IllegalArgumentException("검색어가 너무 깁니다.");
        }

        search.setKeyword(query);
        pagination.setPage(page);

        // 필터 타입에 따라 정렬 조건 설정
        if (filterType == null || filterType.equals("최신순")) {
            pagination.setOrder("최신순");
        } else if (filterType.equals("조회수순")) {
            pagination.setOrder("조회수순");
        } else if (filterType.equals("댓글 많은 순")) {
            pagination.setOrder("댓글 많은 순");
        } else {
            pagination.setOrder("최신순"); // 기본값 설정
        }

        int total = 0;
        List<PostDTO> posts = List.of();

        boolean isSearch = search.getKeyword() != null && !search.getKeyword().isEmpty();

        PostDTO response = new PostDTO();

        if (isSearch) {
            total = postService.getTotalWithSearch(search);
            posts = postService.getList(pagination, search);
            response.setTotal(total);
            response.setPagination(pagination);
        } else if (filterType != null && (filterType.equals("최신순") || filterType.equals("조회수순") || filterType.equals("댓글 많은 순"))) {
            posts = postService.getFilterList(pagination, search);
            response.setPagination(pagination);
        } else {

            posts = postService.getFilterList(pagination, search);
            response.setPagination(pagination);
        }

        response.setPosts(posts);

        log.debug("Total: {}", total);
        log.debug("Pagination: {}", pagination);
        log.debug("Posts: {}", posts);

        return response;
    }

    @GetMapping("/community-post-list")
    public String goToCommunityPostList() {
        return "community/community-post-list";
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

            Optional<PostDTO> post = postService.getById(postId);

            // 게시글이 없을 경우 404 출력
            if (post.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(post.get());
        } catch (Exception e) {
            log.error("Error fetching post details", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
