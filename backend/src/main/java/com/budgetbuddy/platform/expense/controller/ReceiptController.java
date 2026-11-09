package com.budgetbuddy.platform.expense.controller;

import com.budgetbuddy.platform.common.dto.ApiResponse;
import com.budgetbuddy.platform.expense.dto.ParsedReceiptDto;
import com.budgetbuddy.platform.expense.model.Receipt;
import com.budgetbuddy.platform.expense.service.ReceiptService;
import com.budgetbuddy.platform.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/receipts")
@RequiredArgsConstructor
@Tag(name = "Receipt Scanner", description = "Smart OCR receipt scanning, document intelligence, and line item extraction")
public class ReceiptController {

    private final ReceiptService receiptService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload receipt image or PDF for OCR extraction and structured parsing")
    public ResponseEntity<ApiResponse<ParsedReceiptDto>> uploadReceipt(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file) {
        ParsedReceiptDto result = receiptService.uploadAndProcessReceipt(userPrincipal.getId(), file);
        return ResponseEntity.ok(ApiResponse.success("Receipt scanned and parsed successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get receipt metadata and raw OCR text by ID")
    public ResponseEntity<ApiResponse<Receipt>> getReceipt(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Receipt receipt = receiptService.getReceiptById(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(receipt));
    }
}
