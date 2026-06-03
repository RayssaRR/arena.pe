package com.ffqts.arenape.presentation.controllers.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.IGetAllCategories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class GetAllCategoriesController {

    @Autowired
    private IGetAllCategories service;

    @GetMapping
    public List<Category> getAllCategories() {
        return service.get();
    }

}
