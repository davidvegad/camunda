package com.bpmnengine.bpmn_engine_core.dto;

public class UserIdDto {
    private String userId;

    public UserIdDto() {
    }

    public UserIdDto(String userId) {
        this.userId = userId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
