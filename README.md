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

### 4 Frontend
Simple project made with Vue to send a number of plates to kitchen's service

## Running the Project

You have to create a copy of each .env.example and .env.db with your credentials in each service main folder (frontend, kitchen, warehouse and market). Make sure ORIGIN variable in services's .env is pointing to your frontend URL, VITE_KITCHEN_API_BASE_URL variable in frontend project is pointing to kitchen's service URL, VITE_WAREHOUSE_API_BASE_URL variable in frontend project is pointing to warehouse's service URL and VITE_MARKET_API_BASE_URL variable in frontend project is pointing to market's service URL.

It is recommended to use Docker Compose to run all services together.  
To start the project, execute:

```bash
docker-compose up
```

Once project is running, you have to run migrations in each service container with the following command:
```bash
docker exec -it service_name sh
npm run migration
```

Once project is running, you have to run seeders in each service container with the following command:
```bash
docker exec -it service_name sh
npm run seed
```
Seeders order:
1. Seeders in warehouse service.
2. Seeders in kitchen service.

Frontend:
```bash
npm install
npm run dev
```


## Testing the project
In order to test all functionality, make the following request to kitchen's service:
```bash
curl --location 'http://localhost:3001/api/order' \
--header 'Content-Type: application/json' \
--data '{
    "plates": 4
}'
```

The attribute plates indicates the number of random dishes that will be created.

Once you send the request, an order is created in the orders table. This order triggers the creation of the specified number of dishes randomly. This process sends an event to the warehouse service, where entries are created in the order_recipe_ingredient table, and the warehouse service begins to allocate stock for each dish in the order.

If additional stock is required, a market event is triggered to purchase more of the needed ingredient for that recipe. Once the required quantity of the ingredient is available, a warehouse event checks if all ingredients for the recipe are ready. If so, it updates the recipe's status and sends a kitchen event to update the dish's status.

Once all dishes are ready, the order's status is updated to "done".

## Main Goal

The main objective is to provide a scalable solution that can:
- Receive orders with varying numbers of dishes.
- Assign a random recipe to each dish.
- Coordinate between services to manage ingredients, recipes, and purchases.

---
