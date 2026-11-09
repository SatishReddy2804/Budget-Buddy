package com.budgetbuddy.platform;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BudgetBuddyApplication {

    public static void main(String[] args) {
        SpringApplication.run(BudgetBuddyApplication.class, args);
    }
}
