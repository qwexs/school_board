const rg1 = new RegExp(/^[^\\/:[\]*\]?"<>[\]|]+$/); // forbidden characters \ / : * ? " < > |
const rg2 = /^\./; // cannot start with dot (.)
const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names

export const validFileName = (value) => {
    return rg1.test(value) && !rg2.test(value) && !rg3.test(value);
};
