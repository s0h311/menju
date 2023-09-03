import {JSONValue} from "superjson/dist/types";
import {Language} from "@/types/order.type";
import {
    Ingredient,
    MultiLanguageArrayProperty,
    MultiLanguageStringProperty
} from "@/types/dish.type";

export const capitalize = (text: string): string => text.charAt(0).toUpperCase() + text.slice(1)

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
