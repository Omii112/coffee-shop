class CreateMenuItems < ActiveRecord::Migration[8.0]
  def change
    create_table :menu_items do |t|
      t.string :name
      t.text :description
      t.decimal :price
      t.string :image
      t.string :category
      t.json :sizes
      t.json :customizations
      t.boolean :popular

      t.timestamps
    end
  end
end
