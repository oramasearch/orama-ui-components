import { Component } from '@angular/core'
import { CollectionManager } from '@orama/core'

const clientInstance = new CollectionManager({
    url:'https://oramacore.orama.foo',
    collectionID: 'cxlenmho72jp3qpbdphbmfdn',
    readAPIKey: 'caTS1G81uC8uBoWICSQYzmGjGVBCqxrf',
  })

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'demo-angular'
  clientInstance = clientInstance
}
