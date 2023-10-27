'use client'

import { useMenuStore } from '@/store/menuStore'
import useStore from '@/hooks/useStore'
import type { Dish, DishCategory, DishIntersection, DishesByCategory } from '@/types/dish.type'
import React, { useState } from 'react'
import CardGrid from '@/components/kitchen/cardGrid'
import Card from '@/components/kitchen/card'
import AddDishCategory from '@/components/kitchen/addDishCategory'
import Dialog from '@/ui/dialog'
import { trpc } from '@/trpc/trpc'
import AddDish from '@/components/kitchen/addDish'
import useDish from '@/hooks/useDish'
import ReorderDialog from '@/components/kitchen/reorderDialog'

type ManageDishesProps = {
  restaurantId: number
}

export default function ManageDishes({ restaurantId }: ManageDishesProps) {
  const [activeDishesCategory, setActiveDishesCategory] = useState<DishesByCategory | null>(null)
  const [itemsToReorder, setItemsToReorder] = useState<DishIntersection[] | null>(null)
  const [editingDishCategory, setEditingDishCategory] = useState<DishCategory | null>(null)
  const [deletingDishCategory, setDeletingDishCategory] = useState<DishCategory | null>(null)
  const [editingDish, setEditingDish] = useState<Dish | null>(null)
  const [deletingDish, setDeletingDish] = useState<Dish | null>(null)
  const [open, setOpen] = useState<boolean>(false)

  const menuStore = useStore(useMenuStore, (state) => state)
  const { dishesByCategory } = useDish({ restaurantId, language: 'de' })

  const allDishes: Dish[] =
    dishesByCategory
      .filter((dishesByCategory: DishesByCategory) => dishesByCategory.dishes.length)
      .map((dishesByCategory: DishesByCategory) => dishesByCategory.dishes)
      .flat() || []

  const deleteDishCategoryMutation = trpc.deleteDishCategory.useMutation()
  const deleteDishMutation = trpc.deleteDish.useMutation()

  const deleteDishCategory = (): void => {
    if (deletingDishCategory) {
      deleteDishCategoryMutation.mutateAsync(deletingDishCategory.id, {
        onSuccess: () => {
          menuStore?.removeDishCategory(deletingDishCategory.id)
          setDeletingDishCategory(null)
        },
      })
    }
  }

  const deleteDish = (): void => {
    if (deletingDish) {
      deleteDishMutation.mutateAsync(deletingDish.id, {
        onSuccess: () => {
          menuStore?.removeDish(deletingDish.categoryId, deletingDish.id)
          setDeletingDish(null)
        },
      })
    }
  }

  return (
    <section className='grid grid-cols-2 gap-5 xl:gap-10 w-full h-full'>
      <CardGrid
        title='Kategorien'
        contentType='dishCategory'
        onReorder={() => {
          const allCategories = dishesByCategory.map((category: DishesByCategory) => category.category)
          setItemsToReorder(allCategories)
        }}
      >
        {dishesByCategory
          .sort((card0: DishesByCategory, card1: DishesByCategory) => card0.category.priority - card1.category.priority)
          .map((card: DishesByCategory) => (
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
        contentType='dish'
        withReset
        onReorder={() => {
          activeDishesCategory ? setItemsToReorder(activeDishesCategory.dishes) : setOpen(true)
        }}
        onReset={() => setActiveDishesCategory(null)}
      >
        {(activeDishesCategory?.dishes || allDishes)
          .sort((dish0, dish1) => dish0.priority - dish1.priority)
          .map((card: Dish) => (
            <Card
              key={card.id}
              title={card.name}
              image={card.picture || ''}
              onClick={() => setEditingDish(card)}
              onEdit={() => setEditingDish(card)}
              onDelete={() => setDeletingDish(card)}
            >
              Preis: {card.price.toFixed(2)} EUR
            </Card>
          ))}
      </CardGrid>

      {editingDish && (
        <AddDish
          open={!!editingDish}
          editingDish={editingDish}
          onClose={() => setEditingDish(null)}
        />
      )}

      {itemsToReorder && (
        <ReorderDialog
          items={itemsToReorder}
          setOpenDialog={setItemsToReorder}
        />
      )}

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

      <Dialog
        sx={{ display: 'grid', placeItems: 'center', marginTop: '20px' }}
        open={!!deletingDish}
        closeText='Abbrechen'
        proceedText='Löschen'
        maxWidth='xs'
        onClose={() => setDeletingDish(null)}
        onProceed={deleteDish}
        revertSuccessError
      >
        Möchtest du wirklich dieses Gericht löschen?
      </Dialog>

      <Dialog
        sx={{ display: 'grid', placeItems: 'center', marginTop: '20px' }}
        open={open}
        maxWidth='xs'
        closeText={'Weiter'}
        revertSuccessError
        onClose={() => setOpen(false)}
      >
        Wähle zunächst eine Kategorie aus um die Gerichte neu anzuordnen.
      </Dialog>
    </section>
  )
}
