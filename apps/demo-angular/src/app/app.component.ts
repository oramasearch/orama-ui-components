import { Component } from '@angular/core'
import { CollectionManager } from '@orama/core'

const clientInstance = new CollectionManager({
  url: 'https://collections.orama.com',
  collectionID: 'ncd7zwmirytw1o47dogru4bz',
  readAPIKey: 'df00PbXP0dbRUcJgFeFZSNNb7AhsqCw8',
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'demo-angular'
  clientInstance = clientInstance
  sourcesMap = [
    {
      title: 'name',
      description: (item: { sex: string; country: string }) => `${item.sex} - ${item.country}`,
      path: 'country',
      datasourceId: 'dyaqkvxo36199sn6yd7saegdf',
    },
    {
      title: 'Title',
      description: 'Genre',
      path: 'Poster',
      datasourceId: 'jrmilfazf47z8xq2v4n8xs6ww',
    },
  ]
}
