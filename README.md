# Microservices-Based Order Management System

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

## Prerequisites
- Docker and docker-compose
- Node: v22.19.0

## Running the Project
You have to create a copy of each .env.example and .env.db with your credentials in each service main folder (frontend, kitchen, warehouse and market). Make sure ORIGIN variable in services's .env is pointing to your frontend URL, VITE_KITCHEN_API_BASE_URL variable in frontend project is pointing to kitchen's service URL, VITE_WAREHOUSE_API_BASE_URL variable in frontend project is pointing to warehouse's service URL and VITE_MARKET_API_BASE_URL variable in frontend project is pointing to market's service URL.

### Environment configuration
Copy environment templates in each service directory
```bash
cp .env.example .env
cp .env.db.example .env.db
```

### Configure Service URLs
- Set ORIGIN in each service's .env to your frontend URL
- Configure frontend API endpoints:
    - VITE_KITCHEN_API_BASE_URL → Kitchen service URL
    - VITE_WAREHOUSE_API_BASE_URL → Warehouse service URL
    - VITE_MARKET_API_BASE_URL → Market service URL

Use Docker Compose to run all services together.  
To start the project, execute:

Development:
```bash
docker-compose -f docker-compose.yml up
```

Production:
```bash
docker-compose -f docker-compose.prod.yml up
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
Each microservice includes comprehensive tests:
```bash
npm run test
```

In order to test all functionality, make the following request to kitchen's service:
```bash
curl --location 'http://localhost:3001/api/order' \
--header 'Content-Type: application/json' \
--data '{
    "plates": 4
}'
```

The attribute plates indicates the number of random dishes that will be created.

## Worflow explanation
- Order Creation: Request creates an order with specified number of random dishes

- Recipe Assignment: Each dish receives a randomly assigned recipe

- Inventory Check: Warehouse service processes ingredient requirements

- Procurement: Market service automatically purchases insufficient ingredients

- Preparation: Kitchen updates dish status as ingredients become available

- Completion: Order status updates to "done" when all dishes are ready

## System Workflow
- Order Reception → Kitchen service receives order with dish count

- Recipe Assignment → Random recipes assigned to each dish

- Inventory Allocation → Warehouse reserves required ingredients

- Auto-Procurement → Market purchases missing ingredients

- Preparation Tracking → Real-time status updates across services

- Order Fulfillment → Complete order delivery

## Main Goal

The main objective is to provide a scalable solution that can:
- Receive orders with varying numbers of dishes.
- Assign a random recipe to each dish.
- Coordinate between services to manage ingredients, recipes, and purchases.

---
