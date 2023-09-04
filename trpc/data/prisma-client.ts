import { PrismaClient, Restaurant } from '@prisma/client'
import { DishCategory, DishesByCategory, NewDishCategory, Nutrition } from '@/types/dish.type'
import { Cart, Language, RestaurantId } from '@/types/order.type'

import {
  capitalize,
  getIngredients,
  getMultiLanguageArrayProperty,
  getMultiLanguageStringProperty,
} from '@/trpc/business-domain/dish-service'

const prismaClient = new PrismaClient()

export async function getCategoriesByRestaurant(restaurantId: number) {
  return prismaClient.dishCategory.findMany({ where: { restaurantId } })
}

export async function getDishesByCategories(categories: number[]) {
  return prismaClient.dish.findMany({ where: { categoryId: { in: categories } } })
}

export async function createRestaurant(restaurantName: string): Promise<Restaurant> {
  return prismaClient.restaurant.create({ data: { name: restaurantName } })
}

export async function createDishCategory(input: NewDishCategory) {
  return prismaClient.dishCategory.create({
    data: {
      ...input,
    },
  })
}

export async function createOrder(input: Cart) {
  return prismaClient.order.create({ data: { ...input } })
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

export async function getDishesByCategoryFromRestaurant(restaurantId: RestaurantId, language: Language) {
  const categories = await getCategoriesByRestaurant(restaurantId)
  const categoryIds = structuredClone(categories).map((category) => category.id)
  const dishes = await getDishesByCategories(categoryIds)
  const dishesByCategory: DishesByCategory[] = categories.map((category) => ({
    category: {
      ...category,
      name: capitalize(getMultiLanguageStringProperty(category.name, language)),
    },
    dishes: dishes
      .filter((dish) => dish.categoryId == category.id)
      .map((dish) => ({
        ...dish,
        name: getMultiLanguageStringProperty(dish.name, language),
        requiredIngredients: getIngredients(dish.ingredients, language, 'required'),
        optionalIngredients: getIngredients(dish.ingredients, language, 'optional'),
        labels: getMultiLanguageArrayProperty(dish.labels, language),
        allergies: getMultiLanguageArrayProperty(dish.allergies, language),
        nutritions: dish.nutritions as Nutrition,
        description: getMultiLanguageStringProperty(dish.description, language),
      })),
  }))
  return dishesByCategory
}
