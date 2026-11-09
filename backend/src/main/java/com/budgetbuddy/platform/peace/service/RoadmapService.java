package com.budgetbuddy.platform.peace.service;

import com.budgetbuddy.platform.common.exception.ResourceNotFoundException;
import com.budgetbuddy.platform.peace.model.CareerRoadmap;
import com.budgetbuddy.platform.peace.model.Opportunity;
import com.budgetbuddy.platform.peace.model.RoadmapMilestone;
import com.budgetbuddy.platform.peace.repository.CareerRoadmapRepository;
import com.budgetbuddy.platform.peace.repository.OpportunityRepository;
import com.budgetbuddy.platform.peace.repository.RoadmapMilestoneRepository;
import com.budgetbuddy.platform.user.model.User;
import com.budgetbuddy.platform.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final CareerRoadmapRepository roadmapRepository;
    private final RoadmapMilestoneRepository milestoneRepository;
    private final OpportunityRepository opportunityRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CareerRoadmap getActiveRoadmap(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        return roadmapRepository.findFirstByUserAndStatusOrderByCreatedAtDesc(user, "ACTIVE")
                .orElse(null);
    }

    @Transactional
    public CareerRoadmap createOrUpdateRoadmap(Long userId, Long opportunityId, String customTitle) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Opportunity opp = opportunityRepository.findById(opportunityId)
                .orElseThrow(() -> new ResourceNotFoundException("Opportunity not found: " + opportunityId));

        String title = customTitle != null && !customTitle.isBlank() ? customTitle : opp.getTitle() + " Mastery Roadmap";

        CareerRoadmap roadmap = CareerRoadmap.builder()
                .user(user)
                .opportunity(opp)
                .title(title)
                .overallPhase("FOUNDATION")
                .totalPhases(5)
                .currentPhase(1)
                .startDate(LocalDate.now())
                .targetEndDate(LocalDate.now().plusWeeks(opp.getTimeToFirstRevenueWeeks() + opp.getLearningCurveWeeks()))
                .status("ACTIVE")
                .build();

        roadmap = roadmapRepository.save(roadmap);

        // Generate 5 structured milestones
        List<RoadmapMilestone> milestones = List.of(
                RoadmapMilestone.builder()
                        .roadmap(roadmap)
                        .phaseNumber(1)
                        .title("Phase 1: Environment & Foundational Knowledge")
                        .description("Master core theory, tooling, required frameworks, and workspace setup.")
                        .targetCompletionDays(14)
                        .isCompleted(false)
                        .build(),
                RoadmapMilestone.builder()
                        .roadmap(roadmap)
                        .phaseNumber(2)
                        .title("Phase 2: Practical Exercises & Proof of Skill")
                        .description("Build 3 miniature projects or practical workflows showcasing hands-on competence.")
                        .targetCompletionDays(21)
                        .isCompleted(false)
                        .build(),
                RoadmapMilestone.builder()
                        .roadmap(roadmap)
                        .phaseNumber(3)
                        .title("Phase 3: Portfolio Artifact & Value Proposition")
                        .description("Produce a public case study, repository, or service landing page.")
                        .targetCompletionDays(14)
                        .isCompleted(false)
                        .build(),
                RoadmapMilestone.builder()
                        .roadmap(roadmap)
                        .phaseNumber(4)
                        .title("Phase 4: Market Outreach & Initial Engagements")
                        .description("Pitch 15 prospective businesses or apply to verified entry positions.")
                        .targetCompletionDays(21)
                        .isCompleted(false)
                        .build(),
                RoadmapMilestone.builder()
                        .roadmap(roadmap)
                        .phaseNumber(5)
                        .title("Phase 5: First Revenue & Scaling Retainers")
                        .description("Secure initial compensation, collect testimonial/review, and optimize monthly process.")
                        .targetCompletionDays(30)
                        .isCompleted(false)
                        .build()
        );

        milestoneRepository.saveAll(milestones);
        roadmap.setMilestones(new ArrayList<>(milestones));
        return roadmap;
    }
}
