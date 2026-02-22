# Lotto & Teachable Machine App

## Overview

This is a multi-functional web application that features a "Lotto Flash" number generator and a "Teachable Machine" model integration through a modern tabbed interface.

## Features

### Lotto Flash
*   **Core:** Generates 6 unique random numbers between 1 and 45.
*   **Visuals:**
    *   "Flashy" and modern dark-themed UI.
    *   Dynamic, animated background (gradient/mesh).
    *   3D-styled lottery balls with realistic shadows and highlights.
    *   Color-coded balls based on number ranges.
    *   Smooth entrance animations for numbers.
    *   Interactive, glowing button with hover effects.

### Teachable Machine Integration
*   **Tabbed Navigation:** A smooth, responsive tab system to switch between applications.
*   **Model Viewer:** A dedicated tab containing an iframe to connect to a Teachable Machine model.

## Current Plan

*   **index.html**: 
    *   Introduce a tab navigation bar.
    *   Wrap current lotto content in a tab pane.
    *   Create a second tab pane for the Teachable Machine iframe.
*   **style.css**: 
    *   Style the tab navigation with modern, interactive effects.
    *   Ensure the iframe container is responsive and fits the theme.
    *   Maintain the existing "flashy" design for the lotto section.
*   **main.js**: 
    *   Implement logic to switch between tabs (active/inactive states).
    *   Maintain the lottery number generation logic.
