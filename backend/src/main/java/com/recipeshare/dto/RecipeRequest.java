package com.recipeshare.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RecipeRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String ingredients;

    @NotBlank
    private String steps;

    private Integer cookTimeMinutes;

    private String imageUrl;
}
