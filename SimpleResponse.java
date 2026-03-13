package org.erp.vnoptic.responese;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SimpleResponse {
    private Long id;
    private String cid;
    private String name;
}
