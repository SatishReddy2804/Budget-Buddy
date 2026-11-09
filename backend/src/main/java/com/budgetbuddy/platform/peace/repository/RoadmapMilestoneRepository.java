package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.CareerRoadmap;
import com.budgetbuddy.platform.peace.model.RoadmapMilestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapMilestoneRepository extends JpaRepository<RoadmapMilestone, Long> {
    List<RoadmapMilestone> findByRoadmapOrderByPhaseNumberAsc(CareerRoadmap roadmap);
}
