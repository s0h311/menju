import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Batman',
      abbreviation: 'BTM',
    },
  })

  const dishCategory1 = await prisma.dishCategory.create({
    data: {
      name: { en: 'lunch', de: 'mittagessen', it: 'pranzo' },
      picture:
        'https://xtapuuiutmkpsjijkgfw.supabase.co/storage/v1/object/public/pictures/examples/schnelles-mittagessen.jpg',
      restaurantId: restaurant.id,
    },
  })

  const dish1 = await prisma.dish.create({
    data: {
      name: { en: 'Doner kebab', de: 'Döner', it: 'Kebab' },
      price: 6.5,
      picture:
        'https://xtapuuiutmkpsjijkgfw.supabase.co/storage/v1/object/public/pictures/examples/doener.jpg?t=2023-09-22T03%3A52%3A14.870Z',
      ingredients: {
        required: [{ de: 'Bread', en: 'Brot', it: 'pane' }],
        optional: [
          { de: 'Fleisch', en: 'Meat', it: 'Carne' },
          { de: 'Salat', en: 'Salat', it: 'Insalata' },
          { de: 'Soße', en: 'Sauce', it: 'Salsa' },
        ],
      },
      labels: [
        { de: 'Vegan', en: 'Vegan', it: 'Vegan' },
        { de: 'Sehr beliebt', en: 'Popular', it: 'Popular' },
        { de: 'Gibts nur hier', en: 'Only here', it: 'Only here' },
        { de: 'Geiles Frühstück', en: 'Best Breakfast', it: 'Best Breakfast' },
      ],
      nutritions: { energy: 560, protein: 30 },
      dietType: 'VEGAN',
      description: {
        de: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.',
        en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.',
        it: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      },
      categoryId: dishCategory1.id,
      saleStartDate: null,
      saleEndDate: null,
      salePrice: null,
      saleDays: [],
    },
  })

  const dishCategory2 = await prisma.dishCategory.create({
    data: {
      name: { en: 'dinner', de: 'abendessen', it: 'cena' },
      picture: 'https://xtapuuiutmkpsjijkgfw.supabase.co/storage/v1/object/public/pictures/examples/zucchini.jpeg',
      restaurantId: restaurant.id,
    },
  })

  const dish2 = await prisma.dish.create({
    data: {
      name: { en: 'Pasta', de: 'Nudeln', it: 'Pasta' },
      price: 9.3,
      picture: 'https://xtapuuiutmkpsjijkgfw.supabase.co/storage/v1/object/public/pictures/examples/nudeln.webp',
      ingredients: {
        required: [{ de: 'Nudeln', en: 'Pasta', it: 'Pasta' }],
        optional: [
          { de: 'Parmesan', en: 'Parmesan', it: 'Parmigiano' },
          { de: 'Tomatensoße', en: 'Tomato sauce', it: 'Salsa di pomodoro' },
        ],
      },
      labels: [
        { de: 'Vegan', en: 'Vegan', it: 'Vegan' },
        { de: 'Sehr beliebt', en: 'Popular', it: 'Popular' },
        { de: 'Gibts nur hier', en: 'Only here', it: 'Only here' },
        { de: 'Krass', en: 'wow', it: 'nice' },
        { de: 'Geiles Frühstück', en: 'Best Breakfast', it: 'Best Breakfast' },
      ],
      nutritions: { energy: 560, protein: 30 },
      dietType: 'VEGAN',
      description: {
        de: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.',
        en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.',
        it: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      },
      categoryId: dishCategory2.id,
      saleStartDate: null,
      saleEndDate: null,
      salePrice: null,
      saleDays: [],
    },
  })

  const dish3 = await prisma.dish.create({
    data: {
      name: { en: 'Pizza', de: 'Pizza', it: 'Pizza' },
      price: 11.8,
      picture: 'https://xtapuuiutmkpsjijkgfw.supabase.co/storage/v1/object/public/pictures/examples/pizza.jpg',
      ingredients: {
        required: [{ de: 'teig', en: 'dough', it: 'impasto' }],
        optional: [
          { de: 'tomatensoße', en: 'tomatosauce', it: 'salsa di pomodoro' },
          { de: 'Käse', en: 'Cheese', it: 'Formaggio' },
        ],
      },
      labels: [
        { de: 'Beste Pizza der Stadt', en: 'Best pizza in town', it: 'La migliore pizza in città' },
        { de: 'Sehr beliebt', en: 'Popular', it: 'Popular' },
        { de: 'Gibts nur hier', en: 'Only here', it: 'Only here' },
        { de: 'Krass', en: 'wow', it: 'nice' },
      ],
      nutritions: { energy: 560, protein: 30 },
      dietType: 'VEGAN',
      description: {
        de: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.',
        en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.',
        it: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      },
      categoryId: dishCategory2.id,
      saleStartDate: null,
      saleEndDate: null,
      salePrice: null,
      saleDays: [],
    },
  })

  const dish4 = await prisma.dish.create({
    data: {
      name: { de: 'Pizza', en: 'Pizza', it: 'Pizza' },
      price: 7.5,
      picture: 'https://xtapuuiutmkpsjijkgfw.supabase.co/storage/v1/object/public/pictures/examples/flammenkuchen.jpg',
      categoryId: dishCategory1.id,
      ingredients: {
        required: [{ de: 'teig', en: 'dough', it: 'impasto' }],
        optional: [{ de: 'tomatensoße', en: 'tomatosauce', it: 'salsa di pomodoro' }],
      },
      labels: [{ de: 'Beste Pizza der Stadt', en: 'Best pizza in town', it: 'La migliore pizza in città' }],
      allergies: [
        { de: 'Nuss', en: 'Nut', it: 'noce' },
        { de: 'Soja', en: '', it: '' },
      ],
      nutritions: {
        energy: 790,
        protein: 34,
      },
      dietType: 'VEGETARIAN',
      description: {
        de: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
        en: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
        it: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque tempore explicabo id.',
      },
      saleStartDate: new Date(),
      saleEndDate: new Date(),
      salePrice: 6.5,
      saleDays: [0, 2, 6],
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
