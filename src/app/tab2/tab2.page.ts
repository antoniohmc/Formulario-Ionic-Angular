import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonicModule, ViewDidEnter, ToastController, LoadingController } from '@ionic/angular';
import { Subscription, distinctUntilChanged, debounceTime } from 'rxjs';
import { Pessoa } from "../model/pessoa";
import { PessoaService } from "../service/pessoa.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup } from "@angular/forms";


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule
  ]
})

export class Tab2Page implements ViewDidEnter {
  pessoas: Pessoa[] = []
  loading = false;
  filterForm: FormGroup<any>;
  subscriptions = new Subscription();

  constructor(private pessoaService: PessoaService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private fb: FormBuilder
  ) { 
      this.filterForm = fb.group({
        nome: []
      })
    }

  editar(pessoa: Pessoa) {
    this.router.navigate(['tabs/tab1', pessoa.email])
  }

  ionViewDidEnter(): void {
    this.listar();
  }

  listar() {
    this.loading = true
    this.pessoaService.listar().then((data) => {
      if (data) {
        this.pessoas = data
      }
      this.loading = false
    }).catch(error => {
      console.error(error)
      this.loading = false
    })
  }

  async filtrar(nome: string) {
    const pessoas = await this.pessoaService.findByNome(nome)
    this.pessoas = pessoas
  }



  async deletar(pessoa: Pessoa) {
    const deletado = await this.pessoaService.delete(pessoa.email)
    if (deletado) {
      this.listar()
      const toast = await this.toastController.create({
        message: 'Pessoa deletada com sucesso',
        duration: 1500,
        position: 'top'
      })

      await toast.present();
    }
  }

  async showLoading() {
    const loading = await this.loadingController.create({
      message: 'Dismissing after 3 seconds...',
      duration: 3000
    });

    loading.present();
  }


  ngOnInit(): void {
    const sub = this.filterForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(value => this.filtrar(value.nome!))
    this.subscriptions.add(sub)
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe()
  }


}