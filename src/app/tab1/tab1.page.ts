import { Component } from '@angular/core';
import { AlertController, IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from
  '@angular/forms';
import { PessoaService } from '../service/pessoa.service';
import { Pessoa } from '../model/pessoa';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonicModule, ExploreContainerComponent, ReactiveFormsModule],
})
export class Tab1Page {
  formGroup: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    telefone: [''],
    email: ['', Validators.email],
    hobie: [''],
  })
  emailToEdit: null | string | undefined;

  constructor(private fb: FormBuilder,
    private pessoaService: PessoaService,
    private activedRouter: ActivatedRoute
  ) { }
  async salvar() {
    if (this.emailToEdit) {
      this.pessoaService.editar(this.formGroup.value, this.emailToEdit)
    } else {
      this.pessoaService.criar(this.formGroup.value)
    }
  }

  ionViewDidEnter(): void {
    this.emailToEdit = null
    const email = this.activedRouter.snapshot.paramMap.get("email");
    if (email) {
      console.log(email)
      this.pessoaService.get(email).then(pessoa => {
        if (pessoa) {
          this.formGroup.patchValue(pessoa)
          this.emailToEdit = email
        }
      })
    }
  }



}    
