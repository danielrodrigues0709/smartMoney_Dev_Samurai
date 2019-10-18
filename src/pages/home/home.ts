import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewEntryPage } from '../new-entry/new-entry';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public sqlite: SQLite) {}

  addEntry() {
    console.log("Adicionar lançamento");
    this.navCtrl.push(NewEntryPage);
  }

  testeDb() {
    console.log("Teste de BD");

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
    .then((db: SQLiteObject) => {
      console.log("BD criado")

      // Cria tabela
      this.createTable(db)
      .then(() =>{
        console.log("Tabela criada");

        const vAmount = 22.2;
        const vDescription = 'Daniel'

        this.insert(vAmount, vDescription, db);

          // Seleciona registros
          this.select(db)
          .then((values: any) => {

            console.log(values.rows.length);

            for (var i=0; i < values.rows.length;  i++) {
              console.log(JSON.stringify(values.rows.item(i)));
            }

            console.log("------------------------")

            // Soma saldo
            this.balance(db)
              .then((values: any) => {
                if (values.rows.length > 0) {
                  const item = values.rows.item(0);
                  console.log("Saldo atual: ", item.balance);
                }
              });
        })
      })
    })
    .catch(() => {
      console.error("Erro ao criar BD")
    })

  }

  createTable(db) {

    // Cria tabela
    return db.sqlBatch([
      ["CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL, description TEXT)"]
    ])
      .catch(() => {
        console.error("Erro ao executar o comando SQL")
      });
  }

  insert(vAmount, vDescription, db) {
    
    // Insere valor qualquer
    const sql = "INSERT INTO entries (amount, description) VALUES (?, ?)";
    const data = [vAmount, vDescription];

    return db.executeSql(sql, data)
      .catch(() => {
        console.error("Erro ao inserir valores")
      })
  }

  update(vAmount, vDescription,id, db) {

    //Altera valores
    const sql = "UPDATE entries SET amount = ?, description = ? WHERE id = ?";
    const data = [vAmount, vDescription, id]

    return db.executeSql(sql, data)
      .catch(() => {
        console.error("Erro ao atualizar valores")
      })
  }

  delete(id, db) {

    // Deleta registros
    const sql = "DELETE FROM entries WHERE id = ?";
    const data = [id];

    return db.executeSql(sql, data)
      .catch(() => {
        console.error("Erro ao deletar valores")
      })
  }

  select(db) {

    // Seleciona registros
    const sql = "SELECT id, amount, description FROM entries;";
    const data = [];

    return db.executeSql(sql, data)
      .catch(() => {
        console.error("Erro ao selecionar valores")
      })
  }

  balance(db) {

    // Soma saldo
    const sql = "SELECT SUM(amount) AS balance FROM entries;";
    const data = [];

    return db.executeSql(sql, data)
      .catch(() => {
        console.error("Erro ao somar valores");
      });
  }

}
