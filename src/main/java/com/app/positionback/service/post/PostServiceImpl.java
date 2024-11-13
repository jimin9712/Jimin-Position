package com.app.positionback.service.post;

import com.app.positionback.domain.post.PostDTO;
import com.app.positionback.domain.post.PostVO;
import com.app.positionback.repository.post.PostDAO;
import com.app.positionback.utill.Pagination;
import com.app.positionback.utill.Search;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostServiceImpl implements PostService {

    private final PostDAO postDAO;

    @Override
    public void write(PostVO postVO) {
        postDAO.save(postVO);
    }

    @Override
    public List<PostDTO> getList(Pagination pagination, Search search) {
        if (search.getKeyword() != null && !search.getKeyword().isEmpty()) {
            int totalPosts = postDAO.getTotalWithSearch(search);
            pagination.setTotal(totalPosts);
            pagination.progress();
            log.debug("Total posts with search: {}", totalPosts);
        }
        List<PostDTO> posts = postDAO.findAll(pagination, search);
        log.debug("Fetched posts: {}", posts);
        return posts;
    }

    @Override
    public List<PostDTO> getFilterList(Pagination pagination, Search search) {
        // 필터만 적용된 경우 총 게시글 수를 가져옴
        int totalPosts = postDAO.findCount(); // 전체 게시글 수
        pagination.setTotal(totalPosts);
        pagination.progress();
        List<PostDTO> posts = postDAO.findFilterAll(pagination, search);
        log.debug("Fetched filtered posts: {}", posts);
        return posts;
    }

    @Override
    public Optional<PostDTO> getById(Long id) {
        postDAO.incrementReadCount(id);
        return postDAO.findById(id);
    }

    @Override
    public void update(PostVO postVO) {
        postDAO.update(postVO);
    }

    @Override
    public void delete(Long id) {
        postDAO.delete(id);
    }

    @Override
    public int getTotal() {
        return postDAO.findCount();
    }

    @Override
    public int getTotalWithSearch(Search search) {
        return postDAO.getTotalWithSearch(search);
    }

}