package com.budgetbuddy.platform.peace.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.peace.model.Opportunity;
import com.budgetbuddy.platform.peace.repository.OpportunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OpportunityService {

    private final OpportunityRepository opportunityRepository;

    @Transactional(readOnly = true)
    public List<Opportunity> getAllOpportunities() {
        return opportunityRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Opportunity getOpportunityById(Long id) {
        return opportunityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public List<Opportunity> filterOpportunities(String category, BigDecimal maxCapital, BigDecimal maxDailyHours, String riskLevel) {
        return opportunityRepository.filterOpportunities(category, maxCapital, maxDailyHours, riskLevel);
    }
}
