export interface Permissions {
  menu: string,
  permissions: {
    approve?: boolean,
    close?: boolean,
    open?: boolean,
    show?: boolean,
    add?: boolean,
    show_all?: boolean,
    approve_product_categories?: boolean,
    engineering_and_design?: boolean,
    production?: boolean,
    financial?: boolean
  }
}
