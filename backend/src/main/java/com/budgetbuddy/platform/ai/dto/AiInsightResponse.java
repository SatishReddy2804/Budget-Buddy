package com.budgetbuddy.platform.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AiInsightResponse {
    private String title;
    private String summary;
    private List<String> observations;
    private List<String> recommendedActions;
    private String educationalDisclaimer;
    private String providerMode; // LIVE_AI, DETERMINISTIC_FALLBACK
}
