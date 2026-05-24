package com.ffqts.arenape.repositories;

import com.ffqts.arenape.models.event.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
