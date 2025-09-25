# Microservices Project

This project is a microservices-based solution designed to handle orders containing multiple dishes, where each dish is assigned a random recipe. The system is composed of three main services: **Kitchen**, **Warehouse**, and **Market**.

## Services Overview

### 1. Kitchen Service
Manages the core logic for preparing dishes and handling orders.

**Entities:**
- **Ingredients**: List and details of available ingredients.
- **Orders**: Customer orders containing one or more dishes.
- **Recipes**: Definitions of how dishes are prepared.
- **Recipe-Ingredients**: Mapping between recipes and their required ingredients.
- **Order-Dishes**: Dishes included in each order.

### 2. Warehouse Service
Handles inventory and ingredient management for fulfilling orders.

**Entities:**
- **Ingredients**: Stock and details of ingredients in the warehouse.
- **Order-Recipe-Ingredient**: Tracks ingredient requirements for each order and recipe.

### 3. Market Service
Manages the purchasing process for ingredients.

**Entities:**
- **Purchases**: Records of ingredient purchases.

## Running the Project

It is recommended to use Docker Compose to run all services together.  
To start the project, execute:

```bash
docker-compose up
```

Once project is running, you have to run migrations in each service with the following command:
```bash
npm run migration
```

Once project is running, you have to run seeders in each service with the following command:
```bash
npm run seed
```
Seeders order:
1. Seeders in warehouse service.
2. Seeders in kitchen service.

## Main Goal

The main objective is to provide a scalable solution that can:
- Receive orders with varying numbers of dishes.
- Assign a random recipe to each dish.
- Coordinate between services to manage ingredients, recipes, and purchases.

---
