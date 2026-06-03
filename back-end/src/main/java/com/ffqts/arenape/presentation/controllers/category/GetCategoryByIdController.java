package com.ffqts.arenape.presentation.controllers.category;

import com.ffqts.arenape.domain.models.event.Category;
import com.ffqts.arenape.domain.services.category.IGetCategoryById;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class GetCategoryByIdController {

    @Autowired
    private IGetCategoryById service;

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id){
        return service.get(id);
    }

}
