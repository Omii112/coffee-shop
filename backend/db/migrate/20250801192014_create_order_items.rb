class CreateOrderItems < ActiveRecord::Migration[8.0]
  def change
    create_table :order_items do |t|
      t.references :order, null: false, foreign_key: true
      t.references :menu_item, null: false, foreign_key: true
      t.integer :quantity
      t.decimal :price
      t.string :size
      t.json :customizations

      t.timestamps
    end
  end
end
