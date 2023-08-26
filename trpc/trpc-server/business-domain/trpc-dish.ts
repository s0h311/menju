import {JSONValue} from "superjson/dist/types";
import {Language} from "@/app/types/order.type";
import {Ingredient, MultiLanguageArrayProperty, MultiLanguageStringProperty} from "@/app/types/dish.type";

export const getMultiLanguageStringProperty = (property: JSONValue, language: Language): string => {
    if (property && typeof property === 'object') {
        const data = property as MultiLanguageStringProperty
        return data[language]
    }
    return ''
}

export const getMultiLanguageArrayProperty = (property: JSONValue, language: Language): string[] => {
    if (property && typeof property === 'object') {
        const data = property as MultiLanguageArrayProperty
        return data[language]
    }
    return []
}

export const getIngredients = (property: JSONValue, language: Language, type: 'required' | 'optional'): string[] => {
    if (property && typeof property === 'object') {
        const data = property as Ingredient
        return data[type][language]
    }
    return []
}