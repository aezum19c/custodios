import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAllowCharacter]'
})
export class AllowCharacterDirective {

    constructor(private readonly elRef: ElementRef) { }
    @HostListener('input', ['$event.target.value'])
    onChangeInput(): void {
        const characterOnly = /[^ A-Za-zñÑ0-9"\'\\\\¿?|!¡@%&()/+*$,;._<>-]*/g
        //const characterOnly = /[^a-zA-Z0-9]*/g 
        const initValue = this.elRef.nativeElement.value;
        this.elRef.nativeElement.value = initValue.replace(characterOnly, '')
    }

}
