export const validators = {
    name: /^[A-Za-zА-Яа-я\s]{2,40}$/,

    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    password: /^.{6,}$/,

    cryptoSymbol: /^[A-Z0-9]{2,10}$/,

    positiveNumber: /^(?!0$)(\d+(\.\d+)?|0\.\d+)$/,

    feedbackMessage: /^.{3,300}$/,

    role: /^(User|Admin)$/,

    rating: /^[1-5]$/
};