import { Database } from './database'

export type Item = Database['public']['Tables']['items']['Row']
export type Category = Database['public']['Tables']['categories']['Row']

export interface ItemWithCategory extends Item {
    categories: Category
}

export interface ItemStats {
    [key: string]: number | string
}
