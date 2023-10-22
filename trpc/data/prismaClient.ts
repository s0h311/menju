import type { Restaurant as PRestaurant } from '@prisma/client'
import type { DishCategory, DishesByCategory } from '@/types/dish.type'
import type { DBDish, DBDishCategory } from '@/types/db/dish.db.type'
import type { Language, RestaurantId } from '@/types/order.type'
import { capitalize, getMultiLanguageStringProperty, mapDish } from '@/trpc/helpers/dishHelpers'
import type { JsonObject } from '@prisma/client/runtime/library'
import type { RegisterCredentials } from '@/types/credentials.type'
import { prismaClient } from '../trpcServer'
import type { Features } from '@/types/restaurant.type'

export async function getRestaurant(restaurantId: RestaurantId) {
  return prismaClient.restaurant.findFirst({ where: { id: restaurantId } })
}

export async function updateFeatures(id: RestaurantId, features: Features): Promise<PRestaurant> {
  const data = await prismaClient.restaurant.update({ where: { id }, data: { features } })
  console.log('[Prisma Client] - updateFeatures', data)
  return data
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

export async function createRestaurant(
  registerCredentials: Pick<RegisterCredentials, 'name' | 'abbreviation'>
): Promise<PRestaurant> {
  return prismaClient.restaurant.create({
    data: { name: registerCredentials.name, abbreviation: registerCredentials.abbreviation },
  })
}

// DISH CATEGORY CRUD //

export async function createDishCategory(input: DBDishCategory) {
  return prismaClient.dishCategory.create({
    data: {
      ...input,
    },
  })
}

export async function updateDishCategory(input: DBDishCategory): Promise<DishCategory> {
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

export async function createDish(dbDish: DBDish) {
  const dish = await prismaClient.dish.create({
    data: {
      ...dbDish,
      labels: dbDish.labels as unknown as JsonObject,
      allergies: dbDish.allergies as unknown as JsonObject,
      nutritions: dbDish.nutritions as JsonObject,
      description: dbDish.description as JsonObject,
    },
  })
  return mapDish(dish, 'de')
}

export async function updateDish(dbDish: DBDish) {
  const dish = await prismaClient.dish.update({
    where: {
      id: dbDish.id,
    },
    data: {
      ...dbDish,
      labels: dbDish.labels as unknown as JsonObject,
      allergies: dbDish.allergies as unknown as JsonObject,
      nutritions: dbDish.nutritions as JsonObject,
      description: dbDish.description as JsonObject,
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
