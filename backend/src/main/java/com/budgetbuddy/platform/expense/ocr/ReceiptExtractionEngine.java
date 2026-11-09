package com.budgetbuddy.platform.expense.ocr;

import com.budgetbuddy.platform.expense.dto.ParsedReceiptDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ReceiptExtractionEngine {

    private static final Pattern DATE_PATTERN_1 = Pattern.compile("\\b(\\d{4})[-/.](\\d{1,2})[-/.](\\d{1,2})\\b");
    private static final Pattern DATE_PATTERN_2 = Pattern.compile("\\b(\\d{1,2})[-/.](\\d{1,2})[-/.](\\d{2,4})\\b");
    private static final Pattern TOTAL_PATTERN = Pattern.compile("(?i)(?:\\bgrand\\s*total\\b|(?<!sub)\\btotal\\b|\\bamount\\s*due\\b|\\bnet\\s*amount\\b)[:\\s]*[₹$€]?\\s*([0-9]+(?:\\.[0-9]{1,2})?)");
    private static final Pattern SUBTOTAL_PATTERN = Pattern.compile("(?i)(?:\\bsubtotal\\b|\\bsub\\s*total\\b)[:\\s]*[₹$€]?\\s*([0-9]+(?:\\.[0-9]{1,2})?)");
    private static final Pattern TAX_PATTERN = Pattern.compile("(?i)(?:\\btax\\b|\\bgst\\b|\\bvat\\b|\\bcgst\\b|\\bsgst\\b)[:\\s]*[₹$€]?\\s*([0-9]+(?:\\.[0-9]{1,2})?)");
    private static final Pattern LINE_ITEM_PATTERN = Pattern.compile("^(.+?)\\s+([0-9]+(?:\\.[0-9]{1,2})?)$");

    public ParsedReceiptDto parseOcrText(String rawText, BigDecimal confidence) {
        if (rawText == null || rawText.isBlank()) {
            return ParsedReceiptDto.builder()
                    .rawText("")
                    .confidence(BigDecimal.ZERO)
                    .warnings(List.of("OCR extracted empty text. Manual entry required."))
                    .build();
        }

        List<String> warnings = new ArrayList<>();
        String merchant = extractMerchant(rawText);
        LocalDate receiptDate = extractDate(rawText);
        BigDecimal total = extractRegexAmount(TOTAL_PATTERN, rawText);
        BigDecimal subtotal = extractRegexAmount(SUBTOTAL_PATTERN, rawText);
        BigDecimal tax = extractRegexAmount(TAX_PATTERN, rawText);

        List<ParsedReceiptDto.LineItemDto> lineItems = extractLineItems(rawText);

        if (total == null) {
            // Check if subtotal exists or sum of line items
            if (subtotal != null) {
                total = tax != null ? subtotal.add(tax) : subtotal;
            } else if (!lineItems.isEmpty()) {
                total = lineItems.stream()
                        .map(ParsedReceiptDto.LineItemDto::getTotalPrice)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
            }
        }

        if (total == null) {
            warnings.add("Total amount could not be reliably extracted from receipt text. Please verify manually.");
        }
        if (merchant == null || merchant.equalsIgnoreCase("Receipt") || merchant.isBlank()) {
            merchant = "Unknown Store / Merchant";
            warnings.add("Merchant name requires verification.");
        }
        if (receiptDate == null) {
            receiptDate = LocalDate.now();
            warnings.add("Receipt date was not detected. Defaulted to today's date.");
        }

        String predictedCategory = predictCategory(rawText, merchant);

        return ParsedReceiptDto.builder()
                .merchantName(merchant)
                .receiptDate(receiptDate)
                .totalAmount(total != null ? total.setScale(2, RoundingMode.HALF_UP) : BigDecimal.ZERO)
                .subtotal(subtotal)
                .taxAmount(tax)
                .tipAmount(BigDecimal.ZERO)
                .currency("INR")
                .predictedCategory(predictedCategory)
                .confidence(confidence != null ? confidence : new BigDecimal("75.00"))
                .rawText(rawText)
                .lineItems(lineItems)
                .warnings(warnings)
                .build();
    }

    private String extractMerchant(String text) {
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String clean = line.replaceAll("[^a-zA-Z0-9\\s&'-]", "").trim();
            if (clean.length() >= 3 && !clean.equalsIgnoreCase("TAX INVOICE") &&
                !clean.equalsIgnoreCase("CASH RECEIPT") && !clean.equalsIgnoreCase("BILL")) {
                return clean;
            }
        }
        return "Retail Store";
    }

    private LocalDate extractDate(String text) {
        Matcher m1 = DATE_PATTERN_1.matcher(text);
        if (m1.find()) {
            try {
                int y = Integer.parseInt(m1.group(1));
                int m = Integer.parseInt(m1.group(2));
                int d = Integer.parseInt(m1.group(3));
                return LocalDate.of(y, m, d);
            } catch (Exception ignored) {}
        }

        Matcher m2 = DATE_PATTERN_2.matcher(text);
        if (m2.find()) {
            try {
                int d = Integer.parseInt(m2.group(1));
                int m = Integer.parseInt(m2.group(2));
                int y = Integer.parseInt(m2.group(3));
                if (y < 100) y += 2000;
                return LocalDate.of(y, m, d);
            } catch (Exception ignored) {}
        }
        return null;
    }

    private BigDecimal extractRegexAmount(Pattern pattern, String text) {
        Matcher m = pattern.matcher(text);
        if (m.find()) {
            try {
                return new BigDecimal(m.group(1));
            } catch (Exception ignored) {}
        }
        return null;
    }

    private List<ParsedReceiptDto.LineItemDto> extractLineItems(String text) {
        List<ParsedReceiptDto.LineItemDto> items = new ArrayList<>();
        String[] lines = text.split("\\r?\\n");
        for (String line : lines) {
            String trimmed = line.trim();
            String lower = trimmed.toLowerCase();
            if (trimmed.length() > 5 && !lower.contains("total") && !lower.contains("subtotal") && !lower.contains("tax") && !lower.contains("gst")) {
                Matcher m = LINE_ITEM_PATTERN.matcher(trimmed);
                if (m.find()) {
                    String name = m.group(1).trim();
                    try {
                        BigDecimal price = new BigDecimal(m.group(2));
                        if (price.compareTo(BigDecimal.ZERO) > 0 && name.length() > 2) {
                            items.add(ParsedReceiptDto.LineItemDto.builder()
                                    .itemName(name)
                                    .quantity(BigDecimal.ONE)
                                    .unitPrice(price)
                                    .totalPrice(price)
                                    .build());
                        }
                    } catch (Exception ignored) {}
                }
            }
        }
        return items;
    }

    private String predictCategory(String text, String merchant) {
        String combined = (merchant + " " + text).toLowerCase();
        if (combined.contains("grocery") || combined.contains("mart") || combined.contains("supermarket") || combined.contains("milk") || combined.contains("vegetable")) {
            return "Groceries";
        }
        if (combined.contains("restaurant") || combined.contains("cafe") || combined.contains("coffee") || combined.contains("kitchen") || combined.contains("dining") || combined.contains("food")) {
            return "Food & Dining";
        }
        if (combined.contains("petrol") || combined.contains("fuel") || combined.contains("uber") || combined.contains("ola") || combined.contains("metro") || combined.contains("transport")) {
            return "Transport & Fuel";
        }
        if (combined.contains("pharmacy") || combined.contains("hospital") || combined.contains("medical") || combined.contains("clinic") || combined.contains("health")) {
            return "Healthcare & Medical";
        }
        if (combined.contains("power") || combined.contains("electricity") || combined.contains("water") || combined.contains("internet") || combined.contains("broadband")) {
            return "Utilities & Bills";
        }
        return "Shopping & Personal";
    }
}
