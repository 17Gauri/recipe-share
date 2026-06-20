package com.recipeshare.dto;

import com.recipeshare.model.Recipe;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class RecipeResponse {
    private Long id;
    private String title;
    private String ingredients;
    private String steps;
    private Integer cookTimeMinutes;
    private String imageUrl;
    private String authorUsername;
    private LocalDateTime createdAt;

    public static RecipeResponse fromEntity(Recipe recipe) {
        return new RecipeResponse(
                recipe.getId(),
                recipe.getTitle(),
                recipe.getIngredients(),
                recipe.getSteps(),
                recipe.getCookTimeMinutes(),
                recipe.getImageUrl(),
                recipe.getUser().getUsername(),
                recipe.getCreatedAt()
        );
    }
}
