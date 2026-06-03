package com.ffqts.arenape.presentation.controllers.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.ICreateCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/categories")
public class CreateCategoryController {

    @Autowired
    private ICreateCategory service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public Category createCategory(@RequestBody Category category){
        return service.create(category);
    }

}
