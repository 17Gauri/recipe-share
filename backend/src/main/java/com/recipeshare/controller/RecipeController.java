package com.recipeshare.controller;

import com.recipeshare.dto.RecipeRequest;
import com.recipeshare.dto.RecipeResponse;
import com.recipeshare.model.Recipe;
import com.recipeshare.model.User;
import com.recipeshare.repository.RecipeRepository;
import com.recipeshare.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<RecipeResponse> getAllRecipes() {
        return recipeRepository.findAll()
                .stream()
                .map(RecipeResponse::fromEntity)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRecipe(@PathVariable Long id) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Recipe not found"));
        }
        return ResponseEntity.ok(RecipeResponse.fromEntity(recipe));
    }

    @PostMapping
    public ResponseEntity<?> createRecipe(@Valid @RequestBody RecipeRequest request, Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Recipe recipe = new Recipe();
        recipe.setTitle(request.getTitle());
        recipe.setIngredients(request.getIngredients());
        recipe.setSteps(request.getSteps());
        recipe.setCookTimeMinutes(request.getCookTimeMinutes());
        recipe.setImageUrl(request.getImageUrl());
        recipe.setUser(user);
        recipe.setCreatedAt(LocalDateTime.now());

        Recipe saved = recipeRepository.save(recipe);
        return ResponseEntity.status(HttpStatus.CREATED).body(RecipeResponse.fromEntity(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRecipe(@PathVariable Long id, @Valid @RequestBody RecipeRequest request, Authentication authentication) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Recipe not found"));
        }
        if (!recipe.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You can only edit your own recipes"));
        }

        recipe.setTitle(request.getTitle());
        recipe.setIngredients(request.getIngredients());
        recipe.setSteps(request.getSteps());
        recipe.setCookTimeMinutes(request.getCookTimeMinutes());
        recipe.setImageUrl(request.getImageUrl());

        Recipe updated = recipeRepository.save(recipe);
        return ResponseEntity.ok(RecipeResponse.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(@PathVariable Long id, Authentication authentication) {
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Recipe not found"));
        }
        if (!recipe.getUser().getUsername().equals(authentication.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "You can only delete your own recipes"));
        }

        recipeRepository.delete(recipe);
        return ResponseEntity.ok(Map.of("message", "Recipe deleted"));
    }
}