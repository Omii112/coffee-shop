class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email
      t.string :phone
      t.text :address
      t.string :password_digest
      t.boolean :is_admin
      t.integer :reward_points
      t.datetime :member_since

      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end
