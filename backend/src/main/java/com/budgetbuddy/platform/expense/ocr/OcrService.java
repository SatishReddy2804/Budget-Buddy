package com.budgetbuddy.platform.expense.ocr;

import java.io.File;

public interface OcrService {
    OcrResult extractText(File imageFile);
}
