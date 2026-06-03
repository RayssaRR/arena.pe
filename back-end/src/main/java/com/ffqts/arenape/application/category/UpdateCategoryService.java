package com.ffqts.arenape.application.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.IUpdateCategory;
import com.ffqts.arenape.infra.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UpdateCategoryService implements IUpdateCategory {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category update(Long id, Category updatedCategory) {
        var category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        category.setTitle(updatedCategory.getTitle());
        category.setDescription(updatedCategory.getDescription());
        return categoryRepository.save(category);
    }

}
