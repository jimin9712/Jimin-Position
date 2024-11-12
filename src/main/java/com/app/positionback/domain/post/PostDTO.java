package com.app.positionback.domain.post;

import com.app.positionback.utill.Pagination;
import lombok.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Getter @Setter @ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    @EqualsAndHashCode.Include
    private Long id;
    private Long memberId;
    private String postTitle;
    private String postContent;
    private int postReadCount;
    private String createdDate;
    private String updatedDate;
    private Integer postReplyCount;


    private List<PostDTO> posts;
    private Pagination pagination;
    private Integer total;

    public PostVO toVO() {
        return new PostVO(id, memberId, postTitle, postContent, postReadCount, createdDate, updatedDate);
    }
}
