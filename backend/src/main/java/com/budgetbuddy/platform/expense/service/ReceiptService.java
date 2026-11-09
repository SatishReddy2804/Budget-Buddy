package com.budgetbuddy.platform.expense.service;

import com.budgetbuddy.platform.common.exception.BadRequestException;
import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.expense.dto.ParsedReceiptDto;
import com.budgetbuddy.platform.expense.model.Receipt;
import com.budgetbuddy.platform.expense.model.ReceiptLineItem;
import com.budgetbuddy.platform.expense.ocr.OcrResult;
import com.budgetbuddy.platform.expense.ocr.OcrService;
import com.budgetbuddy.platform.expense.ocr.ReceiptExtractionEngine;
import com.budgetbuddy.platform.expense.repository.ReceiptLineItemRepository;
import com.budgetbuddy.platform.expense.repository.ReceiptRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReceiptService {

    private static final Logger log = LoggerFactory.getLogger(ReceiptService.class);

    private final ReceiptRepository receiptRepository;
    private final ReceiptLineItemRepository lineItemRepository;
    private final UserRepository userRepository;
    private final OcrService ocrService;
    private final ReceiptExtractionEngine extractionEngine;

    @Value("${application.upload.dir:uploads/receipts}")
    private String uploadDir;

    @Transactional
    public ParsedReceiptDto uploadAndProcessReceipt(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a receipt image to upload");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/") && !contentType.equals("application/pdf"))) {
            throw new BadRequestException("Invalid file format. Please upload a JPEG, PNG, WEBP image or PDF");
        }

        if (file.getSize() > 15 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds 15MB limit");
        }

        try {
            Path targetDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
            if (!Files.exists(targetDirectory)) {
                Files.createDirectories(targetDirectory);
            }

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "receipt.jpg";
            String extension = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";
            String storedFileName = UUID.randomUUID() + extension;
            Path targetPath = targetDirectory.resolve(storedFileName);

            file.transferTo(targetPath.toFile());

            // Run OCR
            OcrResult ocrResult = ocrService.extractText(targetPath.toFile());

            // Run structured parser
            ParsedReceiptDto parsed = extractionEngine.parseOcrText(ocrResult.getText(), ocrResult.getConfidence());

            Receipt receipt = Receipt.builder()
                    .user(user)
                    .originalFileName(originalName)
                    .storedFilePath(targetPath.toString())
                    .mimeType(contentType)
                    .fileSizeBytes(file.getSize())
                    .ocrStatus(ocrResult.isSuccessful() ? "COMPLETED" : "FAILED")
                    .rawOcrText(ocrResult.getText())
                    .ocrConfidence(ocrResult.getConfidence())
                    .merchantName(parsed.getMerchantName())
                    .receiptDate(parsed.getReceiptDate())
                    .totalAmount(parsed.getTotalAmount())
                    .subtotal(parsed.getSubtotal())
                    .taxAmount(parsed.getTaxAmount())
                    .tipAmount(parsed.getTipAmount())
                    .currency(parsed.getCurrency())
                    .status("UPLOADED")
                    .build();

            receipt = receiptRepository.save(receipt);

            // Save line items
            List<ReceiptLineItem> items = new ArrayList<>();
            for (ParsedReceiptDto.LineItemDto itemDto : parsed.getLineItems()) {
                ReceiptLineItem item = ReceiptLineItem.builder()
                        .receipt(receipt)
                        .itemName(itemDto.getItemName())
                        .quantity(itemDto.getQuantity())
                        .unitPrice(itemDto.getUnitPrice())
                        .totalPrice(itemDto.getTotalPrice())
                        .predictedCategory(itemDto.getPredictedCategory())
                        .build();
                items.add(item);
            }
            lineItemRepository.saveAll(items);
            receipt.setLineItems(items);

            parsed.setReceiptId(receipt.getId());
            return parsed;

        } catch (IOException ex) {
            log.error("Failed to store uploaded receipt file", ex);
            throw new BadRequestException("Failed to upload and store receipt file: " + ex.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public Receipt getReceiptById(Long userId, Long receiptId) {
        Receipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Receipt not found: " + receiptId));

        if (!receipt.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Receipt not found");
        }
        return receipt;
    }
}
