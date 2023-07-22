import {FoodItemModel} from "@/app/model/food-item.model";

export interface FoodCategoryModel {
    key: number;
    label: string;
    items: FoodItemModel[];
}