package com.ffqts.arenape.application.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.IGetAllCategories;
import com.ffqts.arenape.infra.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GetAllCategoriesService implements IGetAllCategories {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public List<Category> get() {
        return categoryRepository.findAll();
    }

}
