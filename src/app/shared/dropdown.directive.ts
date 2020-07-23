import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  // binding to class propert of the affecyted element
  // and accessing bootstrap open class to open the dropdown
  @HostBinding('class.open') isOpen = false;

  // Adding document click to handle the even click outside the dropdown button
  @HostListener('document:click', ['$event']) toggleOpen(event: Event): void {
    this.isOpen = this.elementRef.nativeElement.contains(event.target) ? !this.isOpen : false;
  }

  constructor(private elementRef: ElementRef) { }

}
