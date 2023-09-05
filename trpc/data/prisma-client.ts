import { PrismaClient, Restaurant } from '@prisma/client'
import { DishCategory, DishesByCategory, NewDish, NewDishCategory } from '@/types/dish.type'
import { Cart, Language, RestaurantId } from '@/types/order.type'

import { capitalize, getMultiLanguageStringProperty, mapDish } from '@/trpc/business-domain/dish-service'

const prismaClient = new PrismaClient()

export async function getDishesByCategoryFromRestaurant(restaurantId: RestaurantId, language: Language) {
  const categories = await getCategoriesByRestaurant(restaurantId)
  const categoryIds = structuredClone(categories).map((category) => category.id)
  const dishes = await getDishesByCategories(categoryIds)
  const dishesByCategory: DishesByCategory[] = categories.map((category) => ({
    category: {
      ...category,
      name: capitalize(getMultiLanguageStringProperty(category.name, language)),
    },
    dishes: dishes.filter((dish) => dish.categoryId == category.id).map((dish) => mapDish(dish, language)),
  }))
  return dishesByCategory
}

export async function getCategoriesByRestaurant(restaurantId: number) {
  return prismaClient.dishCategory.findMany({ where: { restaurantId } })
}

export async function getDishesByCategories(categories: number[]) {
  return prismaClient.dish.findMany({ where: { categoryId: { in: categories } } })
}

export async function createRestaurant(restaurantName: string): Promise<Restaurant> {
  return prismaClient.restaurant.create({ data: { name: restaurantName } })
}

export async function createOrder(input: Cart) {
  return prismaClient.order.create({ data: { ...input } })
}

// DISH CATEGORY CRUD //

export async function createDishCategory(input: NewDishCategory) {
  return prismaClient.dishCategory.create({
    data: {
      ...input,
    },
  })
}

export async function updateDishCategory(input: NewDishCategory): Promise<DishCategory> {
  const updatedDishCategory = await prismaClient.dishCategory.update({
    where: {
      id: input.id,
    },
    data: {
      ...input,
    },
  })
  return {
    ...updatedDishCategory,
    name: capitalize(getMultiLanguageStringProperty(updatedDishCategory.name, 'de')),
  }
}

export async function deleteDishCategory(dishCategoryId: number) {
  return prismaClient.dishCategory.delete({
    where: {
      id: dishCategoryId,
    },
  })
}

// DISH CRUD //

export async function createDish(newDish: NewDish) {
  const dish = await prismaClient.dish.create({
    data: {
      ...newDish,
    },
  })
  return mapDish(dish, 'de')
}

export async function updateDish(newDish: NewDish) {
  const dish = await prismaClient.dish.update({
    where: {
      id: newDish.id,
    },
    data: {
      ...newDish,
    },
  })
  return mapDish(dish, 'de')
}

export async function deleteDish(dishId: number) {
  return await prismaClient.dish.delete({
    where: {
      id: dishId,
    },
  })
}
