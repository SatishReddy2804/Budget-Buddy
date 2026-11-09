package com.budgetbuddy.platform.peace.engine;

import com.budgetbuddy.platform.peace.dto.LocationComparisonDto;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Component
public class LocationIntelligenceEngine {

    public LocationComparisonDto compareLocations(String userCity, boolean willingToRelocate, BigDecimal expectedIncome) {
        List<LocationComparisonDto.CityMetric> list = new ArrayList<>();

        BigDecimal income = (expectedIncome != null && expectedIncome.compareTo(BigDecimal.ZERO) > 0)
                ? expectedIncome
                : new BigDecimal("45000.00");

        // Remote
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Remote (Work from Home)")
                .state("Any")
                .tier("Tier 0 / Distributed")
                .averageMonthlyRent(BigDecimal.ZERO)
                .monthlyLivingCost(new BigDecimal("8000.00"))
                .estimatedRelocationCost(BigDecimal.ZERO)
                .medianEntryTechSalary(new BigDecimal("40000.00"))
                .medianSeniorSalary(new BigDecimal("120000.00"))
                .projectedNetMonthlySavings(income.subtract(new BigDecimal("8000.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("Software Engineering, Cloud, Tech Support, AI Workflows, Content")
                .suitabilityReason("Zero relocation expense and minimal living costs maximize net monthly savings and work-life flexibility.")
                .isRemote(true)
                .build());

        // Eluru
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Eluru")
                .state("Andhra Pradesh")
                .tier("Tier 3")
                .averageMonthlyRent(new BigDecimal("6000.00"))
                .monthlyLivingCost(new BigDecimal("9000.00"))
                .estimatedRelocationCost(new BigDecimal("5000.00"))
                .medianEntryTechSalary(new BigDecimal("22000.00"))
                .medianSeniorSalary(new BigDecimal("55000.00"))
                .projectedNetMonthlySavings(income.subtract(new BigDecimal("15000.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("Agriculture Tech, Local Retail Digitization, Government Exam Hub, SMB Services")
                .suitabilityReason("Low living costs make it an ideal foundation base for remote upskilling or local compliance consulting.")
                .isRemote(false)
                .build());

        // Vijayawada
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Vijayawada")
                .state("Andhra Pradesh")
                .tier("Tier 2")
                .averageMonthlyRent(new BigDecimal("9500.00"))
                .monthlyLivingCost(new BigDecimal("12000.00"))
                .estimatedRelocationCost(new BigDecimal("8000.00"))
                .medianEntryTechSalary(new BigDecimal("28000.00"))
                .medianSeniorSalary(new BigDecimal("75000.00"))
                .projectedNetMonthlySavings(income.subtract(new BigDecimal("21500.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("Commercial Hub, IT Parks, Logistics, Healthcare, Education")
                .suitabilityReason("Strategic regional hub with expanding IT infrastructure and balanced urban living expenses.")
                .isRemote(false)
                .build());

        // Visakhapatnam
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Visakhapatnam")
                .state("Andhra Pradesh")
                .tier("Tier 2")
                .averageMonthlyRent(new BigDecimal("11000.00"))
                .monthlyLivingCost(new BigDecimal("13000.00"))
                .estimatedRelocationCost(new BigDecimal("10000.00"))
                .medianEntryTechSalary(new BigDecimal("32000.00"))
                .medianSeniorSalary(new BigDecimal("90000.00"))
                .projectedNetMonthlySavings(income.subtract(new BigDecimal("24000.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("Fintech Valley, IT SEZs, Maritime, Pharma, Technology Startups")
                .suitabilityReason("Fastest-growing tech hub in Andhra Pradesh with prominent IT SEZ presence and coastal quality of life.")
                .isRemote(false)
                .build());

        // Hyderabad
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Hyderabad")
                .state("Telangana")
                .tier("Tier 1")
                .averageMonthlyRent(new BigDecimal("16000.00"))
                .monthlyLivingCost(new BigDecimal("16000.00"))
                .estimatedRelocationCost(new BigDecimal("18000.00"))
                .medianEntryTechSalary(new BigDecimal("45000.00"))
                .medianSeniorSalary(new BigDecimal("150000.00"))
                .projectedNetMonthlySavings(income.multiply(new BigDecimal("1.25")).subtract(new BigDecimal("32000.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("HITEC City Tech Hub, Global Capability Centers (GCCs), AI, BioTech, Product Startups")
                .suitabilityReason("Massive density of enterprise MNCs and GCCs offering high wage growth and competitive career progression.")
                .isRemote(false)
                .build());

        // Bengaluru
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Bengaluru")
                .state("Karnataka")
                .tier("Tier 1")
                .averageMonthlyRent(new BigDecimal("22000.00"))
                .monthlyLivingCost(new BigDecimal("18000.00"))
                .estimatedRelocationCost(new BigDecimal("25000.00"))
                .medianEntryTechSalary(new BigDecimal("55000.00"))
                .medianSeniorSalary(new BigDecimal("180000.00"))
                .projectedNetMonthlySavings(income.multiply(new BigDecimal("1.40")).subtract(new BigDecimal("40000.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("Venture-backed Startups, Global Tech Giants, DeepTech, AI R&D, Fintech")
                .suitabilityReason("Premier startup and engineering capital; higher initial cost of living is offset by steep upward salary trajectory.")
                .isRemote(false)
                .build());

        // Chennai
        list.add(LocationComparisonDto.CityMetric.builder()
                .cityName("Chennai")
                .state("Tamil Nadu")
                .tier("Tier 1")
                .averageMonthlyRent(new BigDecimal("14000.00"))
                .monthlyLivingCost(new BigDecimal("14000.00"))
                .estimatedRelocationCost(new BigDecimal("15000.00"))
                .medianEntryTechSalary(new BigDecimal("38000.00"))
                .medianSeniorSalary(new BigDecimal("130000.00"))
                .projectedNetMonthlySavings(income.multiply(new BigDecimal("1.15")).subtract(new BigDecimal("28000.00")).setScale(2, RoundingMode.HALF_UP))
                .keyIndustries("SaaS Capital of India (OMR Corridor), AutoTech, Hardware, Cloud Services")
                .suitabilityReason("Unrivaled B2B SaaS ecosystem with balanced rental market and consistent tech career opportunities.")
                .isRemote(false)
                .build());

        return LocationComparisonDto.builder()
                .userCity(userCity != null ? userCity : "Not Specified")
                .willingToRelocate(willingToRelocate)
                .cityComparisons(list)
                .build();
    }
}
