export const setAllTextareaBlur = (allTextarea) => {
    for (const textarea of allTextarea) {
        textarea.blur();
    }
}