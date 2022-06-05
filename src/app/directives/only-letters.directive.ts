import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[apponlyletters]'
})
export class OnlyLettersDirective {

  private regex: RegExp = new RegExp(/^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]*$/g);

  constructor(private el: ElementRef) {
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

}