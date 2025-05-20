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
      datasourceId: 'afvto8jyhbt1we54zait7nmo',
    },
    {
      title: 'Title',
      description: 'Genre',
      path: 'Poster',
      datasourceId: 'qn426ptegyc8owv9y0kd3imj',
    },
  ]
}
