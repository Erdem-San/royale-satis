import { Database } from './database'
import { Item } from './item'

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']

export interface OrderItemWithItem extends OrderItem {
    item: Item
}

export interface OrderWithItems extends Order {
    order_items: OrderItemWithItem[]
}
