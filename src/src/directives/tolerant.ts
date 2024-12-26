import { DirectiveBinding } from 'vue';
const handle = (el: HTMLElement, binding: DirectiveBinding<string>) => {
  // 当前dom的内容
  const { innerText } = el;
  const replacement: string = binding.value || '--';
  if (innerText !== replacement) {
    // 内容为空
    if (/null|undefined|nan|^\s*$/gi.test(innerText)) {
      el.innerText = replacement;
    }
  }
};
export default {
  bind(el: HTMLElement, binding: DirectiveBinding<string>) {
    handle(el, binding);
  },
  componentUpdated(el: HTMLElement, binding: DirectiveBinding<string>) {
    handle(el, binding);
  }
};
