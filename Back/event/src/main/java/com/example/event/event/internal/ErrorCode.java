package com.example.event.event.internal;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    BAD_CREDENTIALS(HttpStatus.FORBIDDEN),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED),
    AUTHENTICATION_REQUIRED(HttpStatus.UNAUTHORIZED),
    INVALID_ENDPOINT(HttpStatus.FORBIDDEN),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR),
    VALIDATION_FAILED(HttpStatus.BAD_REQUEST),
    EMAIL_ALREADY_TAKEN(HttpStatus.BAD_REQUEST),
    OLD_PASSWORD_INCORRECT(HttpStatus.BAD_REQUEST),
    INVALID_CHALLENGE(HttpStatus.BAD_REQUEST),
    MISSING_CHALLENGE(HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND),
    DATA_INTEGRITY_VIOLATION(HttpStatus.INTERNAL_SERVER_ERROR),
    MAIL_SENDING_FAILED(HttpStatus.INTERNAL_SERVER_ERROR);

    private final HttpStatusCode status;

    ErrorCode(HttpStatusCode status) {
        this.status = status;
    }

}
