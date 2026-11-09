package com.budgetbuddy.platform.expense.ocr;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OcrResult {
    private String text;
    private BigDecimal confidence;
    private boolean successful;
    private String errorMessage;
}
