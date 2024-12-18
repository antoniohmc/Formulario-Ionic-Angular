import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonicModule, ViewDidEnter } from '@ionic/angular';
import { ExploreContainerComponent } from "../explore-container/explore-container.component";
import { Pessoa } from "../model/pessoa";
import { PessoaService } from "../service/pessoa.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, CommonModule
  ]
})

export class Tab2Page implements ViewDidEnter {
  pessoas: Pessoa[] = [];

  constructor(private pessoaService: PessoaService, private router: Router,
    private activatedRouter: ActivatedRoute) { }
      
  editar(pessoa: Pessoa) {
    this.router.navigate(['tabs/tab1', pessoa.email])
  }

  ionViewDidEnter(): void {
    this.listar();
  }

  listar() {
    this.pessoaService.listar().then((data) => {
      if (data) {
        this.pessoas = data
      }
    }).catch(error => {
      console.error(error)
    })
  }

   async deletar(pessoa: Pessoa) {
    const deletado = await this.pessoaService.delete(pessoa.email)
    if(deletado) {
    this.listar()
    }
    }

}