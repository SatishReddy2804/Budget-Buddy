package com.budgetbuddy.platform.peace.repository;

import com.budgetbuddy.platform.peace.model.CareerRoadmap;
import com.budgetbuddy.platform.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerRoadmapRepository extends JpaRepository<CareerRoadmap, Long> {
    List<CareerRoadmap> findByUser(User user);
    Optional<CareerRoadmap> findFirstByUserAndStatusOrderByCreatedAtDesc(User user, String status);
}
