package com.budgetbuddy.platform.expense;

import com.budgetbuddy.platform.expense.dto.ParsedReceiptDto;
import com.budgetbuddy.platform.expense.ocr.ReceiptExtractionEngine;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class ReceiptExtractionEngineTest {

    private ReceiptExtractionEngine engine;

    @BeforeEach
    void setUp() {
        engine = new ReceiptExtractionEngine();
    }

    @Test
    @DisplayName("Should extract merchant, date, total, and line items from formatted receipt text")
    void shouldExtractStructuredReceipt() {
        String receiptText = "DMART SUPERMARKET\n" +
                "Date: 2026-11-05\n" +
                "Fortune Sunflower Oil  185.00\n" +
                "Basmati Rice 5kg       420.00\n" +
                "Aashirvaad Atta 10kg   395.00\n" +
                "Subtotal: 1000.00\n" +
                "GST Tax: 50.00\n" +
                "Total: 1050.00\n" +
                "Thank you for visiting!";

        ParsedReceiptDto parsed = engine.parseOcrText(receiptText, new BigDecimal("92.00"));

        assertEquals("DMART SUPERMARKET", parsed.getMerchantName());
        assertEquals(LocalDate.of(2026, 11, 5), parsed.getReceiptDate());
        assertEquals(new BigDecimal("1050.00"), parsed.getTotalAmount());
        assertEquals(new BigDecimal("1000.00"), parsed.getSubtotal());
        assertEquals(new BigDecimal("50.00"), parsed.getTaxAmount());
        assertEquals("Groceries", parsed.getPredictedCategory());
        assertEquals(3, parsed.getLineItems().size());
        assertTrue(parsed.getWarnings().isEmpty());
    }

    @Test
    @DisplayName("Should flag warnings when total is missing or empty")
    void shouldFlagWarningWhenEmpty() {
        ParsedReceiptDto parsed = engine.parseOcrText("", BigDecimal.ZERO);
        assertFalse(parsed.getWarnings().isEmpty());
    }
}
