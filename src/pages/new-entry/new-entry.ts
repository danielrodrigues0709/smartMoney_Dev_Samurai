import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

/**
 * Generated class for the NewEntryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-entry',
  templateUrl: 'new-entry.html',
})
export class NewEntryPage {
  entryForm: FormGroup;

  entry = {}

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public sqlite: SQLite,
    private builder: FormBuilder) {

    this.entryForm = builder.group({
      amount: new FormControl('', Validators.compose([Validators.required, Validators.pattern('[0-9,\.]+')])),
      category_id: new FormControl('', Validators.required),
    });
  }

  ionViewDidLoad() { }

  submitForm() {
    console.log('Submit form');
    console.log(JSON.stringify(this.entry));

    // rotinas de banco de dados
    this.insertBD();

    this.navCtrl.pop();
  }

  goBack() {
    console.log('Go back');
    // sair sem fazer nada
    this.navCtrl.pop();
  }

  insertBD() {
    console.log('Inicio da gravação no BD');

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        console.log('BD criado');

        db.sqlBatch([
          ["CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, amount DECIMAL, description TEXT)"]
        ])
          .then(() => {
            const sql = "INSERT INTO entries (amount, description) VALUES (?, ?)";
            const data = [this.entry['amount'], this.entry['description']];

            return db.executeSql(sql, data)
              .then(() => {
                console.log('Valores inseridos com sucesso')
              })
              .catch(() => {
                console.error("Erro ao inserir valores")
              })
          })
          .catch(() => {
            console.error("Erro ao criar BD")
          });
      })
  }
}