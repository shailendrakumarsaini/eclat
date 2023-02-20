import { Component, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'test';
  public result = null;
  parseError :boolean;
  parsedJSON;
  panelOpenState = false;
  step = 0;
  
  constructor(){ }
  ngOnInit(): void {}

  validate(json){
    try{
      this.parsedJSON = JSON.parse(json);
      this.parseError = false;
      this.setStep(1)
    } catch(ex){
      this.parseError = true;
    }
  }



  setStep(index: number) { this.step = index; }

  nextStep() { this.step++; }

}
