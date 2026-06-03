package com.ffqts.arenape.application.category;

import com.ffqts.arenape.domain.services.category.IDeleteCategory;
import com.ffqts.arenape.infra.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DeleteCategoryService implements IDeleteCategory {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public void delete(Long id) {
        var category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        categoryRepository.delete(category);
    }

}
