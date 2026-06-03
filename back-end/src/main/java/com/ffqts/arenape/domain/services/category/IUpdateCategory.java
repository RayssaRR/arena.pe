package com.ffqts.arenape.domain.services.category;

import com.ffqts.arenape.domain.models.event.Category;

public interface IUpdateCategory {
    Category update(Long id, Category updatedCategory);
}
