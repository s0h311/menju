'use client'

import { useMenuStore } from '@/store/menu-store'
import useStore from '@/store/nextjs-hook'
import { Dish, DishCategory, DishesByCategory } from '@/types/dish.type'
import { useState } from 'react'
import CardGrid from '@/components/kitchen/cardGrid'
import Card from '@/components/kitchen/card'
import AddDishCategory from '@/components/kitchen/addDishCategory'
import Dialog from '@/ui/dialog'
import { trpc } from '@/trpc/trpc'

export default function KitchenDishes() {
  const [activeDishesCategory, setActiveDishesCategory] = useState<DishesByCategory | null>(null)
  const [editingDishCategory, setEditingDishCategory] = useState<DishCategory | null>(null)
  const [deletingDishCategory, setDeletingDishCategory] = useState<DishCategory | null>(null)

  const menuStore = useStore(useMenuStore, (state) => state)
  const allDishes: Dish[] =
    menuStore?.allDishes
      .filter((dishesByCategory: DishesByCategory) => dishesByCategory.dishes.length)
      .map((dishesByCategory: DishesByCategory) => dishesByCategory.dishes)
      .flat() || []

  const deleteDishCategoryMutation = trpc.deleteDishCategory.useMutation()

  const deleteDishCategory = (): void => {
    if (deletingDishCategory) {
      deleteDishCategoryMutation.mutateAsync(deletingDishCategory?.id, {
        onSuccess: () => {
          menuStore?.removeDishCategory(deletingDishCategory?.id)
          setDeletingDishCategory(null)
        },
      })
    }
  }

  return (
    <section className='grid grid-cols-2 gap-5 xl:gap-10 w-full h-full'>
      <CardGrid title='Kategorien'>
        {menuStore?.allDishes.map((card: DishesByCategory) => (
          <div key={card.category.id}>
            {!editingDishCategory || editingDishCategory.id !== card.category.id ? (
              <Card
                key={card.category.id}
                title={card.category.name}
                image={card.category.picture || card.dishes.at(0)?.picture || ''}
                onClick={() => setActiveDishesCategory(card)}
                onEdit={() => setEditingDishCategory(card.category)}
                onDelete={() => setDeletingDishCategory(card.category)}
              >
                Anzahl Gerichte: {card.dishes.length}
              </Card>
            ) : (
              <AddDishCategory
                editingDishCategory={card.category}
                onClose={() => setEditingDishCategory(null)}
              />
            )}
          </div>
        ))}
      </CardGrid>
      <CardGrid
        title={activeDishesCategory ? `Gerichte - ${activeDishesCategory.category.name}` : 'Alle Gerichte'}
        withReset
        onReset={() => setActiveDishesCategory(null)}
      >
        {(activeDishesCategory?.dishes || allDishes).map((card: Dish) => (
          <Card
            key={card.id}
            title={card.name}
            image={card.picture || ''}
          >
            {card.price}
          </Card>
        ))}
      </CardGrid>

      <Dialog
        sx={{ display: 'grid', placeItems: 'center', marginTop: '20px' }}
        open={!!deletingDishCategory}
        closeText='Abbrechen'
        proceedText='Löschen'
        maxWidth='xs'
        onClose={() => setDeletingDishCategory(null)}
        onProceed={deleteDishCategory}
        revertSuccessError
      >
        Möchtest du wirklich diese Kategorie löschen?
      </Dialog>
    </section>
  )
}
