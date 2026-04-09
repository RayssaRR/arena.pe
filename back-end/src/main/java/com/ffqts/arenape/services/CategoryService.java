package com.ffqts.arenape.services;
import com.ffqts.arenape.models.Category;
import com.ffqts.arenape.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;


    public List<Category> getAllCategories() {
        return categoryRepository.findAll();

    }

        public Category createCategory (Category category){
            return categoryRepository.save(category);
        }


        public Category getCategoryById (Long id){
            return categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
        }

        public Category updateCategory (Long id, Category updatedCategory){
            var category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
            category.setTitle(updatedCategory.getTitle());
            category.setDescription(updatedCategory.getDescription());
            return categoryRepository.save(category);
        }

        public void deleteCategory (Long id){
            var category = categoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Categoria não encontrada"));
            categoryRepository.delete(category);

        }
}
