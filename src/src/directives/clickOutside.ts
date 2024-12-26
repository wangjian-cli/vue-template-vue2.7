// 点击外部事件处理函数
function handleClickOutside(el: HTMLElement, binding: any) {
  const onClick = (event: MouseEvent) => {
    if (!(el === event.target || el.contains(event.target as Node))) {
      binding.value();
    }
  };

  el.clickOutsideHandler = onClick;

  // 添加事件监听器
  document.addEventListener('click', onClick);
}

// 移除事件监听器
function removeClickOutside(el: HTMLElement) {
  if (el.clickOutsideHandler) {
    document.removeEventListener('click', el.clickOutsideHandler);
    delete el.clickOutsideHandler;
  }
}

// 注册自定义指令
const clickOutside = {
  bind(el: HTMLElement, binding: any) {
    // 使用 bind 钩子在元素插入 DOM 时绑定事件
    handleClickOutside(el, binding);
  },
  unbind(el: HTMLElement) {
    // 使用 unbind 钩子在指令与元素解绑时移除事件
    removeClickOutside(el);
  },
  update(el: HTMLElement, binding: any) {
    // 处理指令参数更新时的情况
    if (binding.oldValue !== binding.value) {
      removeClickOutside(el);
      handleClickOutside(el, binding);
    }
  }
};

export default clickOutside;
