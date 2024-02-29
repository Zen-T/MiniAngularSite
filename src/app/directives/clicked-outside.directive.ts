import { Directive, ElementRef, Output, EventEmitter, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appClickedOutside]'
})
export class ClickedOutsideDirective {

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @Output() public clickedOutside = new EventEmitter();

  ngOnInit() {
    // 添加点击事件监听器，只有在组件外部点击时才触发 clickedOutside 事件
    this.renderer.listen('document', 'click', (event) => {
      if (!this.el.nativeElement.contains(event.target)) {
        this.clickedOutside.emit(event.target);
      }
    });
  }

}

// import {Directive, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';

// @Directive({
//   selector: '[appClickedOutside]'
// })
// export class ClickedOutsideDirective {

//   constructor(private el: ElementRef) { }

//   @Output() public clickedOutside = new EventEmitter();

//   @HostListener('document:click', ['$event.target'])
//   public onClick(target: any) {
//       const clickedInside = this.el.nativeElement.contains(target);
//       if (!clickedInside) {
//         this.clickedOutside.emit(target);
//         console.log(target);
//       }
//   }

// }