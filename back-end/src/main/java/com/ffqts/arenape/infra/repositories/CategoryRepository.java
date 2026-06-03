package com.ffqts.arenape.infra.repositories;

import com.ffqts.arenape.domain.models.event.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
