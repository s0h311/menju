import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const main = async () => {
  const restaurant = await prisma.restaurant.create({
    data: {
      name: 'Batman',
    },
  })

  const dishCategory1 = await prisma.dishCategory.create({
    data: {
      name: { en: 'lunch', de: 'mittagessen', it: 'pranzo' },
      picture: 'https://lenamerz.de/wp-content/uploads/2021/03/schnelle-mittagessen-fuers-homeoffice.jpg',
      restaurantId: restaurant.id,
    },
  })

  const dish1 = await prisma.dish.create({
    data: {
      name: { en: 'Doner kebab', de: 'Döner', it: 'Kebab' },
      price: 6.5,
      picture: 'https://www.blog.vegan-masterclass.de/wp-content/uploads/2021/09/Doener_mit_gegrillter_Paprika.jpg',
      ingredients: {
        required: {
          en: ['Meat', 'Bread', 'Salat', 'Sauce'],
        },
        optional: {
          en: ['Meat', 'Bread', 'Salat', 'Sauce'],
          de: ['Fleisch', 'Brot', 'Salat', 'Soße'],
          it: ['Carne', 'Pane', 'Insalata', 'Salsa'],
        },
      },
      labels: {
        de: ['Vegan', 'Sehr beliebt', 'Gibts nur hier', 'Geiles Frühstück'],
        en: ['Vegan', 'Popular', 'Only here', 'Best Breakfast'],
        it: ['Vegan', 'Popular', 'Only here', 'Best Breakfast'],
      },
      nutritions: { energy: 560, protein: 30 },
      type: 'VEGAN',
      description: {
        de: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.',
        en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.',
        it: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      },
      categoryId: dishCategory1.id,
    },
  })

  const dishCategory2 = await prisma.dishCategory.create({
    data: {
      name: { en: 'dinner', de: 'abendessen', it: 'cena' },
      picture: 'https://images.lecker.de/leichtes-abendessen-b15jpg,id=ef48bb96,b=lecker,w=1600,rm=sk.jpeg',
      restaurantId: restaurant.id,
    },
  })

  const dish2 = await prisma.dish.create({
    data: {
      name: { en: 'Pasta', de: 'Nudeln', it: 'Pasta' },
      price: 9.3,
      picture:
        'https://www.eatbetter.de/sites/eatbetter.de/files/styles/facebook/public/2021-07/nudeln_mit_kichererbsen_1.jpg?h=4521fff0&itok=C9tS61Im',
      ingredients: {
        required: {
          en: ['Pasta', 'Parmesan', 'Tomato sauce'],
        },
        optional: {
          en: ['Pasta', 'Parmesan', 'Tomato sauce'],
          de: ['Nudeln', 'Parmesan', 'Tomatensoße'],
          it: ['Pasta', 'Parmigiano', 'Salsa di pomodoro'],
        },
      },
      labels: {
        de: ['Vegan', 'Sehr beliebt', 'Gibts nur hier', 'Geiles Frühstück'],
        en: ['Vegan', 'Popular', 'Only here', 'Best Breakfast'],
        it: ['Vegan', 'Popular', 'Only here', 'Best Breakfast'],
      },
      nutritions: { energy: 560, protein: 30 },
      type: 'VEGAN',
      description: {
        de: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.',
        en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.',
        it: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      },
      categoryId: dishCategory2.id,
    },
  })

  const dish3 = await prisma.dish.create({
    data: {
      name: { en: 'Pizza', de: 'Pizza', it: 'Pizza' },
      price: 11.8,
      picture:
        'https://www.hamburg.de/image/15536634/kingTeaser/990/420/d4e83a1a6365d5c6804a9bf2ccef7fbc/RS/symbolbild-pizza-bild.jpg',
      ingredients: {
        required: {
          en: ['Dough', 'Cheese', 'Tomato sauce'],
        },
        optional: {
          en: ['Dough', 'Cheese', 'Tomato sauce'],
          de: ['Teig', 'Käse', 'Tomatensoße'],
          it: ['Impasto', 'Formaggio', 'Salsa di pomodoro'],
        },
      },
      labels: {
        de: ['Vegan', 'Sehr beliebt', 'Gibts nur hier', 'Geiles Frühstück'],
        en: ['Vegan', 'Popular', 'Only here', 'Best Breakfast'],
        it: ['Vegan', 'Popular', 'Only here', 'Best Breakfast'],
      },
      nutritions: { energy: 560, protein: 30 },
      type: 'VEGAN',
      description: {
        de: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis, porro voluptate numquam quae facere odit fugiat.',
        en: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet quod quos perspiciatis.',
        it: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      },
      categoryId: dishCategory2.id,
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
