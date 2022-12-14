import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyNumeric]'
})
export class OnlyNumericDirective {

    constructor(private readonly elRef: ElementRef) { }
    @HostListener('input', ['$event.target.value'])
    onChangeInput(): void {
        const integerOnly = /[^\d*\.\d+$/]*/g
        const initValue = this.elRef.nativeElement.value;
        this.elRef.nativeElement.value = initValue.replace(integerOnly, '')
    }

}
