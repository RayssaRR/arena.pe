package com.ffqts.arenape.application.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.IGetCategoryById;
import com.ffqts.arenape.infra.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GetCategoryByIdService implements IGetCategoryById {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Category get(Long id) {
        return categoryRepository.getReferenceById(id);
    }
}
