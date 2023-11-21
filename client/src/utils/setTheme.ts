export const setTheme = (theme: string) => {
  const body: HTMLBodyElement = document.querySelector('body') as HTMLBodyElement;
  body.dataset.theme = theme;
};
