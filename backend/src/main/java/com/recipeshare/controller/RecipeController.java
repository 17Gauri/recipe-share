package com.recipeshare.controller;

import com.recipeshare.dto.RecipeResponse;
import com.recipeshare.model.Recipe;
import com.recipeshare.model.User;
import com.recipeshare.repository.RecipeRepository;
import com.recipeshare.repository.UserRepository;
import com.recipeshare.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @Autowired
    private FileStorageService fileStorageService;

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
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Recipe not found"));
        }

        return ResponseEntity.ok(
                RecipeResponse.fromEntity(recipe)
        );
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRecipe(
            @RequestParam String title,
            @RequestParam String ingredients,
            @RequestParam String steps,
            @RequestParam(required = false) Integer cookTimeMinutes,
            @RequestParam(required = false) MultipartFile image,
            Authentication authentication
    ) throws IOException {

        System.out.println("AUTH = " + authentication);

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please login first"
                    ));
        }

        System.out.println("USER = " + authentication.getName());

        User user = userRepository.findByUsername(
                authentication.getName()
        ).orElseThrow(() ->
                new RuntimeException(
                        "Authenticated user not found"
                )
        );

        Recipe recipe = new Recipe();
        recipe.setTitle(title);
        recipe.setIngredients(ingredients);
        recipe.setSteps(steps);
        recipe.setCookTimeMinutes(cookTimeMinutes);

        if (image != null && !image.isEmpty()) {
            String fileName =
                    fileStorageService.saveFile(image);
            recipe.setImageName(fileName);
        }

        recipe.setUser(user);
        recipe.setCreatedAt(LocalDateTime.now());

        Recipe saved = recipeRepository.save(recipe);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(RecipeResponse.fromEntity(saved));
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> updateRecipe(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String ingredients,
            @RequestParam String steps,
            @RequestParam(required = false)
            Integer cookTimeMinutes,
            @RequestParam(required = false)
            MultipartFile image,
            Authentication authentication
    ) throws IOException {

        Recipe recipe =
                recipeRepository.findById(id).orElse(null);

        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Recipe not found"
                    ));
        }

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please login first"
                    ));
        }

        if (!recipe.getUser()
                .getUsername()
                .equals(authentication.getName())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You can only edit your own recipes"
                    ));
        }

        recipe.setTitle(title);
        recipe.setIngredients(ingredients);
        recipe.setSteps(steps);
        recipe.setCookTimeMinutes(cookTimeMinutes);

        if (image != null && !image.isEmpty()) {
            String fileName =
                    fileStorageService.saveFile(image);
            recipe.setImageName(fileName);
        }

        Recipe updated =
                recipeRepository.save(recipe);

        return ResponseEntity.ok(
                RecipeResponse.fromEntity(updated)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecipe(
            @PathVariable Long id,
            Authentication authentication
    ) {

        Recipe recipe =
                recipeRepository.findById(id).orElse(null);

        if (recipe == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Recipe not found"
                    ));
        }

        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "message",
                            "Please login first"
                    ));
        }

        if (!recipe.getUser()
                .getUsername()
                .equals(authentication.getName())) {

            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of(
                            "message",
                            "You can only delete your own recipes"
                    ));
        }

        recipeRepository.delete(recipe);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Recipe deleted"
                )
        );
    }
}