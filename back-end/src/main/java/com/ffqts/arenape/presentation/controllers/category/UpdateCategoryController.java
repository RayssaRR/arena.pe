package com.ffqts.arenape.presentation.controllers.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.IUpdateCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class UpdateCategoryController {

    @Autowired
    private IUpdateCategory service;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return service.update(id, category);
    }

}
